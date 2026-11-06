#!/usr/bin/env node
// @ts-check
/**
 * Fails (exit 1) when the installed `outsystems-design-tokens` is not the version pinned in package.json.
 *
 * `build:tokens` generates `src/scss/tokens/` from whatever sits in node_modules, never from the pin. After a
 * pull or a branch switch without `npm i`, the build would otherwise succeed and compile the old tokens into
 * `dist/*.css` with no trace of it. Runs first in `build:tokens`, so every `dev` and `build` goes through it.
 *
 * It fails rather than installing: the fix is `npm i`, and a build that reaches the network is a surprise
 * (ROU-13169, decision 1). No dependencies, no network.
 *
 *   node scripts/check-tokens-version.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = 'outsystems-design-tokens';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** @param {string} message */
function fail(message) {
	console.error(`\n⛔️ ${PACKAGE}: ${message}\n`);
	process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const pinned = manifest.devDependencies?.[PACKAGE] ?? manifest.dependencies?.[PACKAGE];

if (pinned === undefined) fail('not declared in package.json.');
// The lockfile is gitignored (ADR-0007), so the exact pin is the only thing tying a build to a tokens release.
// A range would let two machines install different versions while both pass this check.
if (/^\d+\.\d+\.\d+$/.test(pinned) === false)
	fail(`package.json must pin an exact version (found "${pinned}"). Remove the range prefix.`);

const installedManifest = path.join(root, 'node_modules', PACKAGE, 'package.json');
if (fs.existsSync(installedManifest) === false) fail(`not installed; package.json pins ${pinned}. Run \`npm i\`.`);

const installed = JSON.parse(fs.readFileSync(installedManifest, 'utf8')).version;
if (installed !== pinned) fail(`installed ${installed}, package.json pins ${pinned}. Run \`npm i\`.`);

console.log(`✔ ${PACKAGE} ${installed} matches the pin in package.json.`);
