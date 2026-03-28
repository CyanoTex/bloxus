# Bloxus source map (Cursor edition)

Use this file when the skill needs a URL, repo, or API endpoint for Roblox research. All `node` commands below assume the **repository root** of [CyanoTex/bloxus](https://github.com/CyanoTex/bloxus) (or a copy that keeps the `cursor/` folder layout).

## Context7 MCP

- Preferred docs transport in Cursor when configured: remote `https://mcp.context7.com/mcp` or local `@upstash/context7-mcp` (see `cursor/references/context7.md`).
- Use Context7 for current Creator Docs, Luau docs, and community package references before falling back to raw web pages.

## Official Roblox sources

- Creator Docs: `https://create.roblox.com/docs`
- Engine reference landing page: `https://create.roblox.com/docs/reference/engine`
- Creator Docs source repo: `https://github.com/Roblox/creator-docs`
- Luau docs: `https://luau.org/`
- Luau repo: `https://github.com/luau-lang/luau`
- Roblox status page: `https://status.roblox.com/`
- Roblox status JSON:
  - `https://status.roblox.com/api/v2/status.json`
  - `https://status.roblox.com/api/v2/incidents/unresolved.json`
  - `https://status.roblox.com/api/v2/components.json`

## API dump workflow

- Dump source: `https://raw.githubusercontent.com/MaximumADHD/Roblox-Client-Tracker/roblox/Full-API-Dump.json` (MIT License)
- Use `node cursor/scripts/api-dump.js fetch` to cache or refresh the latest dump (cache: `cursor/.bloxus-cache/`).
- Use `node cursor/scripts/api-dump.js class <ClassName>` for a class lookup.
- Use `node cursor/scripts/api-dump.js enum <EnumName>` for an enum lookup.
- Use `node cursor/scripts/api-dump.js members <MemberName>` to find a member across classes.
- Use `node cursor/scripts/api-dump.js search <Query>` for quick class/enum discovery.
- Use `node cursor/scripts/api-dump.js diff [oldDumpPath] [newDumpPath]` to compare dumps; with no paths, compare previous vs current cached file when a previous snapshot exists.

## Recent change tracking

- Compare cached dumps first when the user asks “what changed?” or “when was this added?”
- Use Creator Hub release notes or DevForum announcements if an exact ship window matters and dump history is incomplete.
- Be explicit when historical answers are limited by the available local dump history.

## Community sources

- DevForum home: `https://devforum.roblox.com/`
- DevForum search JSON:
  `https://devforum.roblox.com/search.json?q=QUERY`
- Topic JSON:
  `https://devforum.roblox.com/t/TOPIC_ID.json`
- Treat DevForum guidance as secondary evidence. Cross-check API claims with the dump or official docs.

## Common package docs

- ProfileService: `https://madstudioroblox.github.io/ProfileService/`
- Promise: `https://eryn.io/roblox-lua-promise/`
- Knit: `https://sleitnick.github.io/Knit/`
- Rodux: `https://roblox.github.io/rodux/`
- Matter: `https://matter-ecs.github.io/matter/`
- Fusion: `https://elttob.uk/Fusion/`
- Iris: `https://sirmallard.github.io/Iris/`

Check `wally.toml` or project imports before opening package docs so the answer matches the repo in front of you.
