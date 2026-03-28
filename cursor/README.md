# bloxus-cursor

Project-local **Cursor** port of [Bloxus](https://github.com/CyanoTex/bloxus) (Roblox knowledge engine), shipped under the `cursor/` directory in this repository.

This folder provides:

- A **Cursor project skill**: `cursor/.cursor/skills/bloxus/SKILL.md`
- **Cursor rules**: `cursor/.cursor/rules/*.mdc`
- A **Node.js CLI** for exact Roblox API dump lookups: `cursor/scripts/api-dump.js`
- **Reference docs**: `cursor/references/source-map.md`, `cursor/references/context7.md`

## Skill discovery (Cursor)

Cursor can auto-discover agent skills from several locations. This edition lives under **`cursor/.cursor/skills/`** in the bloxus repo; when you copy the `cursor/` tree into another project, keep that layout or merge into your game repo’s own `.cursor/skills/` (and optionally mirror into legacy-compatible paths such as `.codex/skills/` / `.claude/skills/` if your tooling expects them). See [Cursor documentation](https://docs.cursor.com) for the current list of supported skill paths on your version.

## Requirements

- **Node.js 18+** (uses built-in `fetch`)
- (Optional) **Context7 MCP** — configure at the **workspace root** in `.mcp.json` (see `cursor/references/context7.md`), not inside `.cursor/`

Works on **Windows/macOS/Linux**.

## Quick start

Fetch/cache the latest Roblox API dump (cache at `cursor/.bloxus-cache/`). From the **repository root**:

```bash
node cursor/scripts/api-dump.js fetch
```

Examples:

```bash
node cursor/scripts/api-dump.js class TweenService --inherited
node cursor/scripts/api-dump.js enum Material
node cursor/scripts/api-dump.js members FireServer
node cursor/scripts/api-dump.js search DataStore
node cursor/scripts/api-dump.js diff
```

## How it answers questions

- **Exact API shape / enums / tags / security / defaults**: use `node cursor/scripts/api-dump.js ...`
- **Docs & examples**: Context7 MCP when available, otherwise official Roblox docs
- **Incidents / outages**: Roblox Status JSON (see `cursor/references/source-map.md`) before assuming a bug in user code
- **Community sources** (e.g. DevForum): label clearly; use DevForum JSON endpoints when automating lookups

## References

- Sources and endpoints: `cursor/references/source-map.md`
- Context7 (`.mcp.json`, library IDs, routing): `cursor/references/context7.md`
