#!/usr/bin/env node
/**
 * Generates docs/css-api-reference.md from the SCSS source of truth.
 *
 * It walks src/scss, finds every `--osui-*: <default>;` declaration, attributes
 * each to the component root selector that owns it, and emits one table per
 * component grouped by category (Widgets, Patterns – *, Foundations).
 *
 * Run: `npm run docs:css-api`  (or `node scripts/generate-css-api-reference.mjs`)
 *
 * Why a generator: the reference covers 400+ properties across ~80 files and
 * drifts the moment a component adds/renames a `--osui-*` knob. Regenerating is
 * the only reliable way to keep it accurate. This script has no dependencies.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const scssRoot = path.join(repoRoot, 'src', 'scss');
const outFile = path.join(repoRoot, 'docs', 'css-api-reference.md');

// Files/dirs that are not part of the runtime component CSS API.
const SKIP_DIR = new Set(['tokens', '08-servicestudio-preview', '10-deprecated']);
const SKIP_FILE = (rel, base) =>
	base.endsWith('_lib.scss') ||
	base.includes('_ss_preview') ||
	rel.includes('theme-dark') || // theme overrides, not API definitions
	base === '_variables.scss' ||
	base === '_utilities.scss';

// Category label from the path relative to src/scss.
function categoryFor(rel) {
	if (rel.startsWith('03-widgets/')) return { order: 1, label: 'Widgets' };
	if (rel.startsWith('04-patterns/01-adaptive/')) return { order: 2, label: 'Patterns – Adaptive' };
	if (rel.startsWith('04-patterns/02-content/')) return { order: 3, label: 'Patterns – Content' };
	if (rel.startsWith('04-patterns/03-interaction/')) return { order: 4, label: 'Patterns – Interaction' };
	if (rel.startsWith('04-patterns/04-navigation/')) return { order: 5, label: 'Patterns – Navigation' };
	if (rel.startsWith('04-patterns/05-numbers/')) return { order: 6, label: 'Patterns – Numbers' };
	if (rel.startsWith('04-patterns/06-utilities/')) return { order: 7, label: 'Patterns – Utilities' };
	if (rel.startsWith('02-layout/')) return { order: 8, label: 'Layout' };
	if (rel.startsWith('05-useful/')) return { order: 9, label: 'Utility Classes' };
	if (rel.startsWith('01-foundations/')) return { order: 10, label: 'Foundations' };
	return { order: 99, label: 'Other' };
}

// Collect all .scss files under src/scss (minus skips).
function walk(dir, acc = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (entry.isDirectory()) {
			if (SKIP_DIR.has(entry.name)) continue;
			walk(path.join(dir, entry.name), acc);
		} else if (entry.name.endsWith('.scss')) {
			acc.push(path.join(dir, entry.name));
		}
	}
	return acc;
}

// Strip block + line comments so they don't confuse the scanner. (Values never
// contain `//` or `/*` in this codebase.)
function stripComments(src) {
	return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

/**
 * Scan SCSS, tracking a selector stack via brace depth, and record every
 * `--osui-*` declaration with the outermost real selector that owns it.
 * `#{…}` interpolation is treated as opaque so its braces don't skew depth.
 */
function extract(src) {
	const out = []; // { root, name, value, order }
	const stack = [];
	let buf = '';
	let order = 0;

	for (let i = 0; i < src.length; i++) {
		const ch = src[i];

		// Opaque interpolation: copy through to the matching '}'.
		if (ch === '#' && src[i + 1] === '{') {
			let depth = 1;
			buf += '#{';
			i += 2;
			while (i < src.length && depth > 0) {
				if (src[i] === '{') depth++;
				else if (src[i] === '}') depth--;
				if (depth > 0) buf += src[i];
				i++;
			}
			buf += '}';
			i--;
			continue;
		}

		if (ch === '{') {
			stack.push(buf.trim().replace(/\s+/g, ' '));
			buf = '';
		} else if (ch === '}') {
			stack.pop();
			buf = '';
		} else if (ch === ';') {
			const decl = buf.trim();
			const m = decl.match(/^(--osui-[a-z0-9-]+)\s*:\s*([\s\S]+)$/i);
			if (m) {
				// Outermost non-at-rule selector owns the declaration.
				const root = stack.find((s) => s && !s.startsWith('@')) ?? stack[0] ?? '(root)';
				out.push({ root, name: m[1], value: m[2].trim().replace(/\s+/g, ' '), order: order++ });
			}
			buf = '';
		} else {
			buf += ch;
		}
	}
	return out;
}

