---
name: bloxus
description: "Fetch Roblox documentation — Engine API (classes, services, enums, types), Luau language, Studio features, tutorials, guides, cloud/Open Cloud APIs, UI, physics, networking, monetization, and more. Use when working on .luau/.lua files, Roblox Studio projects, or any task involving Roblox development. Triggers on mentions of Roblox classes, services, enums, Luau code, or Roblox concepts (e.g., RemoteEvents, DataStores, TweenService, Marketplace, moderation, localization)."
---

# Bloxus — Roblox Knowledge Engine

**Bloxus v1.0** | Last updated: 2026-03-20 | 11 sources (A-K) | 23 patterns

Multi-source intelligence system for Roblox development. Queries 11 data sources (Steps A-K), commands 18 Studio tools, runs 10 local analysis scripts, and combines results across 23 patterns to answer any Roblox question with precision.

## Sources

| Step | Source | What it covers | When to use |
|------|--------|---------------|-------------|
| **A** | **API Dump** (Roblox-Client-Tracker JSON) | Every class, property, method, event, enum — structured with types, defaults, tags, security | Need exact API signatures, property types, default values, enum values |
| **B** | **Context7: Engine API** (`/websites/create_roblox_reference_engine`) | Engine API reference with prose descriptions and code examples | Need code examples or detailed explanations for specific classes/enums |
| **C** | **Context7: Creator Docs** (`/websites/create_roblox`) | Full creator documentation — tutorials, guides, Studio, Luau, cloud APIs, UI, physics, networking, monetization, publishing, moderation | Need conceptual guides, tutorials, best practices, or anything beyond engine API reference |
| **D** | **Context7: Open Source Docs** (`/roblox/creator-docs`) | Same creator docs from the open-source repo — markdown source | Fallback if the above doesn't return good results, or for raw markdown |
| **E** | **Roblox Studio MCP** (live connection) | Real-time game tree, scripts, console output, instance inspection, execution, asset gen | User is working in Studio — bridge live context with docs |
| **F** | **Context7: Community Packages** (ProfileService, Promise, Knit, etc.) | Docs for popular Wally/community libraries | Project uses community packages (check `wally.toml`) |
| **G** | **DevForum Search** (Discourse API) | Community solutions, bug reports, staff announcements, real-world patterns | Error troubleshooting, recent API changes, community modules, workarounds |
| **H** | **Context7: Luau Style Guide** (`/websites/roblox_github_io_lua-style-guide`) | Official Roblox Lua/Luau coding conventions and style rules | Questions about naming, formatting, code style, or best practices |
| **I** | **Context7: Luau Language** (`/websites/luau` + `/luau-lang/luau`) | Full Luau language spec — type system, generics, metatables, grammar, RFCs, internals | Deep Luau language questions beyond what creator docs cover |
| **J** | **API Dump Diffing** (Roblox-Client-Tracker git history) | What changed between Roblox updates — added/removed/modified classes, members, enums | "What changed recently?", "When was X added?", breaking change investigation |
| **K** | **Roblox Status Page** (`status.roblox.com`) | Live service health — outages, degraded performance, incident history | Debugging connectivity/service failures before blaming your own code |

## When to Use

- Working on any `.luau` or `.lua` file
- Any Roblox Studio project (look for `default.project.json`, `wally.toml`, `aftman.toml`)
- User mentions a Roblox class, service, or enum by name
- You need to verify API signatures, property types, defaults, or enum values
- Questions about **Luau** language features (syntax, types, metatables, string manipulation)
- Questions about **Studio** features (editor, plugins, tooling, debugging)
- Questions about **networking** (RemoteEvents, RemoteFunctions, replication, client-server)
- Questions about **UI** (ScreenGui, frames, layouts, Roact, rich text)
- Questions about **physics** (constraints, assemblies, collisions, raycasting)
- Questions about **animation** (Animator, AnimationTrack, TweenService, springs)
- Questions about **data persistence** (DataStoreService, MemoryStoreService, OrderedDataStore)
- Questions about **monetization** (Developer Products, Game Passes, Premium, Marketplace)
- Questions about **cloud/Open Cloud APIs** (REST APIs, webhooks, messaging, datastores via HTTP)
- Questions about **publishing, localization, accessibility, performance, moderation**
- You're unsure about anything Roblox-related — **look it up instead of guessing**

## How to Fetch Documentation

### Decision: Which source to use?

