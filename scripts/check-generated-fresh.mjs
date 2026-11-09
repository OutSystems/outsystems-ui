#!/usr/bin/env node
// @ts-check
/**
 * CI drift gate for committed generated files (ROU-13182). Fails (exit 1) when any of them is stale.
 *
 *   npm run build && npm run docs:check
 *
 * Two passes:
 *  1. The per-script checks that already exist (`docs:migration -- --check`, `docs:migration-page -- --check`,
 *     `docs:ai:check`). They write nothing and name the exact entry that drifted, which is what you want to read
 *     in a CI log. Their failures are collected, not fatal on their own.
 *  2. The whole generation chain (`docs:generate`) runs into the working tree, and every generated file is
 *     hashed before and after: any file that changed or appeared was stale. This covers the generators that have
 *     no `--check` of their own (`docs:tokens`, `docs:css-api`, `docs:ai:types`). Comparing with the files on
 *     disk, not with git HEAD, means a local `docs:regen` followed by `docs:check` passes before the commit; in CI
 *     the checkout is the commit, so it is the same comparison. Obsolete files (no longer generated) are reported
 *     by `docs:ai:check` in pass 1.
 *  3. The SCSS entry files are written by the build itself, which has already run, so pass 2 cannot see them
 *     drift: both snapshots hold the rewritten files. They are compared with the git index instead (`git diff`),
 *     which in CI is the commit and locally passes once the regenerated files are staged.
 *
 * Needs a fresh `dist/` (the migration page reads the compiled CSS), so it runs after the build. It leaves the
 * regenerated files in place: locally that is the fix, in CI the checkout is thrown away.
 *
 * The fix it suggests is always the same: `npm run docs:regen`, then commit.
 */
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Every committed path a generator writes. Keep in sync with `docs:generate` in package.json. */
const GENERATED_PATHS = [
	'THEME-MIGRATION-GUIDE.md',
	'docs-ai',
	'src/scripts/OutSystems/OSUI/Patterns/PatternTypes.ts',
	'stories/CssApiReference.mdx',
	'stories/_helpers/css-api-manifest.ts',
	'stories/_helpers/migration-data.ts',
	'stories/_helpers/token-data',
];

/** Committed files the build writes (`gulp createProduction`), so they are fresh before this script starts. */
const BUILD_WRITTEN_PATHS = ['src/scss/O11.OutSystemsUI.scss', 'src/scss/ODC.OutSystemsUI.scss'];

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
			hashes.set(rel, crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex'));
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

if (['O11', 'ODC'].some((platform) => !fs.existsSync(path.join(root, 'dist', `${platform}.OutSystemsUI.css`)))) {
	console.error('\n⛔️ dist/ has no production build. Run `npm run build` (or `npm run docs:regen`) first.\n');
	process.exit(1);
}

console.log('\n── 1/3 Per-script drift checks ─────────────────────────────────────────');
const failedChecks = PER_SCRIPT_CHECKS.filter((args) => run(npm, ['run', '--silent', ...args]).status !== 0).map(
	(args) => args[0]
);

console.log('\n── 2/3 Regenerate everything and compare with the commit ──────────────');
const before = snapshot();
const generate = run(npm, ['run', '--silent', 'docs:generate']);
if (generate.status !== 0) {
	console.error('\n⛔️ `npm run docs:generate` failed; see the output above.\n');
	process.exit(1);
}

const after = snapshot();
const drifted = [...after.keys()]
	.filter((file) => before.get(file) !== after.get(file))
	.map((file) => `${before.has(file) ? 'changed' : 'new    '} ${file}`);

console.log('\n── 3/3 Compare the SCSS entry files the build wrote with git ───────────');
const gitDiff = spawnSync('git', ['diff', '--name-only', '--', ...BUILD_WRITTEN_PATHS], {
	cwd: root,
	encoding: 'utf8',
});
if (gitDiff.status !== 0) {
	console.error(
		'\n⛔️ `git diff` failed, so the SCSS entry files could not be checked. Run this from a git checkout.\n'
	);
	process.exit(1);
}
drifted.push(
	...gitDiff.stdout
		.split('\n')
		.filter(Boolean)
		.map((file) => `changed ${file}`)
);

if (drifted.length === 0 && failedChecks.length === 0) {
	console.log('\n✔ Every committed generated file is up to date.\n');
	process.exit(0);
}

console.error('\n⛔️ Committed generated files are stale.');
if (failedChecks.length > 0) console.error(`   Failed checks: ${failedChecks.join(', ')}`);
if (drifted.length > 0) {
	console.error('   Changed after regeneration:');
	for (const line of drifted) console.error(`     ${line}`);
	if (process.env.CI) run('git', ['--no-pager', 'diff', '--', ...GENERATED_PATHS, ...BUILD_WRITTEN_PATHS]);
}
console.error(
	'\n   Fix: run `npm run docs:regen`, delete any file reported as obsolete, and commit (or stage) the result.\n'
);
process.exit(1);
