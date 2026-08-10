#!/usr/bin/env node
/**
 * Regenerates the derived data on the Storybook "Migration" page
 * (`stories/Migration.mdx`), which tells app developers how to port custom CSS
 * from the pre-token OutSystems UI theme to the current one.
 *
 * Only the marked regions are rewritten — the prose (triage, recipes, callouts)
 * is hand-written and left alone. Each region is delimited by a comment pair:
 *
 *     <generated:stats> … </generated:stats>
 *
 * Run:  `npm run docs:migration`            (rewrite)
 *       `npm run docs:migration -- --check` (CI: fail if the page is stale)
 *
 * Why a generator: the page's numbers, colour swatches, value tables and the
 * compatibility snippet are all *derived* — computed by diffing the Phase 0 CSS
 * snapshot against the current bundle and resolving the result through the
 * generated design tokens. A tokens bump silently invalidates them (v1.4.1
 * re-based the whole neutral ramp), and a stale migration guide is worse than
 * none. This script also enforces two invariants that are easy to break by
 * hand:
 *
 *   1. the compatibility snippet covers EXACTLY the set of retired variables —
 *      no gaps, no entries for variables that still exist;
 *   2. every `--token-*` the page names actually exists in the token package.
 *
 * Inputs (all read-only):
 *   deprecated/ODC.OutSystemsUI.css        the pre-migration surface (Phase 0)
 *   dist/ODC.OutSystemsUI.css              the current surface (needs a build)
 *   src/scss/tokens/_root.scss             token literals (generated, gitignored)
 *   src/scss/00-abstract/_setup-global-vars.scss   palette maps
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

const IN = {
	old: path.join(repoRoot, 'deprecated', 'ODC.OutSystemsUI.css'),
	current: path.join(repoRoot, 'dist', 'ODC.OutSystemsUI.css'),
	tokens: path.join(repoRoot, 'src', 'scss', 'tokens', '_root.scss'),
	maps: path.join(repoRoot, 'src', 'scss', '00-abstract', '_setup-global-vars.scss'),
};
const OUT = path.join(repoRoot, 'stories', 'Migration.mdx');

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

const oldVars = rootVars(read(IN.old));
const newVars = rootVars(read(IN.current));

const retired = [...oldVars.keys()].filter((n) => !newVars.has(n)).sort();
const revalued = [...oldVars.keys()].filter((n) => newVars.has(n) && oldVars.get(n) !== newVars.get(n)).sort();
const unchanged = [...oldVars.keys()].filter((n) => newVars.has(n) && oldVars.get(n) === newVars.get(n)).sort();

// ── Resolve a token to its literal value ────────────────────────────────────
const tokenLiterals = new Map(
	[...read(IN.tokens).matchAll(/(--token-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])
);

/** Follow a `var(--token-x, var(--token-y, #hex))` chain down to its literal. */
function resolve(value, depth = 0) {
	const v = String(value).trim();
	if (depth > 10) return v;
	const m = v.match(/^var\((--token-[a-z0-9-]+)(?:,\s*([\s\S]+))?\)$/);
	if (!m) return v;
	if (tokenLiterals.has(m[1])) return resolve(tokenLiterals.get(m[1]), depth + 1);
	return m[2] ? resolve(m[2], depth + 1) : v;
}
const literalOf = (token) => (tokenLiterals.has(token) ? resolve(tokenLiterals.get(token)) : null);

// ── Parse the palette maps that drive the utility classes ───────────────────
/** `$osui-colors-extended` → { family: { shade: '--token-…' } }; '' = base shade. */
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

/** A simple `'key' variables.$token-…` list, e.g. `$osui-colors-neutral`. */
function simpleMap(scss, name) {
	const block = scss.split(`${name}:`)[1].split(';')[0];
	return new Map([...block.matchAll(/'([a-z0-9-]+)'\s+variables\.\$(token-[a-z0-9-]+)/g)].map((m) => [m[1], `--${m[2]}`]));
}