```
Is the question about an exact API signature, type, default, or enum value?
  → Use the API Dump (Step A) + optionally Context7 Engine API (Step B)

Is the question about how to USE an API, best practices, or code patterns?
  → Use Context7 Engine API (Step B) + optionally API Dump (Step A)

Is the question about a concept, guide, tutorial, or non-engine topic?
  (Luau, Studio, networking, UI, physics, cloud APIs, publishing, etc.)
  → Use Context7 Creator Docs (Step C)

Is the user pointing at something in Studio or referencing live game objects?
  → Use Roblox Studio MCP (Step E) to inspect, then look up docs via Steps A-D

Does the user want to test, verify, or run code in Studio?
  → Use Step E: execute_luau for quick tests, start_stop_play + get_console_output for full playtests

Does the user need a model, mesh, or material asset?
  → Use Step E: insert_from_creator_store (Toolbox), generate_mesh (AI), or generate_material (AI)

Does the user want to create or edit scripts in Studio?
  → Use Step E: multi_edit to create/modify scripts directly in the game tree

Is the question about deep Luau language internals (type system, generics, metatables, grammar)?
  → Use Luau Language (Step I) — deeper than Creator Docs for language-level questions

Does the user want to know what changed in a recent Roblox update, or when an API was added/removed?
  → Use API Dump Diffing (Step J) to compare versions

Does the code use ProfileService, Promise, Knit, or other community packages?
  → Use Community Package Docs (Step F) for those libraries

Is a Roblox service failing, timing out, or behaving erratically for no apparent reason?
  → Check Roblox Status (Step K) before debugging — it might be their end, not yours

Is it about a common error, community pattern, recent API change, or bug workaround?
  → Use DevForum Search (Step G)

Is it a question about naming, formatting, or code style?
  → Use Luau Style Guide (Step H)

Not sure?
  → Use Context7 Creator Docs (Step C) first — it covers the broadest range
```

---

### Step A: API Dump — Exact signatures and types

Use this when you need structured, machine-readable API data.

All scripts below use the shared helper at `~/.claude/bloxus-cache/bloxus-helpers.js`. The helper exports `loadDump(file?)` which resolves the cache path and returns parsed JSON.

**Download and cache (if needed):**

Check if the cached dump exists and is less than 7 days old:

```bash
node -e "
const fs = require('fs');
const path = ((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/Full-API-Dump.json');
try {
  const age = Date.now() - fs.statSync(path).mtimeMs;
  if (age < 7 * 86400000) { console.log('FRESH'); } else { console.log('STALE'); }
} catch (e) { console.log('MISSING'); }
"
```

If `MISSING` or `STALE`, download it:

```bash
mkdir -p ~/.claude/bloxus-cache
curl -sL "https://raw.githubusercontent.com/MaximumADHD/Roblox-Client-Tracker/roblox/Full-API-Dump.json" \
  -o ~/.claude/bloxus-cache/Full-API-Dump.json
```

**Extract a class or service:**

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const name = 'TARGET_NAME';
const cls = data.Classes.find(c => c.Name.toLowerCase() === name.toLowerCase());
if (!cls) { console.log('Class not found:', name); process.exit(1); }

console.log('# ' + cls.Name);
console.log('Superclass:', cls.Superclass);
if (cls.Tags) console.log('Tags:', JSON.stringify(cls.Tags));
console.log('');

const groups = {};
cls.Members.forEach(m => { (groups[m.MemberType] = groups[m.MemberType] || []).push(m); });

if (groups.Property) {
  console.log('## Properties\n');
  groups.Property
    .filter(p => !p.Tags || !p.Tags.includes('Deprecated'))
    .forEach(p => {
      const tags = (p.Tags || []).filter(t => typeof t === 'string').join(', ');
      const def = p.Default !== undefined ? ' = ' + p.Default : '';
      console.log('- **' + p.Name + '**: ' + p.ValueType.Name + def + (tags ? ' [' + tags + ']' : '') + (p.Category ? ' (' + p.Category + ')' : ''));
    });
  console.log('');
}

if (groups.Function) {
  console.log('## Methods\n');
  groups.Function
    .filter(f => !f.Tags || !f.Tags.includes('Deprecated'))
    .forEach(f => {
      const params = (f.Parameters || []).map(p => p.Name + ': ' + p.Type.Name).join(', ');
      const ret = f.ReturnType ? f.ReturnType.Name : 'void';
      const tags = (f.Tags || []).filter(t => typeof t === 'string').join(', ');
      console.log('- **' + f.Name + '**(' + params + '): ' + ret + (tags ? ' [' + tags + ']' : ''));
    });
  console.log('');
}

if (groups.Event) {
  console.log('## Events\n');
  groups.Event
    .filter(e => !e.Tags || !e.Tags.includes('Deprecated'))
    .forEach(e => {
      const params = (e.Parameters || []).map(p => p.Name + ': ' + p.Type.Name).join(', ');
      console.log('- **' + e.Name + '**(' + params + ')');
    });
  console.log('');
}

if (groups.Callback) {
  console.log('## Callbacks\n');
  groups.Callback.forEach(cb => {
    const params = (cb.Parameters || []).map(p => p.Name + ': ' + p.Type.Name).join(', ');
    console.log('- **' + cb.Name + '**(' + params + ')');
  });
  console.log('');
}
"
```

**Extract an enum:**

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const name = 'TARGET_NAME';
const en = data.Enums.find(e => e.Name.toLowerCase() === name.toLowerCase());
if (!en) { console.log('Enum not found:', name); process.exit(1); }
console.log('# Enum.' + en.Name + '\n');
en.Items.forEach(item => {
  const legacy = item.LegacyNames ? ' (legacy: ' + item.LegacyNames.join(', ') + ')' : '';
  console.log('- **' + item.Name + '** = ' + item.Value + legacy);
});
"
```

