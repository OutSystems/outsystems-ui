#!/usr/bin/env node
/**
 * Generates the CSS API reference from the SCSS source of truth:
 *   • stories/_helpers/css-api-manifest.ts — Storybook UI data (JSON-as-TS)
 *   • stories/CssApiReference.mdx          — thin MDX wrapper around the React page
 *
 * It walks src/scss, finds every `--osui-*: <default>;` declaration, attributes
 * each to the component root selector that owns it, and emits structured data for
 * the interactive Storybook page (CssApiReferencePage).
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
const manifestOutFile = path.join(repoRoot, 'stories', '_helpers', 'css-api-manifest.ts');
const mdxOutFile = path.join(repoRoot, 'stories', 'CssApiReference.mdx');
const patternCatalogueFile = path.join(repoRoot, 'stories', '_helpers', 'PatternCatalogue.tsx');

const SKIP_DIR = new Set(['tokens', '08-servicestudio-preview', '10-deprecated']);
const SKIP_FILE = (rel, base) =>
	base.endsWith('_lib.scss') ||
	base.includes('_ss_preview') ||
	rel.includes('theme-dark') ||
	base === '_variables.scss' ||
	base === '_utilities.scss';

function categoryFor(rel) {
	if (rel.startsWith('03-widgets/')) return { order: 1, label: 'Widgets', id: 'widgets' };
	if (rel.startsWith('04-patterns/01-adaptive/'))
		return { order: 2, label: 'Patterns – Adaptive', id: 'patterns-adaptive' };
	if (rel.startsWith('04-patterns/02-content/'))
		return { order: 3, label: 'Patterns – Content', id: 'patterns-content' };
	if (rel.startsWith('04-patterns/03-interaction/'))
		return { order: 4, label: 'Patterns – Interaction', id: 'patterns-interaction' };
	if (rel.startsWith('04-patterns/04-navigation/'))
		return { order: 5, label: 'Patterns – Navigation', id: 'patterns-navigation' };
	if (rel.startsWith('04-patterns/05-numbers/'))
		return { order: 6, label: 'Patterns – Numbers', id: 'patterns-numbers' };
	if (rel.startsWith('04-patterns/06-utilities/'))
		return { order: 7, label: 'Patterns – Utilities', id: 'patterns-utilities' };
	if (rel.startsWith('02-layout/')) return { order: 8, label: 'Layout', id: 'layout' };
	if (rel.startsWith('05-useful/')) return { order: 9, label: 'Utility Classes', id: 'utility-classes' };
	if (rel.startsWith('01-foundations/')) return { order: 10, label: 'Foundations', id: 'foundations' };
	return { order: 99, label: 'Other', id: 'other' };
}

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

function stripComments(src) {
	return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

function extract(src) {
	const out = [];
	const stack = [];
	let buf = '';
	let order = 0;

	for (let i = 0; i < src.length; i++) {
		const ch = src[i];

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
				const root = stack.find((s) => s && !s.startsWith('@')) ?? stack[0] ?? '(root)';
				// Since the @use/@forward migration (ROU-12911) token vars are reached through
				// the module namespace (`variables.$token-x`). The reference documents the
				// authoring form, so the namespace accessor is dropped.
				const value = m[2]
					.trim()
					.replace(/\s+/g, ' ')
					.replace(/\bvariables\.\$/g, '$');
				out.push({ root, name: m[1], value, order: order++ });
			}
			buf = '';
		} else {
			buf += ch;
		}
	}
	return out;
}

const COMPONENT_DISPLAY_NAMES = {
	btn: 'Button',
};

/** SCSS partials merged into another component entry (same sidebar row). */
const COMPONENT_MERGE_INTO = {
	'src/scss/03-widgets/_bulk-actions.scss': 'src/scss/03-widgets/_table.scss',
};

function prettyName(base) {
	const slug = base.replace(/^_/, '').replace(/\.scss$/, '');
	if (COMPONENT_DISPLAY_NAMES[slug]) return COMPONENT_DISPLAY_NAMES[slug];

	return slug
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[–—]/g, '')
		.replace(/[^a-z0-9 ]/g, '')
		.trim()
		.replace(/\s+/g, '-');
}

function classifyKind(name) {
	if (/-color$|color$|-foreground|-text(?!-)/.test(name)) return 'color';
	if (/-background|bg-|-overlay|-fill|-empty-color|-filled-color/.test(name)) return 'color';
	if (/-border-color|shadow|elevation|ring-color|arrow-color|prompt-color/.test(name)) return 'color';
	if (/-shadow|elevation/.test(name)) return 'shadow';
	if (/-width|-height|-size|-padding|-margin|-gap|-offset|-min-|-max-/.test(name)) return 'spacing';
	if (/-radius|-border-width|-border(?!-color)/.test(name)) return 'border';
	return 'other';
}

