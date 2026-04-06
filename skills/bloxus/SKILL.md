---
name: bloxus
description: "Fetch Roblox documentation — Engine API (classes, services, enums, types), Luau language, Creator Docs, Studio features, cloud APIs. Use when working on .luau/.lua files or any Roblox development task."
---

# Bloxus — Roblox Knowledge Engine

Multi-source intelligence system for Roblox development. Queries 11 data sources (Steps A-K), commands 18 Studio tools, and combines results across 23 patterns to answer any Roblox question with precision.

## Sources

| Step | Source | What it covers | When to use |
|------|--------|---------------|-------------|
| **A** | **API Dump** (Roblox-Client-Tracker JSON) | Every class, property, method, event, enum — structured with types, defaults, tags, security | Need exact API signatures, property types, default values, enum values |
| **B** | **Context7: Engine API** | Engine API reference with prose descriptions and code examples | Need code examples or detailed explanations for specific classes/enums |
| **C** | **Context7: Creator Docs** | Full creator documentation — tutorials, guides, Studio, Luau, cloud APIs, UI, physics, networking, monetization, publishing, moderation | Need conceptual guides, tutorials, best practices, or anything beyond engine API reference |
| **D** | **Context7: Open Source Docs** | Same creator docs from the open-source repo — markdown source | Fallback if the above doesn't return good results, or for raw markdown |
| **E** | **Roblox Studio MCP** (live connection) | Real-time game tree, scripts, console output, instance inspection, execution, asset gen | User is working in Studio — bridge live context with docs |
| **F** | **Context7: Community Packages** (ProfileService, Promise, Knit, etc.) | Docs for popular Wally/community libraries | Project uses community packages (check `wally.toml`) |
| **G** | **DevForum Search** (Discourse API) | Community solutions, bug reports, staff announcements, real-world patterns | Error troubleshooting, recent API changes, community modules, workarounds |
| **H** | **Context7: Luau Style Guide** | Official Roblox Lua/Luau coding conventions and style rules | Questions about naming, formatting, code style, or best practices |
| **I** | **Context7: Luau Language** | Full Luau language spec — type system, generics, metatables, grammar, RFCs, internals | Deep Luau language questions beyond what creator docs cover |
| **J** | **API Dump Diffing** (Roblox-Client-Tracker git history) | What changed between Roblox updates — added/removed/modified classes, members, enums | "What changed recently?", "When was X added?", breaking change investigation |
| **K** | **Roblox Status Page** (`status.roblox.com`) | Live service health — outages, degraded performance, incident history | Debugging connectivity/service failures before blaming your own code |

## Decision Tree: Which Source to Use?

```
Is the question about an exact API signature, type, default, or enum value?
  -> Use the API Dump (Step A) + optionally Context7 Engine API (Step B)

Is the question about how to USE an API, best practices, or code patterns?
  -> Use Context7 Engine API (Step B) + optionally API Dump (Step A)

Is the question about a concept, guide, tutorial, or non-engine topic?
  (Luau, Studio, networking, UI, physics, cloud APIs, publishing, etc.)
  -> Use Context7 Creator Docs (Step C)

Is the user pointing at something in Studio or referencing live game objects?
  -> Use Roblox Studio MCP (Step E) to inspect, then look up docs via Steps A-D

Does the user want to test, verify, or run code in Studio?
  -> Use Step E: execute_luau for quick tests, start_stop_play + get_console_output for full playtests

Does the user need a model, mesh, or material asset?
  -> Use Step E: insert_from_creator_store (Toolbox), generate_mesh (AI), or generate_material (AI)

Does the user want to create or edit scripts in Studio?
  -> Use Step E: multi_edit to create/modify scripts directly in the game tree

Is the question about deep Luau language internals (type system, generics, metatables, grammar)?
  -> Use Luau Language (Step I) — deeper than Creator Docs for language-level questions

Does the user want to know what changed in a recent Roblox update?
  -> Use API Dump Diffing (Step J) to compare versions

Does the code use ProfileService, Promise, Knit, or other community packages?
  -> Use Community Package Docs (Step F) for those libraries

Is a Roblox service failing, timing out, or behaving erratically?
  -> Check Roblox Status (Step K) before debugging — it might be their end, not yours

Is it about a common error, community pattern, or bug workaround?
  -> Use DevForum Search (Step G)

Is it about naming, formatting, or code style?
  -> Use Luau Style Guide (Step H)

Not sure?
  -> Use Context7 Creator Docs (Step C) first — it covers the broadest range
```