**Search by keyword:**

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const q = 'KEYWORD'.toLowerCase();
const matches = data.Classes.filter(c => c.Name.toLowerCase().includes(q)).map(c => c.Name);
console.log('Matching classes:', matches.slice(0, 20).join(', '));
const enumMatches = data.Enums.filter(e => e.Name.toLowerCase().includes(q)).map(e => e.Name);
console.log('Matching enums:', enumMatches.slice(0, 20).join(', '));
"
```

**Search members across all classes** (e.g., "which classes have a Touched event?"):

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const q = 'MEMBER_NAME'.toLowerCase();
const memberType = ''; // optional: 'Property', 'Function', 'Event', 'Callback' — leave empty for all
const results = [];
data.Classes.forEach(cls => {
  cls.Members.forEach(m => {
    if (m.Name.toLowerCase().includes(q) && (!memberType || m.MemberType === memberType)) {
      results.push({ class: cls.Name, member: m.Name, type: m.MemberType,
        detail: m.MemberType === 'Property' ? m.ValueType.Name :
                m.MemberType === 'Function' ? '(' + (m.Parameters||[]).map(p=>p.Name+':'+p.Type.Name).join(', ') + '): ' + (m.ReturnType?m.ReturnType.Name:'void') :
                '(' + (m.Parameters||[]).map(p=>p.Name+':'+p.Type.Name).join(', ') + ')'
      });
    }
  });
});
if (!results.length) { console.log('No members matching:', q); process.exit(0); }
console.log('Found ' + results.length + ' matches:\n');
results.slice(0, 30).forEach(r => {
  console.log('- **' + r.class + '.' + r.member + '** [' + r.type + '] ' + r.detail);
});
if (results.length > 30) console.log('... and ' + (results.length - 30) + ' more');
"
```

**Show deprecated members with replacements** for a class:

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const name = 'TARGET_NAME';
const cls = data.Classes.find(c => c.Name.toLowerCase() === name.toLowerCase());
if (!cls) { console.log('Class not found:', name); process.exit(1); }
const deprecated = cls.Members.filter(m => m.Tags && m.Tags.includes('Deprecated'));
if (!deprecated.length) { console.log('No deprecated members in ' + cls.Name); process.exit(0); }
console.log('# Deprecated members in ' + cls.Name + '\n');
deprecated.forEach(m => {
  const asyncVariant = cls.Members.find(o => o.Name === m.Name + 'Async' && (!o.Tags || !o.Tags.includes('Deprecated')));
  const replacement = asyncVariant ? '→ Use **' + asyncVariant.Name + '** instead' : '(check docs for replacement)';
  console.log('- ~~' + m.Name + '~~ [' + m.MemberType + '] ' + replacement);
});
"
```

**Inheritance-aware class dump** — get ALL members (own + inherited) in one shot:

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const name = 'TARGET_NAME';
const classMap = {};
data.Classes.forEach(c => classMap[c.Name] = c);

function getChain(n) {
  const chain = [];
  let cur = classMap[n];
  while (cur) {
    chain.push(cur);
    cur = cur.Superclass ? classMap[cur.Superclass] : null;
  }
  return chain;
}

const cls = data.Classes.find(c => c.Name.toLowerCase() === name.toLowerCase());
if (!cls) { console.log('Class not found:', name); process.exit(1); }
const chain = getChain(cls.Name);
console.log('# ' + cls.Name + ' (full inheritance)');
console.log('Chain: ' + chain.map(c => c.Name).join(' → ') + '\n');

const seen = new Set();
const allMembers = { Property: [], Function: [], Event: [], Callback: [] };
chain.forEach(c => {
  c.Members.forEach(m => {
    const key = m.MemberType + ':' + m.Name;
    if (seen.has(key)) return;
    seen.add(key);
    if (!m.Tags || !m.Tags.includes('Deprecated')) {
      const source = c.Name === cls.Name ? '' : ' (from ' + c.Name + ')';
      if (allMembers[m.MemberType]) allMembers[m.MemberType].push({ ...m, source });
    }
  });
});

Object.entries(allMembers).forEach(([type, members]) => {
  if (!members.length) return;
  const label = type === 'Function' ? 'Methods' : type + 's';
  console.log('## ' + label + '\n');
  members.forEach(m => {
    const tags = (m.Tags || []).filter(t => typeof t === 'string').join(', ');
    let detail = '';
    if (type === 'Property') detail = m.ValueType.Name;
    else if (type === 'Function') detail = '(' + (m.Parameters||[]).map(p=>p.Name+':'+p.Type.Name).join(', ') + '): ' + (m.ReturnType?m.ReturnType.Name:'void');
    else detail = '(' + (m.Parameters||[]).map(p=>p.Name+':'+p.Type.Name).join(', ') + ')';
    console.log('- **' + m.Name + '**: ' + detail + (tags ? ' [' + tags + ']' : '') + m.source);
  });
  console.log('');
});
"
```

