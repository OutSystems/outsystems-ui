// Run the OutSystems UI component tests against THIS checkout's build.
//
// The Playwright suites live in a separate repository
// (OutSystems/outsystems-ui-tests-new). They navigate real pages on the dev
// environment and swap the platform-served OutSystemsUI js/css with the files
// of a local build via network interception (the tests repo reads the
// OSUI_LOCAL_BUILD env var, pointed here at this repo's root — it expects
// dist/ and classic-theme/ under it).
//
// Usage (from package.json): every permutation of the tests repo is mirrored
// as an npm script here (`npm run test`, `test:classic`, `test:odc:all-browsers`,
// …), each invoking this wrapper with --script <tests repo script name>. The
// wrapper delegates to that script so the env/project logic stays in the tests
// repo. Extra args after -- are forwarded to Playwright:
//   npm run test -- --grep Accordion
//
// Two permutations have no upstream script (current + legacy on all browsers)
// and are composed here directly — see COMPOSED below.
//
// The tests repository is resolved in this order:
//   1. OSUI_TESTS_DIR env var (an existing checkout),
//   2. a sibling checkout ../outsystems-ui-tests-new,
//   3. a clone into .osui-tests/ (git-ignored), updated with git pull on reuse.
//
// Prerequisites: git read access to the private tests repository and network
// access to the dev environment the tests navigate to.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TESTS_REPO_URL = process.env.OSUI_TESTS_REPO_URL || 'https://github.com/OutSystems/outsystems-ui-tests-new.git';

const ALL_BROWSERS = 'chromium,firefox,webkit,msedge';

// Permutations the tests repo does not expose as a script (its `:all` scripts
// pin --project=chromium, which overrides PW_BROWSERS). These run Playwright
// directly in the tests repo with the composing env vars.
const COMPOSED = {
	'test:functional:all:all-browsers': {
		env: { INCLUDE_LEGACY: 'true', PW_BROWSERS: ALL_BROWSERS },
	},
	'test:functional:odc:all:all-browsers': {
		env: { TEST_ENV: 'odc-dev', INCLUDE_LEGACY: 'true', PW_BROWSERS: ALL_BROWSERS },
	},
};

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
	let script = 'test:functional';
	const forward = [];
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--script') {
			script = (argv[++i] || '').trim();
		} else {
			forward.push(argv[i]);
		}
	}
	if (!script) {
		console.error('[run-e2e] --script needs a tests repo script name (e.g. test:functional:odc).');
		process.exit(1);
	}
	return { script, forward };
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

function ensureTestsSetup(testsDir, allBrowsers) {
	if (!existsSync(path.join(testsDir, 'node_modules'))) {
		console.log('[run-e2e] Installing tests repo dependencies…');
		run('npm', ['ci', '--ignore-scripts'], testsDir);
	}
	// No-op when the browsers are already present; downloads them on first run.
	const browsers = allBrowsers ? ['chromium', 'firefox', 'webkit'] : ['chromium'];
	run('npx', ['playwright', 'install', ...browsers], testsDir);
	if (allBrowsers) {
		console.log(
			'[run-e2e] Note: the msedge leg uses the Microsoft Edge installed on this machine (a browser ' +
				'channel, not a Playwright download) — install Edge if that leg fails to launch.'
		);
	}
}

const { script, forward } = parseArgs(process.argv.slice(2));
const testsDir = resolveTestsDir();
console.log(`[run-e2e] Tests repo: ${testsDir}`);

const composed = COMPOSED[script];
if (!composed) {
	const testsScripts = JSON.parse(readFileSync(path.join(testsDir, 'package.json'), 'utf8')).scripts ?? {};
	if (!testsScripts[script]) {
		console.error(`[run-e2e] Script not found in the tests repo: ${script}`);
		console.error(`[run-e2e] Available: ${Object.keys(testsScripts).join(', ')}`);
		process.exit(1);
	}
}

ensureBuild();
ensureTestsSetup(testsDir, script.includes('all-browsers'));

if (/classic|both-themes/.test(script)) {
	console.log(
		'[run-e2e] Note: the _ClassicTheme pages are not published to the base AT_OSUIFunctional module yet; ' +
			'classic runs may fail wholesale until they are (see the note in outsystems-ui-pr-tests.yml).'
	);
}

console.log(`[run-e2e] Running ${script} against this checkout's build…`);
const code = composed
	? run('npx', ['playwright', 'test', 'tests/functional', ...forward], testsDir, {
			env: { ...composed.env, OSUI_LOCAL_BUILD: root },
			soft: true,
		})
	: run('npm', ['run', script, ...(forward.length > 0 ? ['--', ...forward] : [])], testsDir, {
			env: { OSUI_LOCAL_BUILD: root },
			soft: true,
		});

console.log(`\n[run-e2e] HTML report: ${path.join(testsDir, 'playwright-report', 'index.html')}`);
process.exit(code);
