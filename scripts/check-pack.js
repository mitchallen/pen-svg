#!/usr/bin/env node
'use strict';

// Guard against the published tarball leaking files it shouldn't.
//
// Runs `npm pack --dry-run --json`, then asserts that every file in the
// tarball is covered by the "files" allowlist in package.json and that the
// declared entry points are actually present. Exits non-zero (failing CI /
// `make pack-check`) on any mismatch.
//
// The allowlist is derived from package.json rather than hardcoded here, so
// this file is identical across packages and stays correct when "files"
// changes. Anything outside it -- src/, test/, coverage/, stray config --
// fails the check.

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// npm always force-includes these regardless of the `files` allowlist.
const ALWAYS_ALLOWED = /^(package\.json|README(\.[^/]+)?|LICEN[SC]E(\.[^/]+)?|CHANGELOG(\.[^/]+)?)$/i;

if (!Array.isArray(pkg.files) || pkg.files.length === 0) {
  console.error('✗ package.json has no "files" allowlist.');
  console.error('  Add one (e.g. "files": ["dist"]) so the tarball ships an');
  console.error('  allowlist rather than relying on .npmignore/.gitignore.');
  process.exit(1);
}

// The allowlist itself must be sane. Deriving the check from "files" would
// otherwise rubber-stamp an allowlist that has drifted wide open, so reject
// entries that would ship development-only trees or the whole repo.
const SUSPECT = /^(\.|\/|\*|node_modules|test|tests|spec|coverage|examples?|support|doc|docs|\.github|\.vscode|src\/\*\*)$/i;
const suspect = pkg.files.filter((f) => SUSPECT.test(String(f).replace(/^\.\//, '').replace(/\/$/, '')));
if (suspect.length > 0) {
  console.error('✗ Suspicious entr(ies) in the "files" allowlist:');
  for (const s of suspect) console.error(`    ${s}`);
  console.error('  These ship development-only files (or the entire repo) to consumers.');
  console.error('  Narrow "files" to the build output, e.g. "files": ["dist"].');
  process.exit(1);
}

// A "files" entry is treated as a directory prefix when it exists on disk as a
// directory or carries no file extension; otherwise it must match exactly.
const repoRoot = path.join(__dirname, '..');
const allow = pkg.files.map((raw) => {
  const entry = raw.replace(/^\.\//, '').replace(/\/$/, '');
  let isDir = false;
  try {
    isDir = fs.statSync(path.join(repoRoot, entry)).isDirectory();
  } catch {
    isDir = !path.extname(entry);
  }
  return { entry, isDir };
});

const isAllowed = (f) =>
  ALWAYS_ALLOWED.test(f) ||
  allow.some(({ entry, isDir }) => (isDir ? f === entry || f.startsWith(entry + '/') : f === entry));

// Entry points that must always ship.
const required = [];
const add = (v) => {
  if (typeof v === 'string') required.push(v.replace(/^\.\//, ''));
};
add(pkg.main);
add(pkg.module);
if (typeof pkg.browser === 'string') add(pkg.browser);
if (typeof pkg.bin === 'string') add(pkg.bin);
else if (pkg.bin && typeof pkg.bin === 'object') Object.values(pkg.bin).forEach(add);

function packedFiles() {
  const out = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    maxBuffer: 32 * 1024 * 1024,
  });
  // `npm pack --json` returns an array with one entry per packed tarball.
  return JSON.parse(out).flatMap((entry) => entry.files.map((f) => f.path));
}

function main() {
  const files = packedFiles();
  const unexpected = files.filter((f) => !isAllowed(f));
  const missing = [...new Set(required)].filter((r) => !files.includes(r));

  console.log(`Packed ${files.length} file(s):`);
  for (const f of files.slice().sort()) console.log(`  ${f}`);

  if (unexpected.length === 0 && missing.length === 0) {
    console.log(`\n✓ Tarball contents look correct (${pkg.files.join(', ')} + npm metadata).`);
    return;
  }

  if (unexpected.length > 0) {
    console.error(`\n✗ Unexpected file(s) in the tarball (allowlist: ${pkg.files.join(', ')}):`);
    for (const f of unexpected.sort()) console.error(`    ${f}`);
    console.error('  Tighten the "files" allowlist in package.json.');
  }
  if (missing.length > 0) {
    console.error('\n✗ Declared entry point(s) missing from the tarball:');
    for (const f of missing.sort()) console.error(`    ${f}`);
    console.error('  Did the build run? Check the build script / "files" allowlist.');
  }
  process.exit(1);
}

main();
