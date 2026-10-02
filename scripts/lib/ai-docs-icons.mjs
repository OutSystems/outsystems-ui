// @ts-check
/**
 * docs-ai/osui.icons.json — the icon class names an agent may write, per icon library, read from the
 * installed font packages. An unknown icon name renders as nothing without an error, so this is an allowlist.
 */
import fs from 'node:fs';

import { insideDir } from '../../evals/lib/paths.mjs';

export const ICON_SOURCES = [
	{
		key: 'phosphor',
		prefix: 'ph-',
		file: 'node_modules/@phosphor-icons/web/src/regular/style.css',
		usage: 'icon ph ph-<name>',
	},
	{
		key: 'fontawesome4',
		prefix: 'fa-',
		file: 'node_modules/font-awesome/css/font-awesome.css',
		usage: 'fa fa-<name>',
	},
];

/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));
/** @param {string} ch */
const isNameChar = (ch) => (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch === '-';

/**
 * Class names with the prefix that are followed by `:before` — the glyph rules, not the font-family helpers.
 * @param {string} css
 * @param {string} prefix
 */
export function iconClassesOf(css, prefix) {
	/** @type {Set<string>} */
	const out = new Set();
	const needle = `.${prefix}`;
	let from = 0;
	while ((from = css.indexOf(needle, from)) !== -1) {
		let end = from + 1;
		while (end < css.length && isNameChar(css[end])) end++;
		if (css.startsWith(':before', end)) out.add(css.slice(from + 1, end));
		from = end;
	}
	return [...out].sort(byCodePoint);
}

/** @param {import('../../evals/lib/context.mjs').EvalContext} ctx */
export function buildIconsManifest(ctx) {
	/** @type {Record<string, { prefix: string, usage: string, source: string, classes: string[] }>} */
	const out = {};
	for (const s of ICON_SOURCES) {
		const file = insideDir(ctx.root, ...s.file.split('/'));
		const css = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
		out[s.key] = { prefix: s.prefix, usage: s.usage, source: s.file, classes: iconClassesOf(css, s.prefix) };
	}
	return out;
}
