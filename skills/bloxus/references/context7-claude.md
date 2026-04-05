# Context7 — Library IDs and Routing

Use this reference when Claude Code has Upstash Context7 configured as an MCP server.

## Contents

- [MCP Setup](#mcp-setup)
- [Engine API (Step B)](#engine-api-step-b)
- [Creator Docs (Step C)](#creator-docs-step-c)
- [Open Source Docs (Step D)](#open-source-docs-step-d)
- [Community Packages (Step F)](#community-packages-step-f)
- [Luau Style Guide (Step H)](#luau-style-guide-step-h)
- [Luau Language (Step I)](#luau-language-step-i)
- [Routing Quick-Reference](#routing-quick-reference)

## MCP Setup

Context7 is the preferred documentation transport. All queries use two tools:

- `mcp__plugin_context7_context7__resolve-library-id` — resolve a library name to its Context7 ID when unsure of the exact path.
- `mcp__plugin_context7_context7__query-docs` — fetch documentation snippets for a known library ID.

Basic usage pattern:

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: <library ID>
topic: "<focused question — a class, subsystem, package feature, or configuration task>"
tokens: 5000
```

If Context7 is not configured, fall back to web sources — see Steps G and K in `skill.md` for DevForum and Roblox Status endpoints, or use WebFetch with the official docs at `https://create.roblox.com/docs`.

## Engine API (Step B)

**Library ID:** `/websites/create_roblox_reference_engine`

Engine API reference with prose descriptions and code examples. Preferred over WebFetch as it returns clean, structured content. Use this when you need descriptions, usage notes, gotchas, and code examples for specific engine APIs.

**Example queries:**

- `"How to use TweenService to animate UI elements"`
- `"DataStoreService SetAsync and UpdateAsync error handling patterns"`
- `"Humanoid health, death, and state changed events"`
- `"RemoteEvent security best practices and rate limiting"`

## Creator Docs (Step C)

**Library ID:** `/websites/create_roblox`

Full creator documentation — tutorials, guides, Studio, Luau, cloud APIs, UI, physics, networking, monetization, publishing, moderation. Covers the full breadth of `create.roblox.com/docs`. Use for anything beyond the engine API reference.

**Example queries by topic:**

| Topic | Example query |
|-------|--------------|
| Luau language | `"Luau type annotations and generics syntax"` |
| Studio | `"How to use the Animation Editor in Studio"` |
| Networking | `"Client-server communication with RemoteEvents and RemoteFunctions"` |
| UI | `"Creating responsive UI layouts with UIListLayout and UIGridLayout"` |
| Physics | `"Constraint types and when to use each one"` |
| Animation | `"Playing animations on character models with Animator"` |
| Data stores | `"DataStore best practices for saving player data"` |
| Monetization | `"Implementing Developer Products and processing purchases"` |
| Cloud APIs | `"Open Cloud API authentication and DataStore REST endpoints"` |
| Publishing | `"Localization setup and translating game content"` |
| Performance | `"Performance optimization and MicroProfiler usage"` |
| Moderation | `"Text filtering and chat moderation requirements"` |
| Avatar | `"Avatar customization and HumanoidDescription"` |
| Audio | `"Playing sounds and using SoundService"` |
| Lighting | `"Lighting technology comparison: Future vs ShadowMap"` |
| Input | `"Handling user input with UserInputService and ContextActionService"` |
| Terrain | `"Generating and editing terrain programmatically"` |

## Open Source Docs (Step D)

**Library ID:** `/roblox/creator-docs`

Same creator docs from the open-source repo — raw markdown source. Use as a fallback if Steps B or C don't return useful results.

## Community Packages (Step F)

When the project uses community packages (check `wally.toml`, `Packages/` folder, or `require()` paths), look up their docs via Context7.

### Known Indexed Packages

| Package | Context7 Library ID | Snippets |
|---------|-------------------|----------|
| **ProfileService** (data persistence) | `/websites/madstudioroblox_github_io_profileservice` | 68 |
| **Promise** (async/await) | `/evaera/roblox-lua-promise` | 84 |
| **Knit** (game framework) | `/websites/sleitnick_github_io_knit` | 284 |
| **Rodux** (state management) | `/roblox/rodux` | 38 |
| **Matter** (ECS framework) | `/websites/matter-ecs_github_io_matter` | 49 |
| **Fusion** (reactive UI) | `/dphfox/fusion` | 378 |
| **Iris** (immediate-mode UI) | `/sirmallard/iris` | 33 |

### Auto-Detect from wally.toml

If you see any of these in `wally.toml` dependencies or `require()` paths, use the corresponding Context7 library:

| wally.toml dependency | Context7 Library ID |
|-----------------------|---------------------|
| `madstudioroblox/profileservice` | `/websites/madstudioroblox_github_io_profileservice` |
| `evaera/promise` | `/evaera/roblox-lua-promise` |
| `sleitnick/knit` | `/websites/sleitnick_github_io_knit` |
| `roblox/rodux` | `/roblox/rodux` |
| `matter-ecs/matter` | `/websites/matter-ecs_github_io_matter` |
| `dphfox/fusion` or `elttob/fusion` | `/dphfox/fusion` |
| `sirmallard/iris` | `/sirmallard/iris` |

### Unlisted Packages

For packages not in the table above (e.g., GoodSignal, Trove, Maid, Janitor, Comm, Net, TableUtil): use `mcp__plugin_context7_context7__resolve-library-id` to search for the package by name. If Context7 doesn't index it, fall back to the package's GitHub README or docs site via WebFetch.

## Luau Style Guide (Step H)

**Library ID:** `/websites/roblox_github_io_lua-style-guide`

Official Roblox Lua/Luau coding conventions and style rules. Use for questions about naming conventions, formatting, code organization, and Roblox-specific Luau style rules.

**Example queries:**

- `"Naming conventions for services, modules, and variables"`
- `"How to format function declarations and calls"`
- `"When to use PascalCase vs camelCase in Luau"`
- `"Module structure and require patterns"`

## Luau Language (Step I)

Deep Luau language specification — type system internals, generics, metatables, grammar rules, RFCs, and language design decisions. Use for questions that go beyond what Creator Docs cover.

**Primary:** `/websites/luau` (838 snippets — most comprehensive)

**Fallback:** `/luau-lang/luau` (129 snippets — includes source-level details)

**Additional:** `/luau-lang/site` (412 snippets)

### When to Use Step I vs Step C

| Question | Use |
|----------|-----|
| "How do I use types in my Roblox game?" | Step C (practical, Roblox-focused) |
| "How do generic type packs work in Luau?" | Step I (language-level detail) |
| "What's the syntax for if-then-else?" | Step C (basic syntax) |
| "How does Luau's type narrowing work with typeof?" | Step I (type system internals) |
| "Metatable __index resolution order" | Step I (language semantics) |
| "Best practices for ModuleScripts" | Step C (Roblox patterns) |

## Routing Quick-Reference

| Question type | Library ID | Step |
|---------------|-----------|------|
| Exact API signatures, types, defaults, enums | Use API Dump (Step A), not Context7 | A |
| Engine API descriptions and code examples | `/websites/create_roblox_reference_engine` | B |
| Tutorials, guides, non-engine topics | `/websites/create_roblox` | C |
| Fallback for B/C | `/roblox/creator-docs` | D |
| Community package docs | See package table above | F |
| Naming, formatting, code style | `/websites/roblox_github_io_lua-style-guide` | H |
| Deep Luau language / type system | `/websites/luau` | I |
| Luau source-level details | `/luau-lang/luau` | I |
| Luau site docs (additional) | `/luau-lang/site` | I |
| Unknown library | Use `mcp__plugin_context7_context7__resolve-library-id` | -- |
