---
name: bloxus
description: Research Roblox and Luau development with primary-source verification. Use when working on Roblox Studio or Rojo projects, editing `.luau`/`.lua` files, or answering questions about Roblox classes/services/enums, Creator Docs, Luau semantics, package docs, DevForum discussions, or Roblox platform status. Prefer the local API dump scripts for exact members/tags/security; use Context7 MCP for up-to-date docs when available; fall back to official sites and reputable community sources with citations.
---

# Bloxus (Cursor)

Use this skill to answer Roblox questions with verifiable sources instead of guessing. Keep the split:

- **Exact API shape / enums / tags / security**: local API dump via `node cursor/scripts/api-dump.js ...`
- **Documentation & examples**: Context7 MCP when available; otherwise official Creator Docs / Engine reference pages
- **Community / live status / recent changes**: DevForum, Roblox Status, Roblox-Client-Tracker history

## Quick start (routing)

1. Inspect local project signals first: `default.project.json`, `wally.toml`, `aftman.toml`, `Packages/`, `src/`, and any `docs/`.
2. Classify the request:
   - exact API shape or enum data
   - usage guidance / best practices
   - Luau language semantics
   - third-party package docs
   - recent platform health / release changes / community workarounds
3. Choose the source in this order:
   - **exact structure**: `node cursor/scripts/api-dump.js ...`
   - **current docs**: Context7 MCP if configured; otherwise official docs on the web
   - **current incidents / community**: Roblox Status / DevForum, with explicit sourcing

## Local scripts (API dump)

Run these from repo root:

```bash
node cursor/scripts/api-dump.js fetch
node cursor/scripts/api-dump.js class TweenService --inherited
node cursor/scripts/api-dump.js enum Material
node cursor/scripts/api-dump.js members FireServer
node cursor/scripts/api-dump.js search DataStore
node cursor/scripts/api-dump.js diff
```

## Working rules (non-negotiables)

- Never guess **exact Roblox signatures**, **enum items**, **defaults**, **tags**, or **security** when the dump can confirm them.
- Prefer **official sources** over tertiary tutorials. If a recommendation is community-derived, label it as such.
- If something could have changed recently, **refresh** the dump or use current docs before concluding.
- When writing Luau, preserve the repo’s architecture and naming conventions.

## References

- Source map: `cursor/references/source-map.md`
- Context7 setup notes: `cursor/references/context7.md`