**Enum reverse lookup** — find which properties use a specific enum (e.g., "who uses Enum.Material?"):

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const enumName = 'TARGET_ENUM';
const results = [];
data.Classes.forEach(cls => {
  cls.Members.forEach(m => {
    if (m.MemberType === 'Property' && m.ValueType && m.ValueType.Name.toLowerCase() === enumName.toLowerCase()) {
      if (!m.Tags || !m.Tags.includes('Deprecated'))
        results.push(cls.Name + '.' + m.Name);
    }
    if (m.Parameters) {
      m.Parameters.forEach(p => {
        if (p.Type && p.Type.Name.toLowerCase() === enumName.toLowerCase())
          results.push(cls.Name + ':' + m.Name + '() param ' + p.Name);
      });
    }
    if (m.ReturnType && m.ReturnType.Name.toLowerCase() === enumName.toLowerCase())
      results.push(cls.Name + ':' + m.Name + '() returns ' + enumName);
  });
});
if (!results.length) { console.log('No usages of', enumName, 'found'); process.exit(0); }
console.log('# Usages of Enum.' + enumName + ' (' + results.length + ' found)\n');
results.slice(0, 40).forEach(r => console.log('- ' + r));
if (results.length > 40) console.log('... and ' + (results.length - 40) + ' more');
"
```

**Security context filter** — show only members accessible from a specific security level:

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const name = 'TARGET_NAME';
// Set context: 'None' = normal scripts, 'PluginSecurity' = plugins, 'LocalUserSecurity' = command bar, 'RobloxScriptSecurity' = CoreScripts only
const context = 'None';
const cls = data.Classes.find(c => c.Name.toLowerCase() === name.toLowerCase());
if (!cls) { console.log('Class not found:', name); process.exit(1); }

function getAccess(m) {
  const sec = m.Security;
  if (!sec) return { read: true, write: true };
  if (typeof sec === 'string') {
    const ok = sec === 'None' || sec === context;
    return { read: ok, write: ok };
  }
  const read = sec.Read || 'None';
  const write = sec.Write || 'None';
  const canRead = read === 'None' || read === context;
  const canWrite = write === 'None' || write === context;
  return { read: canRead, write: canWrite };
}

const active = cls.Members.filter(m => !m.Tags || !m.Tags.includes('Deprecated'));
const fullAccess = [];
const readOnly = [];
const writeOnly = [];
const blocked = [];
active.forEach(m => {
  const a = getAccess(m);
  if (a.read && a.write) fullAccess.push(m);
  else if (a.read && !a.write) readOnly.push(m);
  else if (!a.read && a.write) writeOnly.push(m);
  else blocked.push(m);
});

console.log('# ' + cls.Name + ' — accessible from [' + (context === 'None' ? 'normal scripts' : context) + ']\n');
if (fullAccess.length) {
  console.log('## Full Access (' + fullAccess.length + ')\n');
  fullAccess.forEach(m => console.log('- ' + m.Name + ' [' + m.MemberType + ']'));
}
if (readOnly.length) {
  console.log('\n## Read Only (' + readOnly.length + ')\n');
  readOnly.forEach(m => console.log('- ' + m.Name + ' [' + m.MemberType + ']'));
}
if (writeOnly.length) {
  console.log('\n## Write Only (' + writeOnly.length + ')\n');
  writeOnly.forEach(m => console.log('- ' + m.Name + ' [' + m.MemberType + ']'));
}
if (blocked.length) {
  console.log('\n## Blocked (' + blocked.length + ')\n');
  blocked.forEach(m => {
    const sec = typeof m.Security === 'string' ? m.Security : JSON.stringify(m.Security);
    console.log('- ' + m.Name + ' [' + m.MemberType + '] requires ' + sec);
  });
}
"
```

**Tag-based search** — find members by tags like `NotReplicated`, `ReadOnly`, `Yields`, `Hidden`:

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const data = loadDump();
const tag = 'TARGET_TAG'; // e.g., 'Yields', 'ReadOnly', 'NotReplicated', 'Hidden', 'NotBrowsable'
const results = [];
data.Classes.forEach(cls => {
  cls.Members.forEach(m => {
    if (m.Tags && m.Tags.includes(tag)) {
      results.push({ class: cls.Name, member: m.Name, type: m.MemberType });
    }
  });
});
if (!results.length) { console.log('No members with tag:', tag); process.exit(0); }
console.log('# Members tagged [' + tag + '] (' + results.length + ' found)\n');
results.slice(0, 40).forEach(r => console.log('- ' + r.class + '.' + r.member + ' [' + r.type + ']'));
if (results.length > 40) console.log('... and ' + (results.length - 40) + ' more');
"
```

---

### Step B: Context7 Engine API — Descriptions and code examples for classes/enums

Use this to get prose descriptions, usage notes, gotchas, and code examples for specific engine APIs. This is **preferred over WebFetch** as it returns clean, structured content.

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /websites/create_roblox_reference_engine
topic: "<describe what you need — e.g., 'TweenService usage and code examples', 'Humanoid state changes and events'>"
tokens: 5000
```

**Example queries:**
- `"How to use TweenService to animate UI elements"`
- `"DataStoreService SetAsync and UpdateAsync error handling patterns"`
- `"Humanoid health, death, and state changed events"`
- `"RemoteEvent security best practices and rate limiting"`

---

### Step C: Context7 Creator Docs — Guides, tutorials, and everything else

