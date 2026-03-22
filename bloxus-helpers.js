// bloxus-helpers.js — Shared helper for Bloxus API Dump scripts
// Resolves the cache path and loads the parsed API dump JSON.

const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'bloxus-cache');
const DUMP_PATH = path.join(CACHE_DIR, 'Full-API-Dump.json');

function loadDump(file) {
  const p = file ? path.join(CACHE_DIR, file) : DUMP_PATH;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

module.exports = { loadDump, CACHE_DIR, DUMP_PATH };
