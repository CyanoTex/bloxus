#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const DUMP_URL =
  "https://raw.githubusercontent.com/MaximumADHD/Roblox-Client-Tracker/roblox/Full-API-Dump.json";
const DEFAULT_MAX_AGE_DAYS = 7;
const CACHE_DIR = path.join(os.homedir(), ".claude", "bloxus-cache");
const CURRENT_DUMP_PATH = path.join(CACHE_DIR, "Full-API-Dump.json");
const PREVIOUS_DUMP_PATH = path.join(CACHE_DIR, "Full-API-Dump-prev.json");

function usage() {
  console.log(`Usage:
  node scripts/api-dump.js fetch [--force] [--max-age-days N]
  node scripts/api-dump.js class <ClassName> [--inherited] [--file PATH]
  node scripts/api-dump.js enum <EnumName> [--file PATH]
  node scripts/api-dump.js search <Query> [--file PATH]
  node scripts/api-dump.js members <MemberName> [--type Property|Function|Event|Callback] [--file PATH]
  node scripts/api-dump.js diff <oldDumpPath> [newDumpPath]
  node scripts/api-dump.js help`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseNamedArgs(args) {
  const options = {};
  const positional = [];

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }

    const key = value.slice(2);
    const next = args[index + 1];
    if (next && !next.startsWith("--")) {
      options[key] = next;
      index += 1;
    } else {
      options[key] = true;
    }
  }

  return { options, positional };
}

function formatValue(value) {
  if (value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
}

function formatType(typeInfo) {
  if (!typeInfo) {
    return "unknown";
  }

  if (Array.isArray(typeInfo)) {
    return `[${typeInfo.map((item) => formatType(item)).join(", ")}]`;
  }

  if (typeof typeInfo === "string") {
    return typeInfo;
  }

  if (typeof typeInfo === "object" && typeof typeInfo.Name === "string") {
    return typeInfo.Name;
  }

  return JSON.stringify(typeInfo);
}

function formatParameters(parameters) {
  return (parameters || [])
    .map((parameter) => `${parameter.Name}: ${formatType(parameter.Type)}`)
    .join(", ");
}

function formatTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return "";
  }

  const stringTags = tags.filter((tag) => typeof tag === "string");
  if (stringTags.length === 0) {
    return "";
  }

  return ` [${stringTags.join(", ")}]`;
}

function formatSecurity(security) {
  if (!security) {
    return "";
  }

  if (typeof security === "string") {
    return ` {security: ${security}}`;
  }

  const read = security.Read || "None";
  const write = security.Write || "None";
  return ` {security: read=${read}, write=${write}}`;
}

function formatMember(member) {
  const tags = formatTags(member.Tags);
  const security = formatSecurity(member.Security);

  if (member.MemberType === "Property") {
    const defaultValue = formatValue(member.Default);
    const defaultSuffix = defaultValue === null ? "" : ` = ${defaultValue}`;
    return `- ${member.Name}: ${formatType(member.ValueType)}${defaultSuffix}${tags}${security}`;
  }

  const parameters = formatParameters(member.Parameters);
  const signature = `(${parameters})`;

  if (member.MemberType === "Function") {
    return `- ${member.Name}${signature}: ${formatType(member.ReturnType)}${tags}${security}`;
  }

  return `- ${member.Name}${signature}${tags}${security}`;
}

function resolveDumpPath(filePath) {
  if (!filePath) {
    return CURRENT_DUMP_PATH;
  }

  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  const cacheCandidate = path.join(CACHE_DIR, filePath);
  if (fs.existsSync(cacheCandidate)) {
    return cacheCandidate;
  }

  return path.resolve(process.cwd(), filePath);
}

function loadDump(filePath) {
  const resolvedPath = resolveDumpPath(filePath);

  if (!fs.existsSync(resolvedPath)) {
    fail(`API dump not found at ${resolvedPath}. Run "node scripts/api-dump.js fetch" first or pass --file PATH.`);
  }

  return JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
}

function buildClassMap(data) {
  return new Map((data.Classes || []).map((item) => [item.Name, item]));
}

function findClass(data, className) {
  return (data.Classes || []).find(
    (item) => item.Name.toLowerCase() === className.toLowerCase(),
  );
}

function findEnum(data, enumName) {
  return (data.Enums || []).find(
    (item) => item.Name.toLowerCase() === enumName.toLowerCase(),
  );
}

function collectMembers(classMap, classInfo, includeInherited) {
  if (!includeInherited) {
    return (classInfo.Members || []).map((member) => ({ ...member, source: classInfo.Name }));
  }

  const collected = [];
  const seen = new Set();
  let current = classInfo;

  while (current) {
    for (const member of current.Members || []) {
      const key = `${member.MemberType}:${member.Name}`;
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      collected.push({ ...member, source: current.Name });
    }

    current = current.Superclass ? classMap.get(current.Superclass) : null;
  }

  return collected;
}

