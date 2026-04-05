# Roblox Studio MCP — Live Game Context

When the Roblox Studio MCP server is connected, you have full read/write/execute access to the live game. This is the most powerful source — it bridges documentation with real-time state.

## Contents
- [Session Management](#session-management)
- [Game Tree Exploration](#game-tree-exploration)
- [Script Tools](#script-tools)
- [Live Execution & Testing](#live-execution--testing)
- [Asset Generation & Marketplace](#asset-generation--marketplace)
- [Playtest Interaction](#playtest-interaction)
- [Visual Capture](#visual-capture)
- [Cross-Reference Patterns](#cross-reference-patterns)

## Session Management

Before any Studio interaction, ensure the right instance is active:

```
mcp__Roblox_Studio__list_roblox_studios   → list all open Studio instances (name, id, active status)
mcp__Roblox_Studio__set_active_studio     → switch active instance by studio_id
```

**Always verify** the active Studio when the user has multiple places open.

## Game Tree Exploration

```
mcp__Roblox_Studio__search_game_tree   → explore hierarchy with filters (path, instance_type, keywords, max_depth)
mcp__Roblox_Studio__inspect_instance   → get all properties, attributes, children summary for a specific instance
```

- `search_game_tree` supports `instance_type` (IsA check: `"BasePart"`, `"BaseScript"`, `"GuiObject"`), `keywords`, `path`, and `max_depth` (default 3, max 10)
- `inspect_instance` returns every readable property, custom attributes, and recursive child counts
- Both return `className` which you can feed into API documentation lookups for that class

## Script Tools

```
mcp__Roblox_Studio__script_read     → read a script's full source (dot-notation path)
mcp__Roblox_Studio__script_grep     → regex search across ALL scripts in the game (capped at 50 matches)
mcp__Roblox_Studio__script_search   → fuzzy name search to find scripts by name (capped at 10 results)
mcp__Roblox_Studio__multi_edit      → create new scripts OR make multiple edits to existing scripts atomically
```

- `script_search` is for when you know the name but not the path — use it before `script_read`
- `multi_edit` can **create** scripts (provide `className`: `"Script"`, `"LocalScript"`, or `"ModuleScript"`) or edit existing ones
- For new scripts: first edit uses empty `old_string` to set initial content

## Live Execution & Testing

```
mcp__Roblox_Studio__execute_luau     → run arbitrary Luau code in Studio and get the result
mcp__Roblox_Studio__start_stop_play  → start or stop playtesting (is_start: true/false)
mcp__Roblox_Studio__get_console_output → read Output/console logs during playtest
```

- `execute_luau` runs in the **command bar context** (PluginSecurity) — can access any service, read/write properties, test code snippets
- Use it to **verify** API behavior live: run a snippet, check the result, then look up docs if something is unexpected
- `start_stop_play` + `get_console_output` = full playtest-and-debug loop

## Asset Generation & Marketplace

```
mcp__Roblox_Studio__insert_from_creator_store  → search Toolbox/Marketplace and insert a model by name
mcp__Roblox_Studio__generate_mesh              → AI-generate a textured 3D mesh from a text prompt
mcp__Roblox_Studio__generate_material          → AI-generate a material variant from a description
```

- `insert_from_creator_store` searches the Roblox Marketplace — use for "find me a free X model" or "add a door"
- Returns a unique GUID tag for referencing the inserted model in subsequent `execute_luau` calls
- `generate_mesh` creates meshes with bounding box control (`size: {x, y, z}`) and triangle budget (`maxTriangles`: 12-20000)
- `generate_material` creates material variants — returns `BaseMaterial` and `Name` to apply to parts

## Playtest Interaction

```
mcp__Roblox_Studio__character_navigation  → move the character to coordinates or an instance path
mcp__Roblox_Studio__user_keyboard_input   → send keyDown/keyUp/keyPress/textInput events
mcp__Roblox_Studio__user_mouse_input      → send moveTo/click/rightClick/scroll events
```

- Use these during playtesting (`start_stop_play` with `is_start: true`) to simulate player actions
- `character_navigation` accepts either `{x, y, z}` coordinates or `instance_path` (dot notation), with optional `speed_multiplier` (0.1-10.0)
- Keyboard input supports all `Enum.KeyCode` values — useful for testing keybind systems
- Mouse input can target instances by path or screen coordinates

## Visual Capture

```
mcp__Roblox_Studio__screen_capture  → capture the current Studio viewport as an image
```

- Use for visual verification: capture before/after states when making changes
- Pass a unique `capture_id` (e.g., `"before_edit"`, `"after_edit"`)

## Cross-Reference Patterns

| Scenario | Studio MCP tools | Then look up |
|----------|-----------------|-------------|
| User says "this script" or "the handler" | `script_search` → find it, `script_read` → get source | APIs used in the source |
| User points at a game object | `inspect_instance` → get ClassName + properties | That class's docs |
| "What services am I using?" | `search_game_tree` with `instance_type` filter | Each service's API |
| "Find all RemoteEvents" | `script_grep` for `:FireServer\|:FireClient` | RemoteEvent/RemoteFunction docs |
| Debug a runtime issue | `get_console_output` → read errors | Relevant API docs for the error context |
| "Does this API actually work like the docs say?" | `execute_luau` → test it live | Compare result with documentation |
| "Add a tree/door/NPC model" | `insert_from_creator_store` → search and insert | Docs for the inserted class |
| "Generate a custom rock/weapon" | `generate_mesh` → create it | MeshPart docs |
| "Test if the player can jump here" | `start_stop_play` → `character_navigation` → observe | Physics/Humanoid docs |
| "Screenshot what it looks like now" | `screen_capture` → capture viewport | — |
| "Create a new script for X" | `multi_edit` with `className` → create script | Look up APIs needed for the script |

**Important:** Only use Studio MCP tools when the user is actively working in Studio or references live game objects. Don't call them speculatively. Always verify the active Studio instance first with `list_roblox_studios` if there's any ambiguity.