Use this for **anything beyond the engine API reference**. This covers the full breadth of `create.roblox.com/docs`.

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /websites/create_roblox
topic: "<describe what you need>"
tokens: 5000
```

**Example queries by topic:**

| Topic | Example query |
|-------|--------------|
| Luau language | `"Luau type annotations and generics syntax"` |
| Studio | `"How to use the Animation Editor in Studio"` |
| Networking | `"Client-server communication with RemoteEvents and RemoteFunctions"` |
| UI | `"Creating responsive UI layouts with UIListLayout and UIGridLayout"` |
| Physics | `"Constraint types and when to use each one"` |
| Animation | `"Playing animations on character models with Animator"` |
| Data stores | `"DataStore best practices for saving player data"` |
| Monetization | `"Implementing Developer Products and processing purchases"` |
| Cloud APIs | `"Open Cloud API authentication and DataStore REST endpoints"` |
| Publishing | `"Localization setup and translating game content"` |
| Performance | `"Performance optimization and MicroProfiler usage"` |
| Moderation | `"Text filtering and chat moderation requirements"` |
| Avatar | `"Avatar customization and HumanoidDescription"` |
| Audio | `"Playing sounds and using SoundService"` |
| Lighting | `"Lighting technology comparison: Future vs ShadowMap"` |
| Input | `"Handling user input with UserInputService and ContextActionService"` |
| Terrain | `"Generating and editing terrain programmatically"` |

---

### Step D: Context7 Open Source Docs — Fallback

If Steps B or C don't return useful results, try the open-source repo version:

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /roblox/creator-docs
topic: "<same query>"
tokens: 5000
```

---

### Step E: Roblox Studio MCP — Live game context (18 tools)

When the Roblox Studio MCP server is connected, you have full read/write/execute access to the live game. This is the most powerful source — it bridges documentation with real-time state.

#### E.1: Session Management

Before any Studio interaction, ensure the right instance is active:

```
mcp__Roblox_Studio__list_roblox_studios   → list all open Studio instances (name, id, active status)
mcp__Roblox_Studio__set_active_studio     → switch active instance by studio_id
```

**Always verify** the active Studio when the user has multiple places open.

#### E.2: Game Tree Exploration

```
mcp__Roblox_Studio__search_game_tree   → explore hierarchy with filters (path, instance_type, keywords, max_depth)
mcp__Roblox_Studio__inspect_instance   → get all properties, attributes, children summary for a specific instance
```

- `search_game_tree` supports `instance_type` (IsA check: `"BasePart"`, `"BaseScript"`, `"GuiObject"`), `keywords`, `path`, and `max_depth` (default 3, max 10)
- `inspect_instance` returns every readable property, custom attributes, and recursive child counts
- Both return `className` which you can feed into Step A/B for docs

#### E.3: Script Tools

```
mcp__Roblox_Studio__script_read     → read a script's full source (dot-notation path)
mcp__Roblox_Studio__script_grep     → regex search across ALL scripts in the game (capped at 50 matches)
mcp__Roblox_Studio__script_search   → fuzzy name search to find scripts by name (capped at 10 results)
mcp__Roblox_Studio__multi_edit      → create new scripts OR make multiple edits to existing scripts atomically
```

- `script_search` is for when you know the name but not the path — use it before `script_read`
- `multi_edit` can **create** scripts (provide `className`: `"Script"`, `"LocalScript"`, or `"ModuleScript"`) or edit existing ones
- For new scripts: first edit uses empty `old_string` to set initial content

#### E.4: Live Execution & Testing

```
mcp__Roblox_Studio__execute_luau     → run arbitrary Luau code in Studio and get the result
mcp__Roblox_Studio__start_stop_play  → start or stop playtesting (is_start: true/false)
mcp__Roblox_Studio__get_console_output → read Output/console logs during playtest
```

- `execute_luau` runs in the **command bar context** (PluginSecurity) — can access any service, read/write properties, test code snippets
- Use it to **verify** API behavior live: run a snippet, check the result, then look up docs if something is unexpected
- `start_stop_play` + `get_console_output` = full playtest-and-debug loop

#### E.5: Asset Generation & Marketplace

```
mcp__Roblox_Studio__insert_from_creator_store  → search Toolbox/Marketplace and insert a model by name
mcp__Roblox_Studio__generate_mesh              → AI-generate a textured 3D mesh from a text prompt
mcp__Roblox_Studio__generate_material          → AI-generate a material variant from a description
```

- `insert_from_creator_store` searches the Roblox Marketplace — use for "find me a free X model" or "add a door"
- Returns a unique GUID tag for referencing the inserted model in subsequent `execute_luau` calls
- `generate_mesh` creates meshes with bounding box control (`size: {x, y, z}`) and triangle budget (`maxTriangles`: 12-20000)
- `generate_material` creates material variants — returns `BaseMaterial` and `Name` to apply to parts

#### E.6: Playtest Interaction

```
mcp__Roblox_Studio__character_navigation  → move the character to coordinates or an instance path
mcp__Roblox_Studio__user_keyboard_input   → send keyDown/keyUp/keyPress/textInput events
mcp__Roblox_Studio__user_mouse_input      → send moveTo/click/rightClick/scroll events
```

- Use these during playtesting (`start_stop_play` with `is_start: true`) to simulate player actions
- `character_navigation` accepts either `{x, y, z}` coordinates or `instance_path` (dot notation), with optional `speed_multiplier` (0.1-10.0)
- Keyboard input supports all `Enum.KeyCode` values — useful for testing keybind systems
- Mouse input can target instances by path or screen coordinates

#### E.7: Visual Capture

```
mcp__Roblox_Studio__screen_capture  → capture the current Studio viewport as an image
```

- Use for visual verification: capture before/after states when making changes
- Pass a unique `capture_id` (e.g., `"before_edit"`, `"after_edit"`)

#### E.8: Cross-Reference Patterns

