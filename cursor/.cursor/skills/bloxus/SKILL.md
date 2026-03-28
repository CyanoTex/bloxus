---
name: bloxus
description: Research Roblox and Luau development with primary-source verification. Use when working on Roblox Studio or Rojo projects, editing `.luau`/`.lua` files, or answering questions about Roblox classes/services/enums, Creator Docs, Luau semantics, package docs, DevForum discussions, or Roblox platform status. Prefer the local API dump scripts for exact members/tags/security; use Context7 MCP for up-to-date docs when available; fall back to official sites and reputable community sources with citations.
---

# Bloxus (Cursor)

Use this skill to answer Roblox questions with verifiable sources instead of guessing. Keep the same split as other Bloxus editions: the Node CLI answers exact API-dump queries, Context7 covers current documentation when configured in Cursor, and web or JSON endpoints cover live community, status, and change tracking.

## Quick start

1. Inspect local project signals first: `default.project.json`, `wally.toml`, `aftman.toml`, `Packages/`, `src/`, and any `docs/` folder.
2. Classify the request as one of these:
   - exact API shape or enum data
   - usage guidance or best practices
   - Luau language semantics
   - third-party package docs
   - recent Roblox platform health, release changes, or community workarounds
3. Choose the source in this order:
   - exact structure: `node cursor/scripts/api-dump.js ...`
   - current docs: Context7 MCP if configured, otherwise official docs on the web
   - community or platform-current data: DevForum JSON or site, Roblox Status JSON, or official release notes
4. Cite the source you used and separate confirmed facts from inference.

## Source routing

- Use `node cursor/scripts/api-dump.js class <Name>` or `enum <Name>` for exact class members, enum items, tags, defaults, inheritance, and security metadata.
- Use `node cursor/scripts/api-dump.js members <Name>` when the user remembers a member name but not the owning class.
- Use `node cursor/scripts/api-dump.js search <Query>` to discover classes and enums quickly.
- Use Context7 MCP first for Creator Docs, engine reference material, Luau docs, and community package docs when Cursor has Context7 configured.
- Use official Creator Docs directly when Context7 is unavailable or when you need to browse a specific page manually.
- Use `luau.org` or the Luau repo for deep type-system and language-semantics questions.
- Use package docs only after checking which packages the project actually depends on (see `wally.toml` and import sites).
- Check Roblox Status JSON endpoints (see `cursor/references/source-map.md`) before debugging unexplained DataStore, publishing, asset-delivery, or connectivity failures.
- Use DevForum search/topic JSON or the site for workarounds and recent bug threads, but mark those claims as community-sourced and cross-check them against official docs whenever possible.
- Use cached dump diffs plus official release notes or announcements for “what changed?” questions. Be explicit that exact addition dates may be unavailable unless historical dumps or official notes exist.

## Context7 in Cursor

If Context7 is configured as an MCP server, prefer it for library and documentation lookups instead of scraping raw HTML.

- Resolve a library ID first unless you already know the exact Context7 ID.
- Query docs with a focused topic instead of broad prompts.
- Use Context7 for Roblox Creator Docs, Luau docs, and package docs.
- Fall back to the official site directly if Context7 is unavailable or the result looks incomplete.

Open `cursor/references/context7.md` for Cursor-oriented MCP setup (`.mcp.json` at project root), known library IDs, and routing advice.

## Local project checks

- Treat these as strong Roblox indicators: `default.project.json`, `wally.toml`, `aftman.toml`, `selene.toml`, `stylua.toml`, `*.luau`, `*.rbxlx`, and `*.rbxm`.
- Read local docs or architecture notes before browsing when the repo already contains curated project guidance.
- If the repo uses community packages, inspect the actual require or import sites before recommending new patterns.
- Detect common packages from `wally.toml` and route to the right docs source before answering.

## Scripts (API dump)

Use the bundled Node CLI from the **bloxus repository root** instead of rewriting one-off shell snippets:

```bash
node cursor/scripts/api-dump.js fetch
node cursor/scripts/api-dump.js class TweenService --inherited
node cursor/scripts/api-dump.js enum Material
node cursor/scripts/api-dump.js members FireServer
node cursor/scripts/api-dump.js search DataStore
node cursor/scripts/api-dump.js diff
```

The script caches dumps under `cursor/.bloxus-cache/` and fetches from [MaximumADHD/Roblox-Client-Tracker](https://github.com/MaximumADHD/Roblox-Client-Tracker) (MIT License).

## Current-info workflows

- DevForum search: use `https://devforum.roblox.com/search.json?q=QUERY` or web search constrained to `devforum.roblox.com`.
- Roblox Status: use the JSON endpoints in `cursor/references/source-map.md` before assuming a bug is in the user’s code.
- API diffs: compare cached dumps or user-provided dump snapshots when the question is about recency.
- Official announcements: use Creator Hub or DevForum announcements when the user asks when a change shipped and local dump history is insufficient.
- Luau repo or docs: use for language-level behavior that Creator Docs does not explain deeply.

## Working rules

- Never guess exact Roblox signatures, enum items, defaults, or security tags when the dump can confirm them.
- Prefer official sources over summaries, blog posts, or tertiary tutorials.
- When a fact could have changed recently, refresh the dump or current docs before answering.
- If the environment exposes a Roblox Studio MCP or another live Studio bridge, use it only when the user is clearly working against a live place. Otherwise stay in repo-and-docs mode.
- When writing Luau, preserve the repo’s existing architecture and naming conventions.
- Be explicit when a recommendation comes from community discussion rather than official docs.
- Be explicit when a historical claim is based on available cached dumps rather than a complete public change log.

## Reference

Open `cursor/references/source-map.md` for URLs, JSON endpoints, package doc pointers, and dump workflow. Open `cursor/references/context7.md` for Context7 setup and library IDs.
