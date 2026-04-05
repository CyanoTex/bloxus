# Context7 in OpenCode

Use this reference when OpenCode has Upstash Context7 configured as an MCP server.

## What Context7 Adds

- Up-to-date, library-specific docs without manually scraping sites.
- A better path for Creator Docs, Luau docs, and package docs than ad hoc web search.

## OpenCode Setup

Add the Context7 MCP server to your project's `opencode.json`:

```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

Or use a remote MCP server:

```json
{
  "mcpServers": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

If Context7 is not configured, fall back to the web sources in `references/source-map.md`.

## Usage Pattern

- Resolve the library ID first when you are not sure of the exact Context7 ID.
- Query docs with a focused question such as a class, subsystem, package feature, or configuration task.
- Use Context7 as the preferred documentation transport, then cross-check with the local API dump when exact signatures or enum data matter.

## Known Roblox Ecosystem IDs

These IDs were carried over from the open-source Bloxus skill. Treat them as helpful starting points, not immutable truths. If one fails, resolve it dynamically.

- Creator Docs engine reference: `/websites/create_roblox_reference_engine`
- Creator Docs general docs: `/websites/create_roblox`
- Creator Docs repo source: `/roblox/creator-docs`
- Luau style guide: `/websites/roblox_github_io_lua-style-guide`
- Luau docs: `/websites/luau`
- Luau GitHub repo: `/luau-lang/luau`
- Luau site docs: `/luau-lang/site`

Community package IDs:

- ProfileService: `/websites/madstudioroblox_github_io_profileservice`
- Promise: `/evaera/roblox-lua-promise`
- Knit: `/websites/sleitnick_github_io_knit`
- Rodux: `/roblox/rodux`
- Matter: `/websites/matter-ecs_github_io_matter`
- Fusion: `/dphfox/fusion`
- Iris: `/sirmallard/iris`

## Routing Advice

- Creator Docs or engine API examples: use Context7 first, then browser fallback.
- Luau language semantics: use Context7 first, then `luau.org` or the Luau repo.
- Package docs: detect the package from `wally.toml`, then use Context7 if available.
- Exact member signatures or enum items: always verify against the local API dump script.
