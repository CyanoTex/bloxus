# Contributing to Bloxus

## Adding a new edition

Bloxus supports multiple AI coding platforms. Each edition lives in its own folder (e.g., `codex/`, `opencode/`, `cursor/`) and is self-contained.

### What a complete edition includes

| File | Purpose |
|------|---------|
| Skill definition | Platform-specific skill file with full source routing (Steps A-K) |
| `scripts/api-dump.js` | Self-contained API dump CLI — must support all 6 subcommands: `fetch`, `class`, `enum`, `search`, `members`, `diff` |
| `references/source-map.md` | URLs, endpoints, and workflows for all 11 data sources |
| `references/context7*.md` | Platform-specific MCP setup, all known Context7 library IDs, and routing advice |
| `README.md` | Installation instructions and quick start |
| `.gitignore` | Excludes cache directory |

Use any existing edition as a reference — `codex/` is the most complete starting point.

### Parity requirements

All editions share the same knowledge base. When your edition includes reference docs, they must contain:

- **All Context7 library IDs** (Creator Docs, Luau, and 7 community packages)
- **All JSON endpoints** (Roblox Status, DevForum search/topic)
- **All common package doc URLs** (ProfileService, Promise, Knit, Rodux, Matter, Fusion, Iris)
- **Recent Change Tracking** and **API Dump Workflow** sections

Platform-specific sections (cache paths, MCP config format, skill metadata) should be adapted for your tool.

### What NOT to do

- Do not modify existing editions — your PR should only add files under your new folder
- Do not modify root files (`skills/bloxus/SKILL.md`, `bloxus-helpers.js`, `README.md`) — those will be updated by the maintainer after your edition is merged
- Do not submit stub or placeholder files — incomplete editions will be sent back for revision

### Process

1. Fork the repo and create a branch (e.g., `windsurf-port`)
2. Add your edition folder with all required files
3. Test that `scripts/api-dump.js fetch` and `class Humanoid` work
4. Open a PR using the template — fill in the completeness checklist
5. A maintainer will review for parity and correctness
