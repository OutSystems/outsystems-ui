#!/usr/bin/env node
// @ts-check
/**
 * Builds the dashboard page: `dashboard/index.html` (the template) with `dashboard/dashboard.mjs` (the page
 * logic) and `results/dashboard.json` (the data set) inlined, written to `results/dashboard.html`, which is
 * not versioned. The page renders the embedded snapshot and refreshes from the artifact database when it is
 * published as an artifact.
 *
 *   node evals/tools/dashboard-page.mjs [--check]
 *
 * `--check` mounts the page module on a minimal document stub with the committed data set and fails when
 * the module throws or leaves a section empty, so a data-set change that breaks the page is caught before
 * publishing. The module is imported, never extracted from the built page or evaluated as text.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { insideDir } from '../lib/paths.mjs';

export const TEMPLATE_FILE = 'dashboard/index.html';
export const MODULE_FILE = 'dashboard/dashboard.mjs';
export const PAGE_FILE = 'results/dashboard.html';
export const PLACEHOLDER = '/*__DASHBOARD_SCRIPT__*/';
const EXPORT_LINE = 'export function mount(';

/** Sections the page must fill for any data set. */
export const REQUIRED_SECTIONS = ['meta', 'strip', 'trend', 'multiples', 'evals tbody', 'heat tbody', 'findings'];

/** @param {string} evalsDir */
function readDataSet(evalsDir) {
	return fs.readFileSync(insideDir(evalsDir, 'results', 'dashboard.json'), 'utf8').trim();
}

/**
 * The page HTML with the module and the data set inlined. The module's export keyword is dropped so the
 * function is a plain script declaration; `<` is escaped inside the JSON so no `</script>` can end the
 * script block early.
 * @param {string} evalsDir
 */
export function buildDashboardPage(evalsDir) {
	const template = fs.readFileSync(insideDir(evalsDir, TEMPLATE_FILE), 'utf8');
	if (!template.includes(PLACEHOLDER)) throw new Error(`${TEMPLATE_FILE} has no ${PLACEHOLDER} placeholder`);
	const source = fs.readFileSync(insideDir(evalsDir, MODULE_FILE), 'utf8');
	if (!source.includes(EXPORT_LINE)) throw new Error(`${MODULE_FILE} must export mount()`);
	const script = [
		source.replace(EXPORT_LINE, 'function mount('),
		`mount(document, window, localStorage, ${readDataSet(evalsDir).replace(/</g, String.raw`\u003c`)});`,
	].join('\n');
	return template.replace(PLACEHOLDER, script);
}

/** One element of the document stub. @param {string} [id] */
function element(id) {
	/** @type {any} */
	const el = {
		id,
		innerHTML: '',
		textContent: '',
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

/**
 * A document stub with just enough surface for the page module: elements by id or selector, innerHTML and
 * textContent, class and attribute setters, no-op listeners. Sections the module fills are readable back.
 */
export function createDocumentStub() {
	/** @type {Map<string, any>} */
	const byId = new Map();
	const document = {
		/** @param {string} id */
		getElementById(id) {
			if (!byId.has(id)) byId.set(id, element(id));
			return byId.get(id);
		},
		/** `#id` or `#id tag`, the two forms the module uses. @param {string} selector */
		querySelector(selector) {
			const [head, tag] = selector.split(' ');
			if (!head.startsWith('#')) return element();
			const host = document.getElementById(head.slice(1));
			if (!tag) return host;
			const key = `${head.slice(1)} ${tag}`;
			if (!byId.has(key)) byId.set(key, element(key));
			return byId.get(key);
		},
		querySelectorAll() {
			return [];
		},
		filled: () =>
			[...byId.entries()]
				.filter(([, el]) => el.innerHTML.length > 0 || el.textContent.length > 0)
				.map(([k]) => k),
	};
	return document;
}

/**
 * Mount the page module on a document stub with a data set (the committed one by default). Returns the
 * ids the module filled; throws when the module does.
 * @param {string} evalsDir
 * @param {any} [data]
 */
export async function renderCheck(evalsDir, data) {
	const { mount } = await import(pathToFileURL(insideDir(evalsDir, MODULE_FILE)).href);
	const document = createDocumentStub();
	const storage = {
		getItem() {
			return null;
		},
		setItem() {},
	};
	mount(document, {}, storage, data ?? JSON.parse(readDataSet(evalsDir)));
	return document.filled();
}

/**
 * @param {string} evalsDir
 */
export function writeDashboardPage(evalsDir) {
	const html = buildDashboardPage(evalsDir);
	const file = insideDir(evalsDir, PAGE_FILE);
	fs.writeFileSync(file, html);
	return { file, html };
}

async function main() {
	const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
	const { file, html } = writeDashboardPage(evalsDir);
	process.stdout.write(`wrote ${path.relative(process.cwd(), file)} (${html.length} bytes)\n`);
	if (process.argv.includes('--check')) {
		const filled = await renderCheck(evalsDir);
		const missing = REQUIRED_SECTIONS.filter((s) => !filled.includes(s));
		if (missing.length) {
			console.error(`render check: empty sections: ${missing.join(', ')}`);
			process.exitCode = 1;
		} else {
			process.stdout.write(`render check: ${filled.length} sections filled\n`);
		}
	}
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