// The `--osui-*` count is owned by the sibling generator's output, so the two
// pages can't disagree about the size of the component CSS API.
const cssApiRef = path.join(repoRoot, 'docs', 'css-api-reference.md');
const osuiKnobs = fs.existsSync(cssApiRef) ? (read(cssApiRef).match(/^\| `--osui-/gm) ?? []).length : null;
if (!osuiKnobs) die('Cannot count --osui-* properties. Run `npm run docs:css-api` first.');

const mapsSrc = read(IN.maps);
const extended = extendedMap(mapsSrc);
const neutralUtils = simpleMap(mapsSrc, '$osui-colors-neutral');
const semanticUtils = simpleMap(mapsSrc, '$osui-colors-semantic');

const SHADES = ['lightest', 'lighter', 'light', '', 'dark', 'darker', 'darkest'];

// ── The replacement mapping (the editorial decision, kept in one place) ──────
// Palette entries are derived from `$osui-colors-extended` above so the page,
// the snippet and the `.background-*` utility classes can never disagree.
const paletteMapping = [];
for (const [family, shades] of extended) {
	for (const shade of SHADES) {
		if (!shades.has(shade)) continue;
		paletteMapping.push([shade === '' ? `--color-${family}` : `--color-${family}-${shade}`, `var(${shades.get(shade)})`]);
	}
}

const MAPPING = [
	[
		'Spacing',
		[
			['--space-none', 'var(--token-scale-0)'],
			['--space-xs', 'var(--token-scale-100)'],
			['--space-s', 'var(--token-scale-200)'],
			['--space-base', 'var(--token-scale-400)'],
			['--space-m', 'var(--token-scale-600)'],
			['--space-l', 'var(--token-scale-800)'],
			['--space-xl', 'var(--token-scale-1000)'],
			['--space-xxl', 'var(--token-scale-1200)'],
		],
	],
	[
		'Typography',
		[
			['--font-size-display', 'var(--token-font-size-900)'],
			['--font-size-h1', 'var(--token-font-size-800)'],
			['--font-size-h2', 'var(--token-font-size-700)'],
			['--font-size-h3', 'var(--token-font-size-650)'],
			['--font-size-h4', 'var(--token-font-size-550)'],
			['--font-size-h5', 'var(--token-font-size-500)'],
			['--font-size-h6', 'var(--token-font-size-450)'],
			['--font-size-base', 'var(--token-font-size-400)'],
			['--font-size-s', 'var(--token-font-size-350)'],
			['--font-size-xs', 'var(--token-font-size-300)'],
			['--font-size-label', 'var(--token-font-size-275)'],
			['--font-light', 'var(--token-font-weight-light)'],
			['--font-regular', 'var(--token-font-weight-regular)'],
			['--font-semi-bold', 'var(--token-font-weight-semi-bold)'],
			['--font-bold', 'var(--token-font-weight-bold)'],
		],
	],
	[
		'Elevation',
		[
			['--shadow-none', 'none'],
			['--shadow-xs', 'var(--token-elevation-1)'],
			['--shadow-s', 'var(--token-elevation-1)'],
			['--shadow-m', 'var(--token-elevation-2)'],
			['--shadow-l', 'var(--token-elevation-3)'],
			['--shadow-xl', 'var(--token-elevation-4)'],
		],
	],
	[
		'Borders',
		[
			['--border-size-none', 'var(--token-border-size-0)'],
			['--border-size-s', 'var(--token-border-size-025)'],
			['--border-size-m', 'var(--token-border-size-050)'],
			['--border-size-l', 'var(--token-border-size-075)'],
			['--border-radius-circle', '50%'],
		],
	],
	['Extended palette', paletteMapping],
	[
		'Semantic light shades + retired one-offs',
		[
			['--color-error-light', 'var(--token-semantics-danger-100)'],
			['--color-warning-light', 'var(--token-semantics-warning-100)'],
			['--color-success-light', 'var(--token-semantics-success-100)'],
			['--color-info-light', 'var(--token-semantics-info-100)'],
			['--color-primary-lightest', 'var(--token-bg-primary-subtle-default)'],
			['--color-focus-inner', 'var(--color-neutral-10)'],
		],
	],
	[
		'Layout sizes',
		[
			['--header-size', 'var(--size-header)'],
			['--header-size-content', 'var(--size-header-content)'],
			['--side-menu-size', 'var(--size-side-menu)'],
			['--bottom-bar-size', 'var(--size-bottom-bar)'],
			['--footer-height', 'var(--size-footer)'],
			['--header-color', 'var(--color-background-header)'],
		],
	],
	[
		'Z-index layers',
		[
			['--layer-global-screen', 'var(--layer-screen)'],
			['--layer-global-elevated', 'var(--layer-elevated)'],
			['--layer-global-navigation', 'var(--layer-navigation)'],
			['--layer-global-off-canvas', 'var(--layer-off-canvas)'],
			['--layer-global-instant-interaction', 'var(--layer-instant-interaction)'],
		],
	],
	['Overlay', [['--overlay-background', 'var(--token-backdrop)']]],
];

// Variables the page calls out individually in the "Same name, new value"
// table. Curated (the full changed set includes radius/layer entries that have
// their own sections), but validated below against the real diff.
const REVALUED_ROWS = [
	['--color-primary', ''],
	['--color-primary-hover', ''],
	['--color-primary-selected', '— **now solid, not translucent**'],
	['--color-secondary', ''],
	['--color-error', ''],
	['--color-warning', ''],
	['--color-success', ''],
	['--color-info', '— info is now blue-primary'],
	['--color-background-body', ''],
	['--color-background-login', ''],
	['--color-focus-outer', ''],
];
const REVALUED_OVERRIDE = new Map([['--color-focus-outer', 'primary halo at 22%']]);

// ── Invariants ──────────────────────────────────────────────────────────────
const covered = MAPPING.flatMap(([, rows]) => rows.map(([name]) => name));
const coveredSet = new Set(covered);
const retiredSet = new Set(retired);

const missing = retired.filter((n) => !coveredSet.has(n));
const spurious = covered.filter((n) => !retiredSet.has(n));
const duplicated = covered.filter((n, i) => covered.indexOf(n) !== i);

if (missing.length) die(`The compatibility snippet is missing ${missing.length} retired variable(s):\n  ${missing.join('\n  ')}`);
if (spurious.length)
	die(`The compatibility snippet maps ${spurious.length} variable(s) that are NOT retired (they still ship):\n  ${spurious.join('\n  ')}`);
if (duplicated.length) die(`Duplicate entries in the mapping:\n  ${duplicated.join('\n  ')}`);

const staleRows = REVALUED_ROWS.map(([n]) => n).filter((n) => !revalued.includes(n));
if (staleRows.length)
	die(`"Same name, new value" lists variable(s) whose value no longer differs from the old theme:\n  ${staleRows.join('\n  ')}`);

// Every token named by the mapping must exist in the token package.
const referencedTokens = new Set();
for (const [, rows] of MAPPING) {
	for (const [, value] of rows) {
		for (const t of String(value).matchAll(/--token-[a-z0-9-]+/g)) referencedTokens.add(t[0]);
	}
}
const ghosts = [...referencedTokens].filter((t) => !tokenLiterals.has(t)).sort();
if (ghosts.length) die(`The mapping references ${ghosts.length} token(s) that do not exist in the token package:\n  ${ghosts.join('\n  ')}`);

// ── Region builders ─────────────────────────────────────────────────────────
const oldHex = (name) => oldVars.get(name) ?? '—';
const newHex = (name) => resolve(newVars.get(name) ?? '') || '—';

function buildStats() {
	return [
		`\t\t<Stat n="${retired.length}" label="root variables retired" accent="#d82424" />`,
		`\t\t<Stat n="${revalued.length}" label="kept, but resolve to a new value" accent="#f0b429" />`,
		`\t\t<Stat n="${unchanged.length}" label="kept, byte-identical" accent="#1ba433" />`,
		`\t\t<Stat n="${osuiKnobs}" label={'new --osui-* component knobs'} accent="#105cef" />`,
	];
}

function buildPalette() {
	const lines = [];
	for (const [family, shades] of extended) {
		const olds = SHADES.map((s) => oldHex(s === '' ? `--color-${family}` : `--color-${family}-${s}`));
		const news = SHADES.map((s) => literalOf(shades.get(s)) ?? '—');
		lines.push('\t[');
		lines.push(`\t\t'${family}',`);
		lines.push(`\t\t[${olds.map((h) => `'${h}'`).join(', ')}],`);
		lines.push(`\t\t[${news.map((h) => `'${h}'`).join(', ')}],`);
		lines.push('\t],');
	}
	return lines;
}

function buildSnippet() {
	// Emits the fenced block too, so the markers can sit outside the fence
	// (a marker inside would render as CSS in the copy-able snippet).
	const lines = ['', '```css', ':root {'];
	MAPPING.forEach(([title, rows], i) => {
		if (i > 0) lines.push('');
		lines.push(`\t/* ${title} */`);
		for (const [name, value] of rows) lines.push(`\t${name}: ${value};`);
	});
	lines.push('}', '```', '');
	return lines;
}

function buildRevalued() {
	const lines = ['| Variable | Old | Now resolves to |', '|---|---|---|'];
	for (const [name, note] of REVALUED_ROWS) {
		const now = REVALUED_OVERRIDE.get(name) ?? `\`${newHex(name)}\``;
		lines.push(`| \`${name}\` | \`${oldHex(name)}\` | ${now}${note ? ` ${note}` : ''} |`);
	}
	return lines;
}

function buildNeutral() {
	const lines = ['| Variable | Old | Now | `.text-neutral-N` class |', '|---|---|---|---|'];
	for (let i = 0; i <= 10; i++) {
		const name = `--color-neutral-${i}`;
		const util = literalOf(neutralUtils.get(String(i))) ?? '—';
		const now = newHex(name);
		// The one that bites: the variable and the utility class no longer agree.
		const emph = now !== util && i === 0 ? `**\`${now}\`**` : `\`${now}\``;
		lines.push(`| \`${name}\` | \`${oldHex(name)}\` | ${emph} | \`${util}\` |`);
	}
	return lines;
}

function buildSemanticLight() {
	const lines = ['| Retired | Old | Replacement | New value |', '|---|---|---|---|'];
	for (const key of ['error-light', 'warning-light', 'success-light', 'info-light']) {
		const token = semanticUtils.get(key);
		lines.push(`| \`--color-${key}\` | \`${oldHex(`--color-${key}`)}\` | \`${token}\` | \`${literalOf(token) ?? '—'}\` |`);
	}
	return lines;
}

const REGIONS = {
	stats: buildStats(),
	palette: buildPalette(),
	snippet: buildSnippet(),
	revalued: buildRevalued(),
	neutral: buildNeutral(),
	'semantic-light': buildSemanticLight(),
};

// ── Splice the regions into the page ────────────────────────────────────────
function replaceRegion(src, id, body) {
	const open = new RegExp(`^.*<generated:${id}>.*$`, 'm');
	const close = new RegExp(`^.*</generated:${id}>.*$`, 'm');
	const o = src.match(open);
	const c = src.match(close);
	if (!o || !c) die(`Missing <generated:${id}> … </generated:${id}> markers in ${path.relative(repoRoot, OUT)}.`);
	const start = o.index + o[0].length;
	const end = c.index;
	if (end < start) die(`Markers for <generated:${id}> are in the wrong order.`);
	return src.slice(0, start) + '\n' + body.join('\n') + '\n' + src.slice(end);
}

let page = read(OUT);
for (const [id, body] of Object.entries(REGIONS)) page = replaceRegion(page, id, body);

// Every concrete token the finished page names must exist — catches typos in
// the prose tables too, not just in the mapping above. Placeholder forms the
// prose uses to describe a family (`--token-scale-*`, `--token-bg-{role}-…`)
// are not real names, so they are skipped.
const isPlaceholder = (match, next) => match.endsWith('-') && (next === '*' || next === '{');
const pageGhosts = [
	...new Set(
		[...page.matchAll(/--token-[a-z0-9-]+/g)]
			.filter((m) => !isPlaceholder(m[0], page[m.index + m[0].length]))
			.map((m) => m[0])
	),
]
	.filter((t) => !tokenLiterals.has(t))
	.sort();
if (pageGhosts.length)
	die(`The page names ${pageGhosts.length} token(s) that do not exist in the token package:\n  ${pageGhosts.join('\n  ')}`);

// The prose quotes these counts in several places ("all 136 retired variables",
// "460 of them"). They live in hand-written sentences, so they can't be spliced
// — assert them instead, and say exactly where to fix.
const COUNT_CLAIMS = [
	[/(\d+)\s+(?:retired variables|retired names|declarations)/g, retired.length, 'retired variables'],
	[/(\d+)\s+(?:knobs|of them)/g, osuiKnobs, '--osui-* properties'],
	[/(\d+)\s+×\s+`--osui-/g, osuiKnobs, '--osui-* properties'],
];
const wrongCounts = [];
for (const [re, expected, what] of COUNT_CLAIMS) {
	for (const m of page.matchAll(re)) {
		if (Number(m[1]) !== expected) wrongCounts.push(`"${m[0].trim()}" — there are ${expected} ${what}`);
	}
}
if (wrongCounts.length)
	die(
		`The prose quotes counts that no longer match the data:\n  ${wrongCounts.join('\n  ')}\n` +
			`  These are hand-written sentences — update them in ${path.relative(repoRoot, OUT)}.`
	);

const prettierConfig = await prettier.resolveConfig(OUT);
page = await prettier.format(page, { ...prettierConfig, filepath: OUT });

const current = read(OUT);
if (CHECK) {
	if (page !== current) {
		die(
			`${path.relative(repoRoot, OUT)} is out of date.\n  Run \`npm run docs:migration\` and commit the result.`
		);
	}
	console.log(`✓ ${path.relative(repoRoot, OUT)} is up to date (${retired.length} retired, ${revalued.length} re-valued).`);
} else {
	if (page === current) {
		console.log(`✓ ${path.relative(repoRoot, OUT)} already up to date (${retired.length} retired, ${revalued.length} re-valued).`);
	} else {
		fs.writeFileSync(OUT, page);
		console.log(`Wrote ${path.relative(repoRoot, OUT)}: ${retired.length} retired, ${revalued.length} re-valued, ${unchanged.length} unchanged.`);
	}
}

// Reviewed and deliberately not given their own row: these five only changed
// because the layer vars they point at were renamed (--layer-global-off-canvas
// → --layer-off-canvas). Both the rename and the z-index step change (5 → 100)
// are already covered under "Layout, layers & misc".
const ACKNOWLEDGED_REVALUED = new Set([
	'--osui-bottom-sheet-layer',
	'--osui-menu-layer',
	'--osui-notification-layer',
	'--osui-popup-layer',
	'--osui-sidebar-layer',
]);

// Advisory: a re-valued variable nobody mentions is a silent visual change.
const unmentioned = revalued
	.filter((n) => !ACKNOWLEDGED_REVALUED.has(n))
	.filter((n) => !new RegExp(`\\${n}(?![\\w-])`).test(current));
if (unmentioned.length) {
	console.warn(
		`\n⚠ ${unmentioned.length} variable(s) changed value but are not mentioned anywhere on the page:\n  ${unmentioned.join('\n  ')}\n  Add them to a section (or to REVALUED_ROWS) if the change is user-visible.`
	);
}