function printClass(data, className, options) {
  const classInfo = findClass(data, className);
  if (!classInfo) {
    fail(`Class not found: ${className}`);
  }

  const classMap = buildClassMap(data);
  const members = collectMembers(classMap, classInfo, Boolean(options.inherited));
  const groups = new Map();

  for (const member of members) {
    if (!groups.has(member.MemberType)) {
      groups.set(member.MemberType, []);
    }

    groups.get(member.MemberType).push(member);
  }

  console.log(`# ${classInfo.Name}`);
  console.log(`Superclass: ${classInfo.Superclass || "None"}`);
  if (Array.isArray(classInfo.Tags) && classInfo.Tags.length > 0) {
    console.log(`Tags: ${classInfo.Tags.join(", ")}`);
  }
  if (options.inherited) {
    console.log("Members include inherited entries.");
  }
  console.log("");

  for (const type of ["Property", "Function", "Event", "Callback"]) {
    const items = groups.get(type) || [];
    if (items.length === 0) {
      continue;
    }

    const heading =
      type === "Function" ? "Methods" : type === "Property" ? "Properties" : `${type}s`;
    console.log(`## ${heading}`);
    console.log("");

    for (const member of items) {
      const suffix = member.source === classInfo.Name ? "" : ` (from ${member.source})`;
      console.log(`${formatMember(member)}${suffix}`);
    }

    console.log("");
  }
}

function printEnum(data, enumName) {
  const enumInfo = findEnum(data, enumName);
  if (!enumInfo) {
    fail(`Enum not found: ${enumName}`);
  }

  console.log(`# Enum.${enumInfo.Name}`);
  console.log("");
  for (const item of enumInfo.Items || []) {
    const legacyNames = Array.isArray(item.LegacyNames) && item.LegacyNames.length > 0
      ? ` (legacy: ${item.LegacyNames.join(", ")})`
      : "";
    console.log(`- ${item.Name} = ${item.Value}${legacyNames}`);
  }
}

function searchDump(data, query) {
  const normalized = query.toLowerCase();
  const classes = (data.Classes || [])
    .filter((item) => item.Name.toLowerCase().includes(normalized))
    .map((item) => item.Name);
  const enums = (data.Enums || [])
    .filter((item) => item.Name.toLowerCase().includes(normalized))
    .map((item) => item.Name);

  console.log(`# Search: ${query}`);
  console.log("");
  console.log(`Classes (${classes.length})`);
  for (const item of classes.slice(0, 50)) {
    console.log(`- ${item}`);
  }
  if (classes.length > 50) {
    console.log(`- ... and ${classes.length - 50} more`);
  }
  console.log("");
  console.log(`Enums (${enums.length})`);
  for (const item of enums.slice(0, 50)) {
    console.log(`- ${item}`);
  }
  if (enums.length > 50) {
    console.log(`- ... and ${enums.length - 50} more`);
  }
}

function searchMembers(data, memberName, typeFilter) {
  const normalized = memberName.toLowerCase();
  const results = [];

  for (const classInfo of data.Classes || []) {
    for (const member of classInfo.Members || []) {
      if (!member.Name.toLowerCase().includes(normalized)) {
        continue;
      }

      if (typeFilter && member.MemberType !== typeFilter) {
        continue;
      }

      results.push({
        className: classInfo.Name,
        member,
      });
    }
  }

  console.log(`# Members matching: ${memberName}`);
  console.log("");

  if (results.length === 0) {
    console.log("No matches found.");
    return;
  }

  for (const result of results.slice(0, 100)) {
    console.log(`- ${result.className}.${result.member.Name} [${result.member.MemberType}]`);
  }

  if (results.length > 100) {
    console.log(`- ... and ${results.length - 100} more`);
  }
}

