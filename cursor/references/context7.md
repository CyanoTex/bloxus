# Context7 in Cursor

Use this reference when Context7 is configured as an MCP server in Cursor.

## What Context7 adds

- Up-to-date, library-specific docs without manually scraping sites.
- A strong path for Creator Docs, Luau docs, and package docs compared to ad hoc web search.
- Alignment with the Context7-based documentation workflow used elsewhere in this repository (Codex / OpenCode editions).

## Cursor setup

Cursor discovers MCP configuration from the **workspace / project root**. Put MCP server definitions in **`.mcp.json` at the repository root** (same level as `default.project.json` in a typical Rojo game repo), not under `.cursor/`. Cursor supports both **stdio** (local command) and **remote** (HTTP) transports; exact schema can evolve—verify against [Cursor MCP documentation](https://docs.cursor.com) if something fails to load.

Remote MCP server (Context7 hosted endpoint):

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

Local MCP server (stdio via `npx`):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

If Context7 is not configured, fall back to the web sources in `cursor/references/source-map.md`.

## Usage pattern

- Resolve the library ID first when you are not sure of the exact Context7 ID.
- Query docs with a focused question such as a class, subsystem, package feature, or configuration task.
- Use Context7 as the preferred documentation transport, then cross-check with the local API dump when exact signatures or enum data matter.

## Known Roblox ecosystem IDs

These IDs were carried over from the open-source Bloxus skill in this repository as read on March 22, 2026. Treat them as helpful starting points, not immutable truths. If one fails, resolve it dynamically.

- Creator Docs engine reference: `/websites/create_roblox_reference_engine`
- Creator Docs general docs: `/websites/create_roblox`
- Creator Docs repo source: `/roblox/creator-docs`
- Luau style guide: `/websites/roblox_github_io_lua-style-guide`
- Luau docs: `/websites/luau`
- Luau GitHub repo: `/luau-lang/luau`
- Luau site docs: `/luau-lang/site`

Community package IDs carried over from the open-source Bloxus skill:

- ProfileService: `/websites/madstudioroblox_github_io_profileservice`
- Promise: `/evaera/roblox-lua-promise`
- Knit: `/websites/sleitnick_github_io_knit`
- Rodux: `/roblox/rodux`
- Matter: `/websites/matter-ecs_github_io_matter`
- Fusion: `/dphfox/fusion`
- Iris: `/sirmallard/iris`

## Routing advice

- Creator Docs or engine API examples: use Context7 first, then browser fallback.
- Luau language semantics: use Context7 first, then `luau.org` or the Luau repo.
- Package docs: detect the package from `wally.toml`, then use Context7 if available.
- Exact member signatures or enum items: always verify against the local API dump script (`node cursor/scripts/api-dump.js ...` from this repo’s root).
