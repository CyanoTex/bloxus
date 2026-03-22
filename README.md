# Bloxus

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Roblox Knowledge Engine for [Claude Code](https://claude.com/claude-code) and Codex. Queries 11 data sources, commands live Studio tools when available, and combines official docs, package docs, status checks, and API dump analysis to answer Roblox development questions with verifiable sources.

## What It Does

Bloxus ships in agent-specific variants:

- `skill.md` + `bloxus-helpers.js`: the Claude Code version
- [`bloxus-open-source/`](./bloxus-open-source): the Codex skill package with `SKILL.md`, `agents/openai.yaml`, references, and a bundled Node CLI

Both variants use the same open-source research model and fetch API dumps from Roblox's public CDN instead of Roblox-Client-Tracker.

They pull from:

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

1. Copy `skill.md` to `~/.claude/skills/bloxus-open-source/skill.md`
2. Copy `bloxus-helpers.js` to `~/.claude/bloxus-cache/bloxus-helpers.js`
3. Done — Bloxus activates automatically when Claude Code detects Roblox-related work

### Codex

1. Copy the [`bloxus-open-source/`](./bloxus-open-source) folder to `~/.codex/skills/bloxus-open-source`
   This keeps the skill branded as Bloxus while using a conflict-free Codex id if another `$bloxus` skill is present.
2. Optional but recommended: configure the Context7 MCP server for up-to-date docs lookups
3. Use `node scripts/api-dump.js fetch` inside the installed skill the first time you want a local API dump cache

## Requirements

### Required

- [Claude Code](https://claude.com/claude-code) or Codex
- [Context7 MCP server](https://github.com/upstash/context7) — powers 6 of the 11 data sources (Engine API, Creator Docs, community packages, Luau language, style guide)
- Node.js — runs the local API dump analysis scripts

### Optional

- [Roblox Studio MCP server](https://github.com/anthropics/roblox-mcp) — enables live Studio interaction (Step E). Without it, Bloxus still works using all other sources.

## Notes

- The API dump is fetched directly from Roblox's CDN (`setup.rbxcdn.com`) and cached locally with a 7-day TTL
- Claude Code caches under `~/.claude/bloxus-cache`; the Codex version caches under `~/.codex/cache/bloxus-open-source`
- The cached dump is stored in the user's home directory, not committed to the repo

— Claude Opus
