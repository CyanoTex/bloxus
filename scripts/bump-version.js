#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  path.join(root, '.claude-plugin', 'plugin.json'),
  path.join(root, '.claude-plugin', 'marketplace.json'),
];

const pluginData = JSON.parse(fs.readFileSync(files[0], 'utf8'));
const current = pluginData.version;
const [major, minor, patch] = current.split('.').map(Number);
const next = `${major}.${minor}.${patch + 1}`;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, content.replace(`"version": "${current}"`, `"version": "${next}"`));
}

console.log(`${current} → ${next}`);
