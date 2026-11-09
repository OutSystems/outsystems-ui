#!/usr/bin/env node
// @ts-check
/**
 * CI drift gate for committed generated files (ROU-13182). Fails (exit 1) when any of them is stale.
 *
 *   npm run docs:check
 *
 * Every generated file is hashed, then everything that writes one runs into the working tree, then the files are
 * hashed again: any file that changed or appeared was stale. In order:
 *  1. Snapshot, before anything runs. It has to come before the build, because the build rewrites the SCSS
 *     entry files: taken after it, both snapshots would hold the repaired files and a stale commit would pass.
 *  2. The production build (`build:osui`): the SCSS entry files, and the `dist/` the migration page reads.
 *  3. The per-script checks that already exist (`docs:migration -- --check`, `docs:migration-page -- --check`,
 *     `docs:ai:check`). They write nothing and name the exact entry that drifted, which is what you want to read
 *     in a CI log. Their failures are collected, not fatal on their own. `docs:ai:check` also reports obsolete
 *     files (no longer generated), which a snapshot cannot see.
 *  4. The whole generation chain (`docs:generate`), which covers the generators that have no `--check` of their
 *     own (`docs:tokens`, `docs:css-api`, `docs:ai:types`), then the second snapshot.
 *
 * Comparing with the files on disk, not with git, means a local `docs:regen` followed by `docs:check` passes
 * before the commit; in CI the checkout is the commit, so it is the same comparison. It leaves the regenerated
 * files in place: locally that is the fix, in CI the checkout is thrown away.
 *
 * The fix it suggests is always the same: `npm run docs:regen`, then commit.
 */
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Every committed path the build or a generator writes. Keep in sync with `docs:generate` in package.json. */
const GENERATED_PATHS = [
	'THEME-MIGRATION-GUIDE.md',
	'docs-ai',
	'src/scripts/OutSystems/OSUI/Patterns/PatternTypes.ts',
	'src/scss/O11.OutSystemsUI.scss',
	'src/scss/ODC.OutSystemsUI.scss',
	'stories/CssApiReference.mdx',
	'stories/_helpers/css-api-manifest.ts',
	'stories/_helpers/migration-data.ts',
	'stories/_helpers/token-data',
];

const PER_SCRIPT_CHECKS = [
	['docs:migration', '--', '--check'],
	['docs:migration-page', '--', '--check'],
	['docs:ai:check'],
];

/**
 * Content hash of every file under the generated paths, keyed by repo-relative path.
 * @returns {Map<string, string>}
 */
function snapshot() {
	/** @type {Map<string, string>} */
	const hashes = new Map();
	/** @param {string} rel */
	const visit = (rel) => {
		const abs = path.join(root, rel);
		if (!fs.existsSync(abs)) return;
		if (fs.statSync(abs).isDirectory()) {
			for (const entry of fs.readdirSync(abs).sort()) visit(path.posix.join(rel, entry));
		} else {
			// CRLF → LF: a Windows checkout with core.autocrlf may hold CRLF (`.md`, `.mdx`, `.txt` are not pinned
			// to LF in .gitattributes), the generators write LF, and git normalizes both to the same commit.
			const content = fs.readFileSync(abs, 'utf8').replaceAll('\r\n', '\n');
			hashes.set(rel, crypto.createHash('sha256').update(content).digest('hex'));
		}
	};
	GENERATED_PATHS.forEach(visit);
	return hashes;
}

/**
 * @param {string} command
 * @param {string[]} args
 */
function run(command, args) {
	return spawnSync(command, args, { cwd: root, shell: process.platform === 'win32', stdio: 'inherit' });
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

/**
 * Runs an npm script and exits when it fails.
 * @param {string} script
 */
function runOrExit(script) {
	if (run(npm, ['run', '--silent', script]).status !== 0) {
		console.error(`\n⛔️ \`npm run ${script}\` failed; see the output above.\n`);
		process.exit(1);
	}
}

const before = snapshot();

console.log('\n── 1/3 Production build ────────────────────────────────────────────────');
runOrExit('build:osui');

console.log('\n── 2/3 Per-script drift checks ─────────────────────────────────────────');
const failedChecks = PER_SCRIPT_CHECKS.filter((args) => run(npm, ['run', '--silent', ...args]).status !== 0).map(
	(args) => args[0]
);

console.log('\n── 3/3 Regenerate everything and compare ───────────────────────────────');
runOrExit('docs:generate');

const after = snapshot();
const drifted = [...after.keys()]
	.filter((file) => before.get(file) !== after.get(file))
	.map((file) => `${before.has(file) ? 'changed' : 'new    '} ${file}`);

if (drifted.length === 0 && failedChecks.length === 0) {
	console.log('\n✔ Every committed generated file is up to date.\n');
	process.exit(0);
}

console.error('\n⛔️ Committed generated files are stale.');
if (failedChecks.length > 0) console.error(`   Failed checks: ${failedChecks.join(', ')}`);
if (drifted.length > 0) {
	console.error('   Changed after regeneration:');
	for (const line of drifted) console.error(`     ${line}`);
	if (process.env.CI) run('git', ['--no-pager', 'diff', '--', ...GENERATED_PATHS]);
}
console.error('\n   Fix: run `npm run docs:regen`, delete any file reported as obsolete, and commit the result.\n');
process.exit(1);
