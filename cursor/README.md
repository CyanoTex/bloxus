# bloxus-cursor

Project-local **Cursor** port of [Bloxus](https://github.com/CyanoTex/bloxus) (Roblox knowledge engine).

This repo provides:

- A **Cursor project skill**: `cursor/.cursor/skills/bloxus/SKILL.md`
- **Cursor rules**: `cursor/.cursor/rules/*.mdc`
- A **Node.js CLI** for exact Roblox API dump lookups: `cursor/scripts/api-dump.js`

## Requirements

- **Node.js 18+** (uses built-in `fetch`)
- (Optional) **Context7 MCP** in Cursor for up-to-date docs lookups

Works on **Windows/macOS/Linux**.

## Quick start

Fetch/cache the latest Roblox API dump (cache at `cursor/.bloxus-cache/`):

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
- **Incidents / outages**: check Roblox Status before assuming a bug in user code
- **Community sources** (e.g. DevForum): label clearly and cross-check with official docs when possible

## References

- Sources: `cursor/references/source-map.md`
- Context7 notes: `cursor/references/context7.md`

