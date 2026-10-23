// Run the OutSystems UI component tests against THIS checkout's build.
//
// The Playwright suites live in a separate repository
// (OutSystems/outsystems-ui-tests-new). They navigate real pages on the dev
// environment and swap the platform-served OutSystemsUI js/css with the files
// of a local build via network interception (the tests repo reads the
// OSUI_LOCAL_BUILD env var, pointed here at this repo's root — it expects
// dist/ and classic-theme/ under it).
//
// Usage (from package.json):
//   npm run test                    -> new theme   (tests repo: test:functional)
//   npm run test:classic           -> classic theme (tests repo: test:functional:classic)
//   npm run test -- --grep Accordion  -> extra args are forwarded to Playwright
//
// The tests repository is resolved in this order:
//   1. OSUI_TESTS_DIR env var (an existing checkout),
//   2. a sibling checkout ../outsystems-ui-tests-new,
//   3. a clone into .osui-tests/ (git-ignored), updated with git pull on reuse.
//
// Prerequisites: git read access to the private tests repository and network
// access to the dev environment the tests navigate to.

import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TESTS_REPO_URL = process.env.OSUI_TESTS_REPO_URL || 'https://github.com/OutSystems/outsystems-ui-tests-new.git';

/** Run a command inheriting stdio; returns its exit code (fails hard unless opts.soft). */
function run(cmd, args, cwd, { env = {}, soft = false } = {}) {
	const result = spawnSync(cmd, args, {
		cwd,
		stdio: 'inherit',
		env: { ...process.env, ...env },
		shell: process.platform === 'win32',
	});
	const code = result.status ?? 1;
	if (code !== 0 && !soft) {
		console.error(`\n[run-e2e] Command failed (${code}): ${cmd} ${args.join(' ')}`);
		process.exit(code);
	}
	return code;
}

function parseArgs(argv) {
	let theme = 'new';
	const forward = [];
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--theme') {
			theme = (argv[++i] || '').trim().toLowerCase();
		} else {
			forward.push(argv[i]);
		}
	}
	if (theme !== 'new' && theme !== 'classic') {
		console.error(`[run-e2e] Unknown --theme value: ${theme}. Valid: new, classic.`);
		process.exit(1);
	}
	return { theme, forward };
}

function resolveTestsDir() {
	const fromEnv = (process.env.OSUI_TESTS_DIR || '').trim();
	if (fromEnv) {
		const dir = path.resolve(root, fromEnv);
		if (!existsSync(path.join(dir, 'package.json'))) {
			console.error(`[run-e2e] OSUI_TESTS_DIR does not look like the tests repo (no package.json): ${dir}`);
			process.exit(1);
		}
		return dir;
	}

	const sibling = path.resolve(root, '..', 'outsystems-ui-tests-new');
	if (existsSync(path.join(sibling, 'package.json'))) {
		return sibling;
	}

	const clone = path.join(root, '.osui-tests');
	if (existsSync(path.join(clone, 'package.json'))) {
		console.log('[run-e2e] Updating tests repo clone (.osui-tests)…');
		// A failed pull (offline, diverged) is not fatal: run against what is there.
		run('git', ['pull', '--ff-only'], clone, { soft: true });
	} else {
		console.log(`[run-e2e] Cloning ${TESTS_REPO_URL} into .osui-tests/…`);
		console.log('[run-e2e] (requires read access to the private tests repository)');
		run('git', ['clone', '--depth=1', TESTS_REPO_URL, clone], root);
	}
	return clone;
}

/** dist/ is gitignored; build it when any platform bundle is missing. */
function ensureBuild() {
	const bundles = ['O11.OutSystemsUI.js', 'O11.OutSystemsUI.css', 'ODC.OutSystemsUI.js', 'ODC.OutSystemsUI.css'];
	const missing = bundles.filter((file) => !existsSync(path.join(root, 'dist', file)));
	if (missing.length === 0) {
		return;
	}
	console.log(`[run-e2e] Missing dist files (${missing.join(', ')}) — building OutSystems UI…`);
	run('npm', ['run', 'build:osui'], root);
}

function ensureTestsSetup(testsDir) {
	if (!existsSync(path.join(testsDir, 'node_modules'))) {
		console.log('[run-e2e] Installing tests repo dependencies…');
		run('npm', ['ci', '--ignore-scripts'], testsDir);
	}
	// No-op when the browser is already present; downloads it on first run.
	run('npx', ['playwright', 'install', 'chromium'], testsDir);
}

const { theme, forward } = parseArgs(process.argv.slice(2));
const testsDir = resolveTestsDir();
console.log(`[run-e2e] Tests repo: ${testsDir}`);

ensureBuild();
ensureTestsSetup(testsDir);

if (theme === 'classic') {
	console.log(
		'[run-e2e] Note: the _ClassicTheme pages are not published to the base AT_OSUIFunctional module yet; ' +
			'classic runs may fail wholesale until they are (see the note in outsystems-ui-pr-tests.yml).'
	);
}

const script = theme === 'classic' ? 'test:functional:classic' : 'test:functional';
console.log(`[run-e2e] Running ${script} against this checkout's build (THEME=${theme})…`);
const code = run('npm', ['run', script, ...(forward.length > 0 ? ['--', ...forward] : [])], testsDir, {
	env: { OSUI_LOCAL_BUILD: root },
	soft: true,
});

console.log(`\n[run-e2e] HTML report: ${path.join(testsDir, 'playwright-report', 'index.html')}`);
process.exit(code);