| Scenario | Studio MCP tools | Then look up |
|----------|-----------------|-------------|
| User says "this script" or "the handler" | `script_search` → find it, `script_read` → get source | APIs used in the source (Steps A/B) |
| User points at a game object | `inspect_instance` → get ClassName + properties | That class's docs (Steps A/B) |
| "What services am I using?" | `search_game_tree` with `instance_type` filter | Each service's API (Step A) |
| "Find all RemoteEvents" | `script_grep` for `:FireServer\|:FireClient` | RemoteEvent/RemoteFunction docs (Step B) |
| Debug a runtime issue | `get_console_output` → read errors | Relevant API docs for the error context |
| "Does this API actually work like the docs say?" | `execute_luau` → test it live | Compare result with Step A/B |
| "Add a tree/door/NPC model" | `insert_from_creator_store` → search and insert | Docs for the inserted class (Step A) |
| "Generate a custom rock/weapon" | `generate_mesh` → create it | MeshPart docs (Step A/B) |
| "Test if the player can jump here" | `start_stop_play` → `character_navigation` → observe | Physics/Humanoid docs (Steps A/B) |
| "Screenshot what it looks like now" | `screen_capture` → capture viewport | — |
| "Create a new script for X" | `multi_edit` with `className` → create script | Look up APIs needed for the script (Steps A-D) |

**Important:** Only use Studio MCP tools when the user is actively working in Studio or references live game objects. Don't call them speculatively. Always verify the active Studio instance first with `list_roblox_studios` if there's any ambiguity.

---

### Step F: Community Package Docs — Wally libraries via Context7

When the project uses community packages (check `wally.toml`, `Packages/` folder, or `require()` paths), look up their docs via Context7.

**Known indexed packages:**

| Package | Context7 Library ID | Snippets |
|---------|-------------------|----------|
| **ProfileService** (data persistence) | `/websites/madstudioroblox_github_io_profileservice` | 68 |
| **Promise** (async/await) | `/evaera/roblox-lua-promise` | 84 |
| **Knit** (game framework) | `/websites/sleitnick_github_io_knit` | 284 |
| **Rodux** (state management) | `/roblox/rodux` | 38 |
| **Matter** (ECS framework) | `/websites/matter-ecs_github_io_matter` | 49 |
| **Fusion** (reactive UI) | `/dphfox/fusion` | 378 |
| **Iris** (immediate-mode UI) | `/sirmallard/iris` | 33 |

**Usage:**

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: <library ID from table above>
topic: "<what you need>"
tokens: 5000
```

**Auto-detect from project files:** If you see any of these in `wally.toml` dependencies or `require()` paths, use the corresponding Context7 library for docs instead of guessing:

- `madstudioroblox/profileservice` → `/websites/madstudioroblox_github_io_profileservice`
- `evaera/promise` → `/evaera/roblox-lua-promise`
- `sleitnick/knit` → `/websites/sleitnick_github_io_knit`
- `roblox/rodux` → `/roblox/rodux`
- `matter-ecs/matter` → `/websites/matter-ecs_github_io_matter`
- `dphfox/fusion` or `elttob/fusion` → `/dphfox/fusion`
- `sirmallard/iris` → `/sirmallard/iris`

**For unlisted packages** (e.g., GoodSignal, Trove, Maid, Janitor, Comm, Net, TableUtil): Use `mcp__plugin_context7_context7__resolve-library-id` to search for the package by name. If Context7 doesn't index it, fall back to the package's GitHub README or docs site via WebFetch.

---

### Step G: DevForum Search — Community solutions and staff announcements

The Roblox DevForum (Discourse-based) has a public search API. Use this for community solutions, bug reports, staff announcements, feature updates, and real-world patterns that aren't in the official docs.

**If this fails:** Fall back to `WebFetch` with `https://www.google.com/search?q=site:devforum.roblox.com+QUERY` or ask the user to check DevForum manually.

**Search the DevForum:**

```
Tool: WebFetch
url: https://devforum.roblox.com/search.json?q=SEARCH_QUERY
```

**Note:** URL-encode the query (spaces as `%20`, `#` as `%23`, etc.).

The response JSON contains `topics` and `posts` arrays. Extract the useful bits:

- `topics[].id` — topic ID
- `topics[].title` — topic title
- `topics[].slug` — URL-friendly slug
- `posts[].blurb` — excerpt/summary
- `posts[].topic_id` — which topic it belongs to

**Read a specific topic** (first post + top replies):

```
Tool: WebFetch
url: https://devforum.roblox.com/t/TOPIC_ID.json
```

Key fields in the response:
- `post_stream.posts[0].cooked` — first post HTML content
- `post_stream.posts[].cooked` — replies (check `accepted_answer` if present)
- `title`, `category_id`, `tags`

**Filter by category** (append to search query):
- `#resources:community-resources` — community modules and tools
- `#resources:community-tutorials` — tutorials and guides
- `#help-and-feedback:scripting-support` — scripting Q&A
- `#updates:announcements` — official Roblox announcements
- `#bug-reports` — known bugs and workarounds

Example: `https://devforum.roblox.com/search.json?q=DataStore%20session%20locking%20%23resources:community-resources`

**Important:** DevForum results are community-generated. Cross-reference any API claims with the API Dump (Step A) or official docs (Steps B/C) before using them.

