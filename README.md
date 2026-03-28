# Bloxus

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Roblox Knowledge Engine for [Claude Code](https://claude.com/claude-code), [Codex](https://openai.com/index/introducing-codex/), [OpenCode](https://opencode.ai), and [Cursor](https://cursor.com). Queries 11 data sources, commands 18 Studio tools, runs 10 local analysis scripts, and combines results across 23 patterns to answer any Roblox development question.

## What It Does

Bloxus is an AI coding-assistant skill that automatically activates when you work on Roblox projects. It pulls from:

| Source | What it covers |
|--------|---------------|
| **API Dump** | Every class, property, method, event, enum — structured with types, defaults, tags, security |
| **Engine API Docs** | Code examples and detailed explanations via Context7 |
| **Creator Docs** | Tutorials, guides, Studio features, cloud APIs, UI, physics, networking, monetization |
| **Roblox Studio MCP** | Live game tree inspection, script reading, Luau execution, console output |
| **Community Packages** | ProfileService, Promise, Knit, Rodux, Matter, Fusion, Iris + auto-detect from `wally.toml` |
| **DevForum Search** | Community discussions, solutions, and announcements |
| **Luau Language** | Type system, language spec, RFCs, standard library, style guide |
| **API Dump Diffing** | What changed between Roblox versions |
| **Roblox Status** | Service health checks |

## Installation

### Claude Code

1. Copy `skill.md` to `~/.claude/skills/bloxus/skill.md`
2. Copy `bloxus-helpers.js` to `~/.claude/bloxus-cache/bloxus-helpers.js`
3. Done — Bloxus activates automatically when Claude Code detects Roblox-related work

### Codex

1. Copy the [`codex/`](./codex) folder to `~/.codex/skills/bloxus`
2. Run `node codex/scripts/api-dump.js fetch` to cache the API dump on first use
3. Optional: configure the [Context7 MCP server](https://github.com/upstash/context7) for up-to-date docs lookups

### OpenCode

1. Copy the [`opencode/`](./opencode) folder into your Roblox project
2. Copy `opencode/opencode.json` to your project root (or merge the `context7` entry into your existing `opencode.json`)
3. Run `node opencode/scripts/api-dump.js fetch` to cache the API dump on first use

### Cursor

1. Copy the [`cursor/`](./cursor) folder into your Roblox project
2. Optional: add the Context7 MCP server to your workspace `.mcp.json` (see `cursor/references/context7.md`)
3. Run `node cursor/scripts/api-dump.js fetch` to cache the API dump on first use

## Requirements

### Required

- [Claude Code](https://claude.com/claude-code), [Codex](https://openai.com/index/introducing-codex/), [OpenCode](https://opencode.ai), or [Cursor](https://cursor.com)
- [Context7 MCP server](https://github.com/upstash/context7) — powers 6 of the 11 data sources (Engine API, Creator Docs, community packages, Luau language, style guide)
- Node.js 18+ — runs the local API dump analysis scripts

### Optional

- [Roblox Studio MCP server](https://github.com/anthropics/roblox-mcp) — enables live Studio interaction (Step E). Without it, Bloxus still works using all other sources.

## Data Sources & Licensing

- **API Dump**: Fetched from [MaximumADHD/Roblox-Client-Tracker](https://github.com/MaximumADHD/Roblox-Client-Tracker) (MIT License). Cached locally with a 7-day TTL. Downloads automatically on first use.
- **API Dump Diffing**: Uses git history from the same Client-Tracker repo to compare versions.
- **Context7 sources**: Queried live via MCP — no local caching of docs content.
- **DevForum**: Public Discourse API — community-generated content, cross-reference with official docs.

## Contributing

Want to add Bloxus support for another AI tool? See [CONTRIBUTING.md](./CONTRIBUTING.md) for the edition structure, parity requirements, and submission process.

## Notes

- The cached dump (`Full-API-Dump.json`) is gitignored — regenerates automatically
- Bloxus does not store or redistribute any Roblox intellectual property — it fetches documentation on demand
- Bloxus is updated as Roblox APIs evolve — pull the latest from this repo periodically to stay current