function prettyName(base) {
	return base
		.replace(/^_/, '')
		.replace(/\.scss$/, '')
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

// ── Build the model ────────────────────────────────────────────────────────
const files = walk(scssRoot).sort();
const categories = new Map(); // label -> { order, components: [] }

for (const abs of files) {
	const rel = path.relative(scssRoot, abs).split(path.sep).join('/');
	const base = path.basename(abs);
	if (SKIP_FILE(rel, base)) continue;

	const decls = extract(stripComments(fs.readFileSync(abs, 'utf8')));
	if (decls.length === 0) continue;

	const cat = categoryFor(rel);

	// Group by owning root selector; keep first (default) value per property.
	const bySelector = new Map();
	for (const d of decls) {
		if (!bySelector.has(d.root)) bySelector.set(d.root, { order: d.order, props: new Map() });
		const sel = bySelector.get(d.root);
		if (!sel.props.has(d.name)) sel.props.set(d.name, d.value);
	}

	if (!categories.has(cat.label)) categories.set(cat.label, { order: cat.order, components: [] });
	const bucket = categories.get(cat.label);

	for (const [selector, { order, props }] of [...bySelector.entries()].sort((a, b) => a[1].order - b[1].order)) {
		bucket.components.push({
			name: prettyName(base),
			selector,
			file: `src/scss/${rel}`,
			order,
			props: [...props.entries()],
		});
	}
}

// ── Emit markdown ────────────────────────────────────────────────────────────
const sortedCats = [...categories.entries()].sort((a, b) => a[1].order - b[1].order);

const esc = (v) => v.replace(/\|/g, '\\|');
let totalProps = 0;
let totalComponents = 0;

const lines = [];
lines.push('# CSS API Reference');
lines.push('');
lines.push('Every `--osui-*` custom property exposed by OutSystemsUI components, with its');
lines.push('default value. Override any property on the component’s root element (or an');
lines.push('ancestor) to customise appearance — without touching component rules or tokens.');
lines.push('');
lines.push('See [`css-architecture.md`](./css-architecture.md) for how these defaults resolve');
lines.push('(component CSS API → `--color-*` theme layer → `$token-*` → `--token-*`).');
lines.push('');
lines.push('> **Generated file — do not edit by hand.** Regenerate after any `--osui-*`');
lines.push('> change with `npm run docs:css-api` (source: `scripts/generate-css-api-reference.mjs`).');
lines.push('');
lines.push('**Usage example:**');
lines.push('```css');
lines.push('.my-page .osui-sidebar {');
lines.push('  --osui-sidebar-background: #1a1a2e;');
lines.push('  --osui-sidebar-color: #ffffff;');
lines.push('}');
lines.push('```');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Table of Contents');
lines.push('');
for (const [label] of sortedCats) {
	const anchor = label
		.toLowerCase()
		.replace(/[–—]/g, '')
		.replace(/[^a-z0-9 ]/g, '')
		.trim()
		.replace(/\s+/g, '-');
	lines.push(`- [${label}](#${anchor})`);
}
lines.push('');
lines.push('---');
lines.push('');

for (const [label, { components }] of sortedCats) {
	lines.push(`## ${label}`);
	lines.push('');
	for (const c of components) {
		totalComponents++;
		lines.push(`### ${c.name} (\`${c.selector}\`)`);
		lines.push(`_File: \`${c.file}\`_`);
		lines.push('');
		lines.push('| Property | Default |');
		lines.push('|---|---|');
		for (const [name, value] of c.props) {
			totalProps++;
			lines.push(`| \`${name}\` | \`${esc(value)}\` |`);
		}
		lines.push('');
	}
	lines.push('---');
	lines.push('');
}

lines.push(`<sub>${totalProps} properties across ${totalComponents} components, generated from \`src/scss\`.</sub>`);
lines.push('');

fs.writeFileSync(outFile, lines.join('\n'));
console.log(`Wrote ${outFile}: ${totalProps} properties across ${totalComponents} components.`);