function diffDumps(oldData, newData) {
  const oldClasses = new Map((oldData.Classes || []).map((item) => [item.Name, item]));
  const newClasses = new Map((newData.Classes || []).map((item) => [item.Name, item]));
  const oldEnums = new Map((oldData.Enums || []).map((item) => [item.Name, item]));
  const newEnums = new Map((newData.Enums || []).map((item) => [item.Name, item]));

  const addedClasses = [...newClasses.keys()].filter((name) => !oldClasses.has(name));
  const removedClasses = [...oldClasses.keys()].filter((name) => !newClasses.has(name));
  const addedEnums = [...newEnums.keys()].filter((name) => !oldEnums.has(name));
  const removedEnums = [...oldEnums.keys()].filter((name) => !newEnums.has(name));
  const memberChanges = [];

  for (const [className, newClass] of newClasses.entries()) {
    const oldClass = oldClasses.get(className);
    if (!oldClass) {
      continue;
    }

    const oldMembers = new Set(
      (oldClass.Members || []).map((member) => `${member.MemberType}:${member.Name}`),
    );
    const newMembers = new Set(
      (newClass.Members || []).map((member) => `${member.MemberType}:${member.Name}`),
    );

    for (const member of newClass.Members || []) {
      const key = `${member.MemberType}:${member.Name}`;
      if (!oldMembers.has(key)) {
        memberChanges.push(`+ ${className}.${member.Name} [${member.MemberType}]`);
      }
    }

    for (const member of oldClass.Members || []) {
      const key = `${member.MemberType}:${member.Name}`;
      if (!newMembers.has(key)) {
        memberChanges.push(`- ${className}.${member.Name} [${member.MemberType}]`);
      }
    }
  }

  const sections = [
    ["Added Classes", addedClasses.map((item) => `+ ${item}`)],
    ["Removed Classes", removedClasses.map((item) => `- ${item}`)],
    ["Added Enums", addedEnums.map((item) => `+ ${item}`)],
    ["Removed Enums", removedEnums.map((item) => `- ${item}`)],
    ["Member Changes", memberChanges],
  ];

  let printedAnything = false;
  for (const [title, lines] of sections) {
    if (lines.length === 0) {
      continue;
    }

    printedAnything = true;
    console.log(`## ${title}`);
    console.log("");
    for (const line of lines.slice(0, 200)) {
      console.log(line);
    }
    if (lines.length > 200) {
      console.log(`... and ${lines.length - 200} more`);
    }
    console.log("");
  }

  if (!printedAnything) {
    console.log("No differences found.");
  }
}

async function fetchDump(options) {
  const force = Boolean(options.force);
  const maxAgeDays = Number(options["max-age-days"] || DEFAULT_MAX_AGE_DAYS);

  if (!Number.isFinite(maxAgeDays) || maxAgeDays < 0) {
    fail("max-age-days must be a non-negative number.");
  }

  await fsp.mkdir(CACHE_DIR, { recursive: true });

  if (!force && fs.existsSync(CURRENT_DUMP_PATH)) {
    const stats = await fsp.stat(CURRENT_DUMP_PATH);
    const ageMs = Date.now() - stats.mtimeMs;
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    if (ageMs <= maxAgeMs) {
      console.log(`Using cached dump: ${CURRENT_DUMP_PATH}`);
      return;
    }
  }

  if (fs.existsSync(CURRENT_DUMP_PATH)) {
    await fsp.copyFile(CURRENT_DUMP_PATH, PREVIOUS_DUMP_PATH);
  }

  // Fetch from Roblox-Client-Tracker (MIT License)
  const response = await fetch(DUMP_URL);
  if (!response.ok) {
    fail(`Failed to download API dump: ${response.status} ${response.statusText}`);
  }

  const body = await response.text();
  JSON.parse(body);
  await fsp.writeFile(CURRENT_DUMP_PATH, body, "utf8");
  console.log(`Saved API dump to ${CURRENT_DUMP_PATH}`);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help") {
    usage();
    return;
  }

  const { options, positional } = parseNamedArgs(rest);

  switch (command) {
    case "fetch":
      await fetchDump(options);
      return;

    case "class": {
      const [className] = positional;
      if (!className) {
        fail("class requires a class name.");
      }
      const data = loadDump(options.file);
      printClass(data, className, options);
      return;
    }

    case "enum": {
      const [enumName] = positional;
      if (!enumName) {
        fail("enum requires an enum name.");
      }
      const data = loadDump(options.file);
      printEnum(data, enumName);
      return;
    }

    case "search": {
      const [query] = positional;
      if (!query) {
        fail("search requires a query.");
      }
      const data = loadDump(options.file);
      searchDump(data, query);
      return;
    }

    case "members": {
      const [memberName] = positional;
      if (!memberName) {
        fail("members requires a member name.");
      }
      const data = loadDump(options.file);
      searchMembers(data, memberName, options.type);
      return;
    }

    case "diff": {
      const [oldDumpPath, newDumpPath] = positional;
      if (!oldDumpPath) {
        const oldData = loadDump(PREVIOUS_DUMP_PATH);
        const newData = loadDump(newDumpPath);
        diffDumps(oldData, newData);
        return;
      }
      const oldData = loadDump(oldDumpPath);
      const newData = loadDump(newDumpPath);
      diffDumps(oldData, newData);
      return;
    }

    default:
      fail(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  fail(error instanceof Error ? error.stack || error.message : String(error));
});