function classifyChain(value) {
	if (/^var\(--color-/.test(value)) return 'theme-role';
	if (/^var\(--border-radius-/.test(value)) return 'theme-role';
	if (/^var\(--os-/.test(value)) return 'theme-role';
	if (/^#\{\$?variables?\.\$token-|^#\{\$token-/.test(value)) return 'token';
	if (/^var\(--token-/.test(value)) return 'token';
	if (/^var\(--osui-/.test(value)) return 'theme-role';
	if (/^var\(/.test(value)) return 'other';
	if (/^[\d#]|^calc\(|^rgba?\(|^hsla?\(/.test(value)) return 'literal';
	return 'other';
}

function resolvedHint(value, chain) {
	if (chain === 'token') {
		if (value.startsWith('#{variables.$')) {
			const tokenRef = value.slice('#{variables.'.length, -1);
			return `#${'{' + tokenRef + '}'}`;
		}
		if (value.startsWith('#{$token-')) return value;
	}
	if (chain === 'theme-role' || chain === 'other' || chain === 'literal') return value;
	return value;
}

function loadPatternStoryMap() {
	const map = new Map();
	if (!fs.existsSync(patternCatalogueFile)) return map;
	const src = fs.readFileSync(patternCatalogueFile, 'utf8');
	const re = /name:\s*'([^']+)'[^}]*?id:\s*'([^']+)'/gs;
	for (const match of src.matchAll(re)) {
		map.set(match[1], match[2]);
	}
	return map;
}

const WIDGET_STORY_SLUG = {
	btn: 'button',
	checkbox: 'checkbox',
	dropdown: 'dropdown',
	form: 'form',
	input: 'input',
	label: 'label',
	link: 'link',
	list: 'list',
	popup: 'popup',
	switch: 'switch',
	table: 'table',
	textarea: 'textarea',
	upload: 'upload',
	'feedback-message': 'feedbackmessage',
	'button-group': 'button',
	'bulk-actions': 'table',
	radio: 'radiogroup',
};

function inferStoryId(name, file, patternStories) {
	if (patternStories.has(name)) return patternStories.get(name);

	const base = path.basename(file, '.scss').replace(/^_/, '');
	const widgetSlug = WIDGET_STORY_SLUG[base];
	if (widgetSlug) return `widgets-${widgetSlug}--default`;

	return null;
}


function escTsString(v) {
	return v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ── Build the model ────────────────────────────────────────────────────────
const files = walk(scssRoot).sort();
const patternStories = loadPatternStoryMap();
const categories = new Map();

for (const abs of files) {
	const rel = path.relative(scssRoot, abs).split(path.sep).join('/');
	const base = path.basename(abs);
	if (SKIP_FILE(rel, base)) continue;

	const decls = extract(stripComments(fs.readFileSync(abs, 'utf8')));
	if (decls.length === 0) continue;

	const cat = categoryFor(rel);
	const fileKey = `src/scss/${rel}`;
	const componentKey = COMPONENT_MERGE_INTO[fileKey] ?? fileKey;
	const primaryBase = path.basename(componentKey);
	const primarySlug = primaryBase.replace(/^_/, '').replace(/\.scss$/, '');
	const displayName = prettyName(primaryBase);

	if (!categories.has(cat.id)) {
		categories.set(cat.id, { order: cat.order, label: cat.label, id: cat.id, components: new Map() });
	}
	const bucket = categories.get(cat.id);

	if (!bucket.components.has(componentKey)) {
		bucket.components.set(componentKey, {
			name: displayName,
			file: componentKey,
			slug: `${cat.id}-${primarySlug}`,
			storyId: inferStoryId(displayName, primaryBase, patternStories),
			order: decls[0]?.order ?? 0,
			variants: new Map(),
		});
	}

	const component = bucket.components.get(componentKey);

	for (const d of decls) {
		if (!component.variants.has(d.root)) {
			component.variants.set(d.root, { selector: d.root, order: d.order, props: new Map() });
		}
		const variant = component.variants.get(d.root);
		if (!variant.props.has(d.name)) {
			const chain = classifyChain(d.value);
			variant.props.set(d.name, {
				name: d.name,
				default: d.value,
				kind: classifyKind(d.name),
				chain,
				hint: resolvedHint(d.value, chain),
			});
		}
	}
}

const sortedCats = [...categories.values()].sort((a, b) => a.order - b.order);

let totalProps = 0;
let totalComponents = 0;

const manifestCategories = sortedCats.map((cat) => {
	const components = [...cat.components.values()]
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((c) => {
			totalComponents++;
			const variants = [...c.variants.values()]
				.sort((a, b) => a.order - b.order)
				.map((v) => {
					const properties = [...v.props.values()].sort((a, b) => a.name.localeCompare(b.name));
					totalProps += properties.length;
					return { selector: v.selector, properties };
				});
			return {
				name: c.name,
				slug: c.slug,
				file: c.file,
				storyId: c.storyId,
				variants,
			};
		});

	return { id: cat.id, label: cat.label, order: cat.order, components };
});

const generatedAt = new Date().toISOString();

// ── TypeScript manifest ────────────────────────────────────────────────────
function emitProp(p, indent) {
	const pad = '\t'.repeat(indent);
	return [
		`${pad}{`,
		`${pad}\tname: '${escTsString(p.name)}',`,
		`${pad}\tdefault: '${escTsString(p.default)}',`,
		`${pad}\tkind: '${p.kind}',`,
		`${pad}\tchain: '${p.chain}',`,
		`${pad}\thint: '${escTsString(p.hint)}',`,
		`${pad}},`,
	].join('\n');
}

const manifestLines = [
	'// Generated by scripts/generate-css-api-reference.mjs — do not edit by hand.',
	'// Regenerate: npm run docs:css-api',
	'',
	'export type CssApiPropertyKind = "color" | "spacing" | "border" | "shadow" | "other";',
	'export type CssApiPropertyChain = "theme-role" | "token" | "literal" | "other";',
	'',
	'export type CssApiProperty = {',
	'\tname: string;',
	'\tdefault: string;',
	'\tkind: CssApiPropertyKind;',
	'\tchain: CssApiPropertyChain;',
	'\thint: string;',
	'};',
	'',
	'export type CssApiVariant = {',
	'\tselector: string;',
	'\tproperties: CssApiProperty[];',
	'};',
	'',
	'export type CssApiComponent = {',
	'\tname: string;',
	'\tslug: string;',
	'\tfile: string;',
	'\tstoryId: string | null;',
	'\tvariants: CssApiVariant[];',
	'};',
	'',
	'export type CssApiCategory = {',
	'\tid: string;',
	'\tlabel: string;',
	'\torder: number;',
	'\tcomponents: CssApiComponent[];',
	'};',
	'',
	'export type CssApiManifest = {',
	'\tgeneratedAt: string;',
	'\ttotals: { properties: number; components: number; categories: number };',
	'\tcategories: CssApiCategory[];',
	'};',
	'',
	'export const CSS_API_MANIFEST: CssApiManifest = {',
	`\tgeneratedAt: '${generatedAt}',`,
	'\ttotals: {',
	`\t\tproperties: ${totalProps},`,
	`\t\tcomponents: ${totalComponents},`,
	`\t\tcategories: ${manifestCategories.length},`,
	'\t},',
	'\tcategories: [',
];

for (const cat of manifestCategories) {
	manifestLines.push('\t\t{');
	manifestLines.push(`\t\t\tid: '${cat.id}',`);
	manifestLines.push(`\t\t\tlabel: '${escTsString(cat.label)}',`);
	manifestLines.push(`\t\t\torder: ${cat.order},`);
	manifestLines.push('\t\t\tcomponents: [');
	for (const c of cat.components) {
		manifestLines.push('\t\t\t\t{');
		manifestLines.push(`\t\t\t\t\tname: '${escTsString(c.name)}',`);
		manifestLines.push(`\t\t\t\t\tslug: '${escTsString(c.slug)}',`);
		manifestLines.push(`\t\t\t\t\tfile: '${escTsString(c.file)}',`);
		manifestLines.push(`\t\t\t\t\tstoryId: ${c.storyId ? `'${escTsString(c.storyId)}'` : 'null'},`);
		manifestLines.push('\t\t\t\t\tvariants: [');
		for (const v of c.variants) {
			manifestLines.push('\t\t\t\t\t\t{');
			manifestLines.push(`\t\t\t\t\t\t\tselector: '${escTsString(v.selector)}',`);
			manifestLines.push('\t\t\t\t\t\t\tproperties: [');
			for (const p of v.properties) manifestLines.push(emitProp(p, 7));
			manifestLines.push('\t\t\t\t\t\t],');
			manifestLines.push('\t\t\t\t\t},');
		}
		manifestLines.push('\t\t\t\t],');
		manifestLines.push('\t\t\t\t},');
	}
	manifestLines.push('\t\t\t],');
	manifestLines.push('\t\t},');
}

manifestLines.push('\t],', '};', '');

fs.writeFileSync(manifestOutFile, manifestLines.join('\n'));

// ── Storybook MDX wrapper ──────────────────────────────────────────────────
const mdx = [
	"import { Meta } from '@storybook/addon-docs/blocks';",
	"import { CssApiReferencePage } from './_helpers/CssApiReferencePage';",
	'',
	'<Meta',
	'\ttitle="CSS API Reference"',
	"\ttags={['!ui-pending']}",
	'\tparameters={{',
	'\t\toptions: { showPanel: false },',
	"\t\tlayout: 'fullscreen',",
	'\t}}',
	'/>',
	'',
	'<CssApiReferencePage />',
	'',
].join('\n');

fs.writeFileSync(mdxOutFile, mdx);

console.log(
	`Wrote ${manifestOutFile} and ${mdxOutFile}: ${totalProps} properties across ${totalComponents} components.`
);