---

### Step A: API Dump — Exact Signatures and Types

Use this when you need structured, machine-readable API data: class members, property types, default values, enum items, tags, security levels, inheritance chains.

The CLI script at `${CLAUDE_SKILL_DIR}/scripts/api-dump.js` wraps all API dump operations. It caches the dump at `~/.claude/bloxus-cache/` and auto-downloads if missing or stale (>7 days).

**Subcommands:**

```bash
# Fetch/refresh the API dump cache
node ${CLAUDE_SKILL_DIR}/scripts/api-dump.js fetch

# Extract a class or service (own members only)
node ${CLAUDE_SKILL_DIR}/scripts/api-dump.js class Humanoid

# Extract a class with full inheritance chain (own + inherited members)
node ${CLAUDE_SKILL_DIR}/scripts/api-dump.js class Humanoid --inherited

# Extract an enum with all items and values
node ${CLAUDE_SKILL_DIR}/scripts/api-dump.js enum Material

# Search classes and enums by keyword
node ${CLAUDE_SKILL_DIR}/scripts/api-dump.js search Tween

# Search members across all classes (e.g., "which classes have a Touched event?")
node ${CLAUDE_SKILL_DIR}/scripts/api-dump.js members Touched

# Diff current dump against an older version (see Step J)
node ${CLAUDE_SKILL_DIR}/scripts/api-dump.js diff Full-API-Dump-old.json
```

All output is formatted markdown. The `class` command includes properties, methods, events, and callbacks with their types, tags, and security context. The `members` command searches across every class and accepts an optional `--type` filter (`Property`, `Function`, `Event`, `Callback`).

---

### Step B: Context7 Engine API — Descriptions and Code Examples

Prose descriptions, usage notes, gotchas, and code examples for specific engine APIs. Preferred over WebFetch for clean, structured content.

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /websites/create_roblox_reference_engine
topic: "<describe what you need>"
tokens: 5000
```

See [references/context7-claude.md](${CLAUDE_SKILL_DIR}/references/context7-claude.md) for all library IDs, example queries, and routing advice.

---

### Step C: Context7 Creator Docs — Guides, Tutorials, and Everything Else

Covers the full breadth of `create.roblox.com/docs` — Luau, Studio, networking, UI, physics, cloud APIs, publishing, monetization, moderation, and more.

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /websites/create_roblox
topic: "<describe what you need>"
tokens: 5000
```

See [references/context7-claude.md](${CLAUDE_SKILL_DIR}/references/context7-claude.md) for topic-specific example queries.

---

### Step D: Context7 Open Source Docs — Fallback

If Steps B or C don't return useful results, try the open-source repo version (raw markdown source):

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /roblox/creator-docs
topic: "<same query>"
tokens: 5000
```

---

### Step E: Roblox Studio MCP — Live Game Context

When the Roblox Studio MCP server is connected, you have full read/write/execute access to the live game tree. This bridges documentation with real-time state — inspect instances, read/write scripts, execute Luau, run playtests, generate assets, and capture screenshots.

**18 tools** organized across session management, game tree exploration, script tools, live execution, asset generation, playtest interaction, and visual capture.

Only use Studio MCP tools when the user is actively working in Studio or references live game objects. Always verify the active Studio instance first with `mcp__Roblox_Studio__list_roblox_studios` if there's any ambiguity.

See [references/studio-mcp.md](${CLAUDE_SKILL_DIR}/references/studio-mcp.md) for all 18 tools, parameters, and cross-reference patterns.

---

### Step F: Community Package Docs — Wally Libraries via Context7

When the project uses community packages (check `wally.toml`, `Packages/` folder, or `require()` paths), look up their docs via Context7. Known indexed packages include ProfileService, Promise, Knit, Rodux, Matter, Fusion, and Iris.

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: <library ID from reference>
topic: "<what you need>"
tokens: 5000
```

