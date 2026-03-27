# Bloxus — OpenCode Edition

Use this skill to answer Roblox questions with verifiable sources instead of guessing. The bundled Node.js CLI handles exact API-dump queries from Roblox's own CDN, Context7 handles current documentation when available, and web lookups cover live community, status, and release-note research.

## Quick Start

1. Inspect local project signals first: `default.project.json`, `wally.toml`, `aftman.toml`, `Packages/`, `src/`, and any `docs/` folder.
2. Classify the request as one of these:
   - exact API shape or enum data
   - usage guidance or best practices
   - Luau language semantics
   - third-party package docs
   - recent Roblox platform health, release changes, or community workarounds
3. Choose the source in this order:
   - exact structure: `node scripts/api-dump.js ...`
   - current docs: Context7 MCP if configured, otherwise official docs on the web
   - community or platform-current data: DevForum, Roblox Status, or official release notes
4. Cite the source you used and separate confirmed facts from inference.

## Source Routing

- Use `node scripts/api-dump.js class <Name>` or `enum <Name>` for exact class members, enum items, tags, defaults, inheritance, and security metadata.
- Use `node scripts/api-dump.js members <Name>` when the user remembers a member name but not the owning class.
- Use `node scripts/api-dump.js search <Query>` to discover classes and enums quickly.
- Use Context7 MCP first for Creator Docs, engine reference material, Luau docs, and community package docs when OpenCode has Context7 configured.
- Use official Creator Docs directly when Context7 is unavailable or when you need to browse a specific page manually.
- Use `luau.org` or the Luau repo for deep type-system and language-semantics questions.
- Use package docs only after checking which packages the project actually depends on.
- Check `status.roblox.com` before debugging unexplained DataStore, publishing, asset-delivery, or connectivity failures.
- Use DevForum for workarounds, recent bug threads, and community patterns, but mark those claims as community-sourced and cross-check them against official docs whenever possible.
- Use cached dump diffs plus official release notes or announcements for "what changed?" questions. Be explicit that exact addition dates may be unavailable unless historical dumps or official notes exist.

## Context7 in OpenCode

If OpenCode has Upstash Context7 configured as an MCP server, prefer it for library and documentation lookups instead of scraping raw HTML.

- Resolve a library ID first when you are not sure of the exact Context7 ID.
- Query docs with a focused topic instead of broad prompts.
- Use Context7 for Roblox Creator Docs, Luau docs, and package docs.
- Fall back to the official site directly if Context7 is unavailable or the result looks incomplete.

To configure Context7, copy `opencode.json` from this directory into your project root, or add the `context7` entry to your existing `opencode.json`:

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

Open `references/context7-opencode.md` for setup notes and the Roblox ecosystem Context7 IDs.

## Local Project Checks

- Treat these as strong Roblox indicators: `default.project.json`, `wally.toml`, `aftman.toml`, `selene.toml`, `stylua.toml`, `*.luau`, `*.rbxlx`, and `*.rbxm`.
- Read local docs or architecture notes before browsing when the repo already contains curated project guidance.
- If the repo uses community packages, inspect the actual require or import sites before recommending new patterns.
- Detect common packages from `wally.toml` and route to the right docs source before answering.

## Scripts

Use the bundled Node CLI instead of rewriting one-off shell snippets:

```bash
node scripts/api-dump.js fetch
node scripts/api-dump.js class TweenService --inherited
node scripts/api-dump.js enum Material
node scripts/api-dump.js members FireServer
node scripts/api-dump.js diff old-dump.json
```

The script stores cached Roblox API dumps under `~/.cache/bloxus/` (or `$XDG_CACHE_HOME/bloxus/`) and fetches from [MaximumADHD/Roblox-Client-Tracker](https://github.com/MaximumADHD/Roblox-Client-Tracker) (MIT License).

## Current-Info Workflows

- DevForum search: use the public JSON search endpoint or web search constrained to `devforum.roblox.com`.
- Roblox Status: use the JSON endpoints before assuming a bug is in the user's code.
- API diffs: compare cached dumps or user-provided dump snapshots when the question is about recency.
- Official announcements: use Creator Hub or DevForum announcements when the user asks when a change shipped and local dump history is insufficient.
- Luau repo or docs: use for language-level behavior that Creator Docs does not explain deeply.

## Working Rules

- Never guess exact Roblox signatures, enum items, defaults, or security tags when the dump can confirm them.
- Prefer official sources over summaries, blog posts, or tertiary tutorials.
- When a fact could have changed recently, browse or refresh the dump before answering.
- When writing Luau, preserve the repo's existing architecture and naming conventions.
- Be explicit when a recommendation comes from community discussion rather than official docs.
- Be explicit when a historical claim is based on available cached dumps rather than a complete public change log.

## Reference

Open `references/source-map.md` for the official source list, package doc pointers, status endpoints, and CDN dump workflow. Open `references/context7-opencode.md` for the OpenCode-specific Context7 setup.
