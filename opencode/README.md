# Bloxus — OpenCode Edition

Roblox Knowledge Engine for [OpenCode](https://opencode.ai). Fetches exact API data from Roblox's CDN, queries up-to-date docs via Context7 MCP, and searches DevForum and Roblox Status for live platform info.

## Installation

1. Copy this `opencode/` folder into your Roblox project
2. Copy `opencode.json` to your project root (or merge the `context7` MCP entry into your existing `opencode.json`)
3. Run `node scripts/api-dump.js fetch` to cache the API dump on first use

## What's Included

| File | Purpose |
|------|---------|
| `skill.md` | Skill definition with source routing logic |
| `opencode.json` | Context7 MCP server config for OpenCode |
| `scripts/api-dump.js` | Node CLI for fetching and querying Roblox API dumps |
| `references/source-map.md` | URLs and endpoints for all data sources |
| `references/context7-opencode.md` | Context7 setup and Roblox ecosystem IDs |

## Requirements

- Node.js 18+
- [Context7 MCP](https://github.com/upstash/context7) (optional but recommended)