For unlisted packages, use `mcp__plugin_context7_context7__resolve-library-id` to search by name. If Context7 doesn't index it, fall back to the package's GitHub README via WebFetch.

See [references/context7-claude.md](${CLAUDE_SKILL_DIR}/references/context7-claude.md) for all library IDs and auto-detection mappings.

---

### Step G: DevForum Search — Community Solutions and Staff Announcements

The Roblox DevForum (Discourse-based) has a public search API. Use for community solutions, bug reports, staff announcements, feature updates, and real-world patterns not in official docs.

**Search the DevForum:**

```
Tool: WebFetch
url: https://devforum.roblox.com/search.json?q=SEARCH_QUERY
```

URL-encode the query (spaces as `%20`, `#` as `%23`). Response JSON contains `topics` (with `id`, `title`, `slug`) and `posts` (with `blurb`, `topic_id`).

**Read a specific topic** (first post + top replies):

```
Tool: WebFetch
url: https://devforum.roblox.com/t/TOPIC_ID.json
```

Key fields: `post_stream.posts[0].cooked` (first post HTML), `title`, `tags`. Check `accepted_answer` if present.

**Filter by category** (append to search query):
- `#resources:community-resources` — community modules and tools
- `#resources:community-tutorials` — tutorials and guides
- `#help-and-feedback:scripting-support` — scripting Q&A
- `#updates:announcements` — official Roblox announcements
- `#bug-reports` — known bugs and workarounds

**Fallback:** If the API fails, use `WebFetch` with `https://www.google.com/search?q=site:devforum.roblox.com+QUERY`.

DevForum results are community-generated. Cross-reference any API claims with the API Dump (Step A) or official docs (Steps B/C).

---

### Step H: Context7 Luau Style Guide — Code Conventions

Official Roblox Lua/Luau coding conventions: naming, formatting, code organization, module structure.

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /websites/roblox_github_io_lua-style-guide
topic: "<describe what you need>"
tokens: 5000
```

See [references/context7-claude.md](${CLAUDE_SKILL_DIR}/references/context7-claude.md) for example queries.

---

### Step I: Context7 Luau Language — Deep Language Specification

Deep Luau language questions beyond Creator Docs: type system internals, generics, metatables, grammar rules, RFCs.

**Primary source** (most comprehensive):

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /websites/luau
topic: "<describe what you need>"
tokens: 5000
```

**When to use Step I vs Step C:** Use Step C for practical Roblox-focused questions ("How do I use types in my game?"). Use Step I for language-level detail ("How do generic type packs work?", "Metatable __index resolution order").

See [references/context7-claude.md](${CLAUDE_SKILL_DIR}/references/context7-claude.md) for fallback library IDs and routing guidance.

---

### Step J: API Dump Version Diffing — What Changed Between Updates

Compare the current API dump against a previous version to identify what Roblox added, removed, or modified.

**Step 1: List recent commits to pick a version:**

```bash
curl -s "https://api.github.com/repos/MaximumADHD/Roblox-Client-Tracker/commits?path=Full-API-Dump.json&per_page=5" \
  | node -e "
const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  const commits = JSON.parse(Buffer.concat(chunks).toString());
  commits.forEach((c, i) => {
    console.log(i + ': ' + c.sha + ' | ' + c.commit.message.split('\n')[0] + ' | ' + c.commit.committer.date);
  });
});
"
```

**Step 2: Download the old version by commit SHA:**

```bash
curl -sL "https://raw.githubusercontent.com/MaximumADHD/Roblox-Client-Tracker/COMMIT_SHA/Full-API-Dump.json" \
  -o ~/.claude/bloxus-cache/Full-API-Dump-old.json
```

**Step 3: Diff using the CLI:**

