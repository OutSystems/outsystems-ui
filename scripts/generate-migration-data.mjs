#!/usr/bin/env node

/**
 * Generates the data behind the Storybook "Migration" page
 * (stories/Migration.mdx → stories/_helpers/MigrationPage.tsx), which tells app
 * developers how to port custom CSS from the classic (pre-token) theme to the
 * current one.
 *
 * Why a generator: every number, colour and value table on that page is
 * *derived* — computed by diffing the classic CSS snapshot against the current
 * bundle and resolving the result through the design-token fallback chains. A
 * tokens bump silently invalidates them, and a stale migration guide is worse
 * than none. The script also enforces the invariants that are easy to break by
 * hand:
 *
 *   1. the compatibility snippet covers EXACTLY the set of retired `:root`
 *      variables — no gaps, no entries for variables that still ship;
 *   2. every `--token-*` the mapping names exists in the token package;
 *   3. every "exact" replacement resolves to the same value the retired name had;
 *   4. every re-valued `:root` variable lands in one of the page's tables.
 *
 * Reads (all read-only):
 *   • classic-theme/ODC.OutSystemsUI.css            the pre-migration surface
 *   • dist/ODC.OutSystemsUI.css                     the current surface (needs a build)
 *   • src/scss/tokens/_variables.scss               token fallback chains (npm run build:tokens)
 *   • src/scss/00-abstract/_setup-global-vars.scss  palette maps behind the utility classes
 *
 * Writes:
 *   • stories/_helpers/migration-data.ts
 *
 * Run: npm run docs:migration            (rewrite)
 *      npm run docs:migration -- --check (fail if the data file is stale)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

const IN = {
	classic: path.join(repoRoot, 'classic-theme', 'ODC.OutSystemsUI.css'),
	current: path.join(repoRoot, 'dist', 'ODC.OutSystemsUI.css'),
	tokens: path.join(repoRoot, 'src', 'scss', 'tokens', '_variables.scss'),
	maps: path.join(repoRoot, 'src', 'scss', '00-abstract', '_setup-global-vars.scss'),
};
const OUT = path.join(repoRoot, 'stories', '_helpers', 'migration-data.ts');

function die(msg) {
	console.error(`\n✖ ${msg}\n`);
	process.exit(1);
}

for (const [key, file] of Object.entries(IN)) {
	if (fs.existsSync(file)) continue;
	const hint =
		key === 'current'
			? 'Run `npm run build` (or `npm run dev -- --target ODC`) first.'
			: key === 'tokens'
				? 'Run `npm run build:tokens` first.'
				: 'File is missing from the repo.';
	die(`Cannot read ${path.relative(repoRoot, file)}. ${hint}`);
}

const read = (f) => fs.readFileSync(f, 'utf8');
const classicCss = read(IN.classic);
const currentCss = read(IN.current);

// ── Parse the two `:root` surfaces ──────────────────────────────────────────
/** Every custom property declared at `:root`, first declaration wins. */
function rootVars(css) {
	const out = new Map();
	for (const block of css.matchAll(/:root\s*\{([\s\S]*?)\}/g)) {
		for (const decl of block[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
			if (!out.has(decl[1])) out.set(decl[1], decl[2].trim());
		}
	}
	return out;
}

const oldVars = rootVars(classicCss);
const newVars = rootVars(currentCss);

const retired = [...oldVars.keys()].filter((n) => !newVars.has(n)).sort();
const byName = (a, b) => a.localeCompare(b, 'en', { numeric: true });
const revalued = [...oldVars.keys()].filter((n) => newVars.has(n) && oldVars.get(n) !== newVars.get(n)).sort(byName);
const unchanged = [...oldVars.keys()].filter((n) => newVars.has(n) && oldVars.get(n) === newVars.get(n)).sort();
const added = [...newVars.keys()].filter((n) => !oldVars.has(n)).sort();

// ── Value resolution ────────────────────────────────────────────────────────
/** `$token-x: var(--token-x, <fallback chain>);` → Map('--token-x' → chain). */
const tokenChains = new Map(
	[...read(IN.tokens).matchAll(/^\$(token-[a-z0-9-]+):\s*var\(--token-[a-z0-9-]+,\s*([^;]+)\);/gm)].map((m) => [
		`--${m[1]}`,
		m[2].trim(),
	])
);

/** Split `a, b` at the first top-level comma. */
function splitVar(inner) {
	let depth = 0;
	for (let i = 0; i < inner.length; i++) {
		if (inner[i] === '(') depth++;
		else if (inner[i] === ')') depth--;
		else if (inner[i] === ',' && depth === 0) return [inner.slice(0, i).trim(), inner.slice(i + 1).trim()];
	}
	return [inner.trim(), null];
}

/**
 * Follow a value down to its literal: `var(--x, fallback)` uses the surface's
 * own declaration of `--x` when it has one, then the token chain, then the
 * fallback. `calc()` over plain numbers is evaluated so z-index steps compare.
 */
function resolve(value, vars, depth = 0) {
	let v = String(value).trim();
	if (depth > 20) return v;
	// Some token chains alias another SCSS token (`$token-scale-025`).
	if (/^\$token-[a-z0-9-]+$/.test(v)) return resolve(`var(--${v.slice(1)})`, vars, depth + 1);
	const whole = v.match(/^var\(([\s\S]+)\)$/);
	if (whole && splitVar(whole[1])[0].match(/^--[a-z0-9-]+$/)) {
		const [name, fallback] = splitVar(whole[1]);
		if (vars.has(name)) return resolve(vars.get(name), vars, depth + 1);
		if (tokenChains.has(name)) return resolve(tokenChains.get(name), vars, depth + 1);
		return fallback ? resolve(fallback, vars, depth + 1) : v;
	}
	// Inline nested SCSS-token aliases (multi-layer shadows) and var() inside calc().
	v = v.replace(/\$(token-[a-z0-9-]+)/g, (m, name) => resolve(`var(--${name})`, vars, depth + 1));
	v = v.replace(/var\((--[a-z0-9-]+)\)/g, (m, name) =>
		vars.has(name) ? resolve(vars.get(name), vars, depth + 1) : m
	);
	const calc = v.match(/^calc\(([-+*/\d\s.()]+)\)$/);
	if (calc) return String(Function(`"use strict";return (${calc[1]});`)());
	return v.replace(/\s+/g, ' ');
}

const oldLiteral = (name) => (oldVars.has(name) ? resolve(oldVars.get(name), oldVars) : null);
const newLiteral = (name) => (newVars.has(name) ? resolve(newVars.get(name), newVars) : null);
const tokenLiteral = (token) => (tokenChains.has(token) ? resolve(tokenChains.get(token), newVars) : null);
/** Resolve a replacement expression (`var(--token-x)`, `50%`, `none`) to its literal. */
const replacementLiteral = (expr) => resolve(expr, newVars);

/** `1.75rem` → `28px` so px-era values compare; leaves everything else alone. */
const toPx = (v) => (/^-?[\d.]+rem$/.test(v) ? `${parseFloat(v) * 16}px` : v === '0' ? '0px' : v);

// ── Palette maps behind the utility classes ─────────────────────────────────
const mapsSrc = read(IN.maps);

/** `$osui-colors-extended` → Map(family → Map(shade → '--token-…')); '' = base shade. */
function extendedMap(scss) {
	const block = scss.split('$osui-colors-extended:')[1].split(';')[0];
	const out = new Map();
	for (const fam of block.matchAll(/'([a-z]+)'\s*\(([\s\S]*?)\)/g)) {
		const shades = new Map();
		for (const s of fam[2].matchAll(/'([a-z]*)'\s+variables\.\$(token-[a-z0-9-]+)/g)) shades.set(s[1], `--${s[2]}`);
		out.set(fam[1], shades);
	}
	return out;
}

/** A simple `'key' variables.$token-…` list, e.g. `$osui-colors-semantic`. */
function simpleMap(scss, name) {
	const block = scss.split(`${name}:`)[1].split(';')[0];
	return new Map(
		[...block.matchAll(/'([a-z0-9-]+)'\s+variables\.\$(token-[a-z0-9-]+)/g)].map((m) => [m[1], `--${m[2]}`])
	);
}

const extended = extendedMap(mapsSrc);
const semanticUtils = simpleMap(mapsSrc, '$osui-colors-semantic');
const SHADES = ['lightest', 'lighter', 'light', '', 'dark', 'darker', 'darkest'];
const shadeVar = (family, shade) => (shade === '' ? `--color-${family}` : `--color-${family}-${shade}`);

// ── The replacement mapping (the editorial decision, kept in one place) ──────
// `exact: true` asserts the replacement resolves to the retired name's value.
const tok = (name) => `var(${name})`;

const paletteRows = [];
for (const [family, shades] of extended) {
	for (const shade of SHADES) {
		// The base shade (`--color-red`) still ships — only the six tints/shades retired.
		if (shade === '' || !shades.has(shade)) continue;
		paletteRows.push({ name: shadeVar(family, shade), to: tok(shades.get(shade)) });
	}
}

const RETIRED_GROUPS = [
	{
		id: 'typography',
		title: 'Typography',
		note: 'Value-preserving — each replacement is the token with the same size the old variable had.',
		rows: [
			['--font-size-display', '--token-font-size-900'],
			['--font-size-h1', '--token-font-size-800'],
			['--font-size-h2', '--token-font-size-700'],
			['--font-size-h3', '--token-font-size-650'],
			['--font-size-h4', '--token-font-size-550'],
			['--font-size-h5', '--token-font-size-500'],
			['--font-size-h6', '--token-font-size-450'],
			['--font-size-base', '--token-font-size-400'],
			['--font-size-s', '--token-font-size-350'],
			['--font-size-xs', '--token-font-size-300'],
			['--font-size-label', '--token-font-size-275'],
			['--font-light', '--token-font-weight-light'],
			['--font-regular', '--token-font-weight-regular'],
			['--font-semi-bold', '--token-font-weight-semi-bold'],
			['--font-bold', '--token-font-weight-bold'],
		].map(([name, t]) => ({ name, to: tok(t), exact: true })),
	},
	{
		id: 'elevation',
		title: 'Elevation',
		note: 'The new elevations are two-layer shadows — similar, not identical. Four steps, so xs and s collapse.',
		rows: [
			{ name: '--shadow-none', to: 'none', exact: true },
			{ name: '--shadow-xs', to: tok('--token-elevation-1') },
			{ name: '--shadow-s', to: tok('--token-elevation-1') },
			{ name: '--shadow-m', to: tok('--token-elevation-2') },
			{ name: '--shadow-l', to: tok('--token-elevation-3') },
			{ name: '--shadow-xl', to: tok('--token-elevation-4') },
		],
	},
	{
		id: 'borders',
		title: 'Borders',
		note: '',
		rows: [
			{ name: '--border-size-none', to: tok('--token-border-size-0'), exact: true },
			{ name: '--border-size-s', to: tok('--token-border-size-025'), exact: true },
			{ name: '--border-size-m', to: tok('--token-border-size-050'), exact: true },
			{ name: '--border-size-l', to: tok('--token-border-size-075'), exact: true },
			{ name: '--border-radius-circle', to: '50%' },
		],
	},
	{
		id: 'palette',
		title: 'Extended palette shades',
		note: 'Derived from the same map that drives the .background-* / .text-* utility classes.',
		rows: paletteRows,
	},
	{
		id: 'semantic-light',
		title: 'Semantic light shades',
		note: '',
		rows: [
			...['error-light', 'warning-light', 'success-light', 'info-light'].map((key) => ({
				name: `--color-${key}`,
				to: tok(semanticUtils.get(key)),
			})),
			{ name: '--color-primary-lightest', to: tok('--token-bg-primary-subtle-default') },
		],
	},
	{
		id: 'misc',
		title: 'Misc',
		note: '',
		rows: [
			{ name: '--header-color', to: 'var(--color-background-header)' },
			{ name: '--overlay-background', to: tok('--token-backdrop'), exact: true },
		],
	},
];

// ── Invariants ──────────────────────────────────────────────────────────────
const covered = RETIRED_GROUPS.flatMap((g) => g.rows.map((r) => r.name));
const retiredSet = new Set(retired);
const coveredSet = new Set(covered);

const missing = retired.filter((n) => !coveredSet.has(n));
const spurious = covered.filter((n) => !retiredSet.has(n));
const duplicated = covered.filter((n, i) => covered.indexOf(n) !== i);
if (missing.length) die(`The mapping is missing ${missing.length} retired variable(s):\n  ${missing.join('\n  ')}`);
if (spurious.length)
	die(
		`The mapping lists ${spurious.length} variable(s) that are NOT retired (they still ship):\n  ${spurious.join('\n  ')}`
	);
if (duplicated.length) die(`Duplicate entries in the mapping:\n  ${duplicated.join('\n  ')}`);

const referencedTokens = new Set(
	RETIRED_GROUPS.flatMap((g) => g.rows.flatMap((r) => r.to.match(/--token-[a-z0-9-]+/g) ?? []))
);
const ghosts = [...referencedTokens].filter((t) => !tokenChains.has(t)).sort();
if (ghosts.length) die(`The mapping references token(s) missing from the token package:\n  ${ghosts.join('\n  ')}`);

const notExact = RETIRED_GROUPS.flatMap((g) => g.rows)
	.filter((r) => r.exact)
	.filter((r) => toPx(oldLiteral(r.name)) !== toPx(replacementLiteral(r.to)))
	.map((r) => `${r.name}: ${oldLiteral(r.name)} → ${r.to} = ${replacementLiteral(r.to)}`);
if (notExact.length) die(`"Exact" replacements no longer match the retired value:\n  ${notExact.join('\n  ')}`);

// ── Re-valued names, bucketed for the page's tables ─────────────────────────
const NEUTRAL_RE = /^--color-neutral-\d+$/;
const PALETTE_BASE = new Set([...extended.keys()].map((f) => `--color-${f}`));
const BUCKETS = [
	['neutral', (n) => NEUTRAL_RE.test(n)],
	['palette', (n) => PALETTE_BASE.has(n)],
	['radius', (n) => n.startsWith('--border-radius-')],
	['layers', (n) => n.startsWith('--layer-')],
	['spacing', (n) => n.startsWith('--space-')],
	['color', (n) => n.startsWith('--color-')],
];
const buckets = Object.fromEntries(BUCKETS.map(([id]) => [id, []]));
const unbucketed = [];
for (const name of revalued) {
	const hit = BUCKETS.find(([, test]) => test(name));
	if (!hit) unbucketed.push(name);
	else
		buckets[hit[0]].push({
			name,
			old: toPx(oldLiteral(name)),
			now: toPx(newLiteral(name)),
			expr: newVars.get(name),
		});
}
if (unbucketed.length)
	die(`Re-valued variable(s) the page has no table for — add a bucket:\n  ${unbucketed.join('\n  ')}`);

// Spacing kept its values (only the plumbing became token-backed) — assert it.
const spacingDrift = buckets.spacing.filter((r) => toPx(r.old) !== toPx(r.now));
if (spacingDrift.length)
	die(
		`--space-* values drifted — the page says they are unchanged:\n  ${spacingDrift.map((r) => `${r.name}: ${r.old} → ${r.now}`).join('\n  ')}`
	);

// ── Retired override hooks ──────────────────────────────────────────────────
// The classic bundle read `var(--background-color-X, var(--color-X))` at every
// call site, so apps could re-point one usage family without touching the role.
// Nothing declares these — they are read-sites — so the :root diff misses them.
const HOOK_PREFIXES = ['--background-color-', '--text-color-', '--border-color-'];
const hookNames = (css) =>
	new Set([...css.matchAll(/var\((--(?:background|text|border)-color-[a-z0-9-]+)/g)].map((m) => m[1]));
const oldHooks = hookNames(classicCss);
const newHooks = hookNames(currentCss);
const hooks = HOOK_PREFIXES.map((prefix) => {
	const names = [...oldHooks].filter((n) => n.startsWith(prefix)).sort();
	return {
		prefix,
		retired: names.filter((n) => !newHooks.has(n)).length,
		kept: names.filter((n) => newHooks.has(n)),
	};
});

// ── Palette grid + typography/body facts ────────────────────────────────────
const palette = [...extended].map(([family, shades]) => ({
	family,
	old: SHADES.map((s) => oldLiteral(shadeVar(family, s)) ?? '—'),
	now: SHADES.map((s) => (shades.has(s) ? tokenLiteral(shades.get(s)) : null) ?? '—'),
}));

/** Value of `prop` in the first rule whose selector list contains `selector` exactly. */
function ruleProp(css, selector, prop) {
	for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		if (
			!m[1]
				.split(',')
				.map((s) => s.trim())
				.includes(selector)
		)
			continue;
		const decl = m[2].match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`));
		if (decl) return decl[1].trim();
	}
	return null;
}

const literalIn = (value, vars) => toPx(resolve(value ?? '—', vars));
const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((h) => {
	// Classic sized headings through `.font-size-hN`-equivalent vars on the element.
	const oldSize = oldLiteral(`--font-size-${h}`);
	const nowDecl = ruleProp(currentCss, h, 'font-size');
	const phoneDecl =
		ruleProp(currentCss, `.phone ${h}`, 'font-size') ?? ruleProp(currentCss, `.tablet ${h}`, 'font-size');
	return {
		element: h,
		old: toPx(oldSize ?? '—'),
		now: literalIn(nowDecl, newVars),
		small: phoneDecl ? literalIn(phoneDecl, newVars) : null,
	};
});

const body = {
	old: ruleProp(classicCss, 'body', 'line-height') ?? '—',
	now: ruleProp(currentCss, 'body', 'line-height') ?? '—',
	fontSize: literalIn(ruleProp(currentCss, 'body', 'font-size'), newVars),
};

// ── Compatibility snippet ───────────────────────────────────────────────────
const snippetLines = [':root {'];
RETIRED_GROUPS.forEach((g, i) => {
	if (i > 0) snippetLines.push('');
	snippetLines.push(`\t/* ${g.title} */`);
	for (const r of g.rows) snippetLines.push(`\t${r.name}: ${r.to};`);
});
snippetLines.push('}');

// ── Emit ────────────────────────────────────────────────────────────────────
const data = {
	counts: {
		classicRoot: oldVars.size,
		retired: retired.length,
		revalued: revalued.length,
		unchanged: unchanged.length,
		added: added.length,
		hooksRetired: hooks.reduce((n, h) => n + h.retired, 0),
	},
	retiredGroups: RETIRED_GROUPS.map((g) => ({
		id: g.id,
		title: g.title,
		note: g.note,
		rows: g.rows.map((r) => ({
			name: r.name,
			old: toPx(oldLiteral(r.name)),
			to: r.to,
			now: toPx(replacementLiteral(r.to)),
		})),
	})),
	revalued: buckets,
	added,
	hooks,
	palette,
	shades: SHADES.map((s) => s || 'base'),
	headings,
	body,
	snippet: snippetLines.join('\n'),
};

const source = [
	'// Generated by scripts/generate-migration-data.mjs — do not edit by hand.',
	'// Regenerate: npm run docs:migration (requires a build + npm run build:tokens first)',
	'',
	'export type MigrationRow = { name: string; old: string | null; to: string; now: string };',
	'export type MigrationGroup = { id: string; title: string; note: string; rows: MigrationRow[] };',
	'export type RevaluedRow = { name: string; old: string; now: string; expr: string };',
	'',
	`export const MIGRATION_DATA = ${JSON.stringify(data, null, '\t')} as const;`,
	'',
].join('\n');

const prettierConfig = await prettier.resolveConfig(OUT);
const formatted = await prettier.format(source, { ...prettierConfig, filepath: OUT });
const current = fs.existsSync(OUT) ? read(OUT) : '';
const summary = `${retired.length} retired, ${revalued.length} re-valued, ${unchanged.length} unchanged, ${added.length} added`;

if (CHECK) {
	if (formatted !== current)
		die(`${path.relative(repoRoot, OUT)} is out of date.\n  Run \`npm run docs:migration\` and commit the result.`);
	console.log(`✓ ${path.relative(repoRoot, OUT)} is up to date (${summary}).`);
} else if (formatted === current) {
	console.log(`✓ ${path.relative(repoRoot, OUT)} already up to date (${summary}).`);
} else {
	fs.writeFileSync(OUT, formatted);
	console.log(`Wrote ${path.relative(repoRoot, OUT)} (${summary}).`);
}