---

### Step H: Context7 Luau Style Guide — Code conventions

Use this for questions about naming conventions, formatting, code organization, and Roblox-specific Luau style rules.

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /websites/roblox_github_io_lua-style-guide
topic: "<describe what you need — e.g., 'variable naming conventions', 'when to use local vs module scope'>"
tokens: 5000
```

**Example queries:**
- `"Naming conventions for services, modules, and variables"`
- `"How to format function declarations and calls"`
- `"When to use PascalCase vs camelCase in Luau"`
- `"Module structure and require patterns"`

---

### Step I: Context7 Luau Language — Deep language specification

Use this for deep Luau language questions that go beyond what the Creator Docs cover — type system internals, generics, metatables, grammar rules, RFCs, and language design decisions.

**Primary source** (838 snippets — most comprehensive):

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /websites/luau
topic: "<describe what you need>"
tokens: 5000
```

**Fallback: GitHub repo source** (129 snippets — includes source-level details):

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /luau-lang/luau
topic: "<same query>"
tokens: 5000
```

**Additional: Luau site docs** (412 snippets):

```
Tool: mcp__plugin_context7_context7__query-docs
libraryId: /luau-lang/site
topic: "<same query>"
tokens: 5000
```

**When to use Step I vs Step C (Creator Docs):**

| Question | Use |
|----------|-----|
| "How do I use types in my Roblox game?" | Step C (practical, Roblox-focused) |
| "How do generic type packs work in Luau?" | Step I (language-level detail) |
| "What's the syntax for if-then-else?" | Step C (basic syntax) |
| "How does Luau's type narrowing work with typeof?" | Step I (type system internals) |
| "Metatable __index resolution order" | Step I (language semantics) |
| "Best practices for ModuleScripts" | Step C (Roblox patterns) |

---

### Step J: API Dump Version Diffing — What changed between updates

Use this to compare the current API dump against a previous version to identify what Roblox added, removed, or modified. The Roblox-Client-Tracker repo has git history of every API change.

**If this fails:** Fall back to DevForum (Step G) `#updates:announcements` for release notes, or check `https://github.com/MaximumADHD/Roblox-Client-Tracker/commits/roblox/Full-API-Dump.json` in a browser.

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

This lists the 5 most recent commits that changed the API dump. The user picks one (or default to index 1 = one version back).

**Step 2: Download the old version by commit SHA:**

```bash
curl -sL "https://raw.githubusercontent.com/MaximumADHD/Roblox-Client-Tracker/COMMIT_SHA/Full-API-Dump.json" \
  -o ~/.claude/bloxus-cache/Full-API-Dump-old.json
```

Replace `COMMIT_SHA` with the full SHA from Step 1.

**Step 3: Diff the old version against the current cache:**

The current cached dump at `Full-API-Dump.json` is the NEW version. The downloaded `Full-API-Dump-old.json` is the OLD version.

```bash
node -e "
const { loadDump } = require((process.env.HOME || process.env.USERPROFILE) + '/.claude/bloxus-cache/bloxus-helpers.js');
const oldData = loadDump('Full-API-Dump-old.json');
const newData = loadDump();

// Build maps
const oldClasses = new Map(oldData.Classes.map(c => [c.Name, c]));
const newClasses = new Map(newData.Classes.map(c => [c.Name, c]));
const oldEnums = new Map(oldData.Enums.map(e => [e.Name, e]));
const newEnums = new Map(newData.Enums.map(e => [e.Name, e]));

// Find added/removed classes
const addedClasses = [...newClasses.keys()].filter(k => !oldClasses.has(k));
const removedClasses = [...oldClasses.keys()].filter(k => !newClasses.has(k));

// Find added/removed members in existing classes
const memberChanges = [];
for (const [name, newCls] of newClasses) {
  const oldCls = oldClasses.get(name);
  if (!oldCls) continue;
  const oldMembers = new Set(oldCls.Members.map(m => m.MemberType + ':' + m.Name));
  const newMembers = new Set(newCls.Members.map(m => m.MemberType + ':' + m.Name));
  for (const m of newCls.Members) {
    const key = m.MemberType + ':' + m.Name;
    if (!oldMembers.has(key)) memberChanges.push({ class: name, member: m.Name, type: m.MemberType, change: 'added' });
  }
  for (const m of oldCls.Members) {
    const key = m.MemberType + ':' + m.Name;
    if (!newMembers.has(key)) memberChanges.push({ class: name, member: m.Name, type: m.MemberType, change: 'removed' });
  }
}

// Find added/removed enums
const addedEnums = [...newEnums.keys()].filter(k => !oldEnums.has(k));
const removedEnums = [...oldEnums.keys()].filter(k => !newEnums.has(k));

// Output
if (addedClasses.length) console.log('## Added Classes\n' + addedClasses.map(c => '+ ' + c).join('\n') + '\n');
if (removedClasses.length) console.log('## Removed Classes\n' + removedClasses.map(c => '- ' + c).join('\n') + '\n');
if (addedEnums.length) console.log('## Added Enums\n' + addedEnums.map(e => '+ ' + e).join('\n') + '\n');
if (removedEnums.length) console.log('## Removed Enums\n' + removedEnums.map(e => '- ' + e).join('\n') + '\n');
if (memberChanges.length) {
  console.log('## Member Changes (' + memberChanges.length + ')\n');
  memberChanges.slice(0, 50).forEach(m => {
    const prefix = m.change === 'added' ? '+' : '-';
    console.log(prefix + ' ' + m.class + '.' + m.member + ' [' + m.type + ']');
  });
  if (memberChanges.length > 50) console.log('... and ' + (memberChanges.length - 50) + ' more');
}
if (!addedClasses.length && !removedClasses.length && !addedEnums.length && !removedEnums.length && !memberChanges.length) {
  console.log('No differences found — dumps are identical.');
}
"
```