```bash
node ${CLAUDE_SKILL_DIR}/scripts/api-dump.js diff Full-API-Dump-old.json
```

Reports added/removed classes, enums, and member changes. Look up any changed APIs via Steps A-D for context, or search DevForum (Step G) `#updates:announcements` for release notes.

---

### Step K: Roblox Status Page — Service Health Check

Before debugging service-level failures (DataStore timeouts, HTTP 500s, asset loading failures, matchmaking issues), check if Roblox itself is having problems.

**Check current status:**

```
Tool: WebFetch
url: https://status.roblox.com/api/v2/status.json
```

Returns `status.indicator` (`none` = all good, `minor`/`major`/`critical` = problems) and `status.description`.

**Check recent incidents:**

```
Tool: WebFetch
url: https://status.roblox.com/api/v2/incidents/unresolved.json
```

**Check specific components:**

```
Tool: WebFetch
url: https://status.roblox.com/api/v2/components.json
```

Key components: DataStoreService, Asset Delivery, Matchmaking, Publish, Web APIs.

**Fallback:** Check `https://status.roblox.com` in a browser.

---

## Combining Sources — Pattern Quick-Reference

| # | Pattern | Steps | Trigger Example |
|---|---------|-------|-----------------|
| 1 | API lookup + examples | A -> B | "What does TweenService do and how do I use it?" |
| 2 | Implementation guide + API details | C -> A | "How do I implement a save system?" |
| 3 | Luau syntax (basic + deep) | C -> I | "What's the Luau syntax for type intersections?" |
| 4 | Quick API lookup | A | "What type is Humanoid.Health?" |
| 5 | Live script help | E -> A/B -> F | "Help me with this script in Studio" |
| 6 | Cross-class member search | A -> B | "What classes have a Touched event?" |
| 7 | Community package docs | F -> A | "How do I use ProfileService/Promise/Knit?" |
| 8 | Deprecation check + migration | A -> B/C | "Is X deprecated? What should I use instead?" |
| 9 | Enum reverse lookup | A -> B | "Which properties use Enum.Material?" |
| 10 | Security context filter | A | "What can a normal script access on X?" |
| 11 | Replication tag search | A -> C | "What properties don't replicate on X?" |
| 12 | Full inheritance dump | A -> B | "Show me everything Part can do" |
| 13 | Style check | H | "Is my code following Roblox conventions?" |
| 14 | Error troubleshooting | G -> A/B | "I'm getting error X" / "Why does Y not work?" |
| 15 | Recent update changes | J -> G -> C | "Did Roblox change X recently?" |
| 16 | Live API verification | A/B -> E | "Does this API actually work like the docs say?" |
| 17 | Toolbox asset + docs | E -> A/B | "Add a door/tree/NPC model to my game" |
| 18 | Guided script creation | A-D -> E | "Create a script that does X" |
| 19 | AI asset generation | E -> A | "Generate a custom rock/weapon mesh" |
| 20 | Interactive playtest | E -> A-D | "Test this feature / walk me through it" |
| 21 | Deep Luau type system | I -> C | "How does Luau's type system handle X?" |
| 22 | Breaking change investigation | J -> G -> A -> E | "Something broke after the Roblox update" |
| 23 | Service health triage | K -> A-E | "DataStore/HTTP/joins are failing — is it me or Roblox?" |

## Important Notes

- The API dump is the **source of truth** for types, signatures, defaults, and enum values. Do not guess these.
- Context7 is the **preferred enrichment source** over WebFetch — it returns clean, pre-processed content instead of raw HTML.
- If a project has local docs (e.g., `docs/roblox-api/`), check those first — they may contain curated, project-specific context.
- Always wrap yielding Roblox API calls (`Async` suffix) in `pcall()` when writing Luau code.
- `GetProductInfo` is deprecated — prefer `GetProductInfoAsync`. Same for `GetHumanoidDescriptionFromUserId` -> use the `Async` variant.
- You can call Context7 queries **in parallel** with API dump lookups to save time.
- Limit Context7 calls to **3 per question** — plan your queries to cover what you need efficiently.
