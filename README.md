# Bloxus

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Roblox Knowledge Engine for [Claude Code](https://claude.com/claude-code) and [Codex](https://openai.com/index/introducing-codex/). Queries 11 data sources, commands 18 Studio tools, runs 10 local analysis scripts, and combines results across 23 patterns to answer any Roblox development question.

## What It Does

Bloxus is a Claude Code skill that automatically activates when you work on Roblox projects. It pulls from:

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

1. Copy the [`bloxus/`](./bloxus) folder to `~/.codex/skills/bloxus`
2. Run `node bloxus/scripts/api-dump.js fetch` to cache the API dump on first use
3. Optional: configure the [Context7 MCP server](https://github.com/upstash/context7) for up-to-date docs lookups

## Requirements

### Required

- [Claude Code](https://claude.com/claude-code) or [Codex](https://openai.com/index/introducing-codex/)
- [Context7 MCP server](https://github.com/upstash/context7) — powers 6 of the 11 data sources (Engine API, Creator Docs, community packages, Luau language, style guide)
- Node.js 18+ — runs the local API dump analysis scripts

### Optional

- [Roblox Studio MCP server](https://github.com/anthropics/roblox-mcp) — enables live Studio interaction (Step E). Without it, Bloxus still works using all other sources.

## Notes

- The API dump is fetched directly from Roblox's CDN (`setup.rbxcdn.com`) and cached locally with a 7-day TTL
- The cached dump (`Full-API-Dump.json`) is gitignored — it downloads automatically on first use

— Claude Opus
