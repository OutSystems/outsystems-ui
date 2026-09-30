#!/usr/bin/env node
// @ts-check
/**
 * Builds the dashboard page: `dashboard/index.html` (the template, versioned) with `results/dashboard.json`
 * embedded as its snapshot, written to `results/dashboard.html` (not versioned). The page renders the
 * embedded snapshot and refreshes from the artifact database when it is published as an artifact.
 *
 *   node evals/tools/dashboard-page.mjs [--check]
 *
 * `--check` renders the built page in a minimal document stub and fails when the script throws or leaves
 * a section empty, so a data-set change that breaks the page is caught before publishing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import { insideDir } from '../lib/paths.mjs';

export const TEMPLATE_FILE = 'dashboard/index.html';
export const PAGE_FILE = 'results/dashboard.html';
export const PLACEHOLDER = '__DASHBOARD_DATA__';

/**
 * The page HTML with the data set embedded. `<` is escaped inside the JSON so no `</script>` can end the
 * data block early.
 * @param {string} evalsDir
 */
export function buildDashboardPage(evalsDir) {
	const template = fs.readFileSync(insideDir(evalsDir, TEMPLATE_FILE), 'utf8');
	if (!template.includes(PLACEHOLDER)) throw new Error(`${TEMPLATE_FILE} has no ${PLACEHOLDER} placeholder`);
	const data = fs.readFileSync(insideDir(evalsDir, 'results', 'dashboard.json'), 'utf8').trim();
	return template.replace(PLACEHOLDER, data.replace(/</g, '\\u003c'));
}

/**
 * A document stub with just enough surface for the page script: elements by id or selector, innerHTML and
 * textContent, class and attribute setters, no-op listeners. Sections the script fills are readable back.
 * @param {string} dataJson the embedded data set
 */
export function createDocumentStub(dataJson) {
	/** @type {Map<string, any>} */
	const byId = new Map();
	/** @param {string} [id] */
	function element(id) {
		/** @type {any} */
		const el = {
			id,
			innerHTML: '',
			textContent: id === 'data' ? dataJson : '',
			className: '',
			hidden: false,
			disabled: false,
			title: '',
			value: '',
			checked: false,
			open: false,
			dataset: {},
			style: {},
			classList: {
				toggle() {},
				add() {},
				remove() {},
				contains() {
					return false;
				},
			},
			setAttribute() {},
			getAttribute() {
				return null;
			},
			addEventListener() {},
			querySelector() {
				return element();
			},
			querySelectorAll() {
				return [];
			},
			getBoundingClientRect() {
				return { left: 0, top: 0, width: 960, height: 260 };
			},
		};
		return el;
	}
	const document = {
		/** @param {string} id */
		getElementById(id) {
			if (!byId.has(id)) byId.set(id, element(id));
			return byId.get(id);
		},
		/** @param {string} selector */
		querySelector(selector) {
			const m = /^#([\w-]+)(?:\s+(\w+))?$/.exec(selector);
			if (!m) return element();
			const host = document.getElementById(m[1]);
			if (!m[2]) return host;
			const key = `${m[1]} ${m[2]}`;
			if (!byId.has(key)) byId.set(key, element(key));
			return byId.get(key);
		},
		querySelectorAll() {
			return [];
		},
		filled: () =>
			[...byId.entries()]
				.filter(([, el]) => el.innerHTML.length > 0 || (el.id !== 'data' && el.textContent.length > 0))
				.map(([k]) => k),
	};
	return document;
}

/**
 * Run the page script against the stub. Returns the ids the script filled; throws when the script does.
 * @param {string} html the built page
 */
export function renderCheck(html) {
	const dataMatch = /<script id="data" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
	const scriptMatch = /<script>([\s\S]*?)<\/script>\s*$/.exec(html.trim());
	if (!dataMatch || !scriptMatch) throw new Error('the page needs a data block and a trailing script block');
	const document = createDocumentStub(dataMatch[1]);
	const context = vm.createContext({
		document,
		window: {},
		localStorage: {
			getItem() {
				return null;
			},
			setItem() {},
		},
		console,
	});
	vm.runInContext(scriptMatch[1], context, { filename: 'dashboard.js' });
	return document.filled();
}

/** Sections the page must fill for any data set. */
export const REQUIRED_SECTIONS = ['meta', 'strip', 'trend', 'multiples', 'evals tbody', 'heat tbody', 'findings'];

/**
 * @param {string} evalsDir
 */
export function writeDashboardPage(evalsDir) {
	const html = buildDashboardPage(evalsDir);
	const file = insideDir(evalsDir, PAGE_FILE);
	fs.writeFileSync(file, html);
	return { file, html };
}

function main() {
	const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
	const { file, html } = writeDashboardPage(evalsDir);
	process.stdout.write(`wrote ${path.relative(process.cwd(), file)} (${html.length} bytes)\n`);
	if (process.argv.includes('--check')) {
		const filled = renderCheck(html);
		const missing = REQUIRED_SECTIONS.filter((s) => !filled.includes(s));
		if (missing.length) {
			console.error(`render check: empty sections: ${missing.join(', ')}`);
			process.exitCode = 1;
		} else {
			process.stdout.write(`render check: ${filled.length} sections filled\n`);
		}
	}
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