**Workflow summary:**
1. List recent commits (Step 1) -- let user pick or default to one version back
2. Download that commit's dump as `Full-API-Dump-old.json` (Step 2)
3. Run the diff script comparing old vs current cache (Step 3)
4. Look up any changed APIs via Steps A-D for context
5. Optionally search DevForum (Step G) `#updates:announcements` for release notes

---

### Step K: Roblox Status Page — Service health check

Before debugging service-level failures (DataStore timeouts, HTTP 500s, asset loading failures, matchmaking issues), check if Roblox itself is having problems.

**If this fails:** Check `https://status.roblox.com` in a browser, or ask the user to verify manually.

**Check current status:**

```
Tool: WebFetch
url: https://status.roblox.com/api/v2/status.json
```

Returns JSON with `status.indicator` (`none` = all good, `minor`/`major`/`critical` = problems) and `status.description`.

**Check recent incidents:**

```
Tool: WebFetch
url: https://status.roblox.com/api/v2/incidents/unresolved.json
```

Returns `incidents[]` with `name`, `status`, `impact`, `created_at`, and `incident_updates[]` with timeline details.

**Check specific components:**

```
Tool: WebFetch
url: https://status.roblox.com/api/v2/components.json
```

Returns `components[]` — each has `name` and `status` (`operational`, `degraded_performance`, `partial_outage`, `major_outage`). Key components to watch:

| Component | Affects |
|-----------|---------|
| DataStoreService | Player data saves/loads |
| Asset Delivery | Models, images, sounds, meshes loading |
| Matchmaking | Teleporting, server joins |
| Publish | Publishing places/assets from Studio |
| Web APIs | Open Cloud, catalog, economy endpoints |

---

## Combining Sources — Pattern Quick-Reference

The decision tree above explains routing logic. This table is a quick lookup for common multi-source patterns.

| # | Pattern | Steps | Trigger Example |
|---|---------|-------|-----------------|
| 1 | API lookup + examples | A → B | "What does TweenService do and how do I use it?" |
| 2 | Implementation guide + API details | C → A | "How do I implement a save system?" |
| 3 | Luau syntax (basic + deep) | C → I | "What's the Luau syntax for type intersections?" |
| 4 | Quick API lookup | A | "What type is Humanoid.Health?" |
| 5 | Live script help | E → A/B → F | "Help me with this script in Studio" |
| 6 | Cross-class member search | A → B | "What classes have a Touched event?" |
| 7 | Community package docs | F → A | "How do I use ProfileService/Promise/Knit?" |
| 8 | Deprecation check + migration | A → B/C | "Is X deprecated? What should I use instead?" |
| 9 | Enum reverse lookup | A → B | "Which properties use Enum.Material?" |
| 10 | Security context filter | A | "What can a normal script access on X?" |
| 11 | Replication tag search | A → C | "What properties don't replicate on X?" |
| 12 | Full inheritance dump | A → B | "Show me everything Part can do" |
| 13 | Style check | H | "Is my code following Roblox conventions?" |
| 14 | Error troubleshooting | G → A/B | "I'm getting error X" / "Why does Y not work?" |
| 15 | Recent update changes | J → G → C | "Did Roblox change X recently?" |
| 16 | Live API verification | A/B → E | "Does this API actually work like the docs say?" |
| 17 | Toolbox asset + docs | E → A/B | "Add a door/tree/NPC model to my game" |
| 18 | Guided script creation | A-D → E | "Create a script that does X" |
| 19 | AI asset generation | E → A | "Generate a custom rock/weapon mesh" |
| 20 | Interactive playtest | E → A-D | "Test this feature / walk me through it" |
| 21 | Deep Luau type system | I → C | "How does Luau's type system handle X?" |
| 22 | Breaking change investigation | J → G → A → E | "Something broke after the Roblox update" |
| 23 | Service health triage | K → A-E | "DataStore/HTTP/joins are failing — is it me or Roblox?" |

## Important Notes

- The API dump is the **source of truth** for types, signatures, defaults, and enum values. Do not guess these.
- Context7 is the **preferred enrichment source** over WebFetch — it returns clean, pre-processed content instead of raw HTML.
- If a project has local docs (e.g., `docs/roblox-api/`), check those first — they may contain curated, project-specific context.
- Always wrap yielding Roblox API calls (`Async` suffix) in `pcall()` when writing Luau code.
- `GetProductInfo` is deprecated — prefer `GetProductInfoAsync`. Same for `GetHumanoidDescriptionFromUserId` → use the `Async` variant.
- You can call Context7 queries **in parallel** with API dump lookups to save time.
- Limit Context7 calls to **3 per question** — plan your queries to cover what you need efficiently.

— Upgraded by Claude Opus
