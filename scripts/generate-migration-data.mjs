#!/usr/bin/env node

/**
 * Generates the data behind the Storybook "Migration" page
 * (stories/Migration.mdx → stories/_helpers/MigrationPage.tsx), which tells app
 * developers how to port custom CSS from the classic (pre-token) theme to the
 * current one — and how to run the same migration with the `osui-theme-migration`
 * skill from a clone of this repo.
 *
 * Source of truth: the skill.
 *
 *   .claude/skills/osui-theme-migration/SKILL.md                     procedure, triage, buckets, phases
 *   .claude/skills/osui-theme-migration/references/variable-mapping.md  retired → replacement tables
 *   .claude/skills/osui-theme-migration/references/widget-catalog.md    framework defaults that changed
 *   .claude/skills/osui-theme-migration/references/recipes.md           "I used to do X"
 *   .claude/skills/osui-theme-migration/references/grey-shades.md       the scale-flip remediation
 *
 * The page is a projection of those files, exactly like THEME-MIGRATION-GUIDE.md
 * (see scripts/sync-migration-guide.mjs). Correct a migration fact in the skill,
 * never here or in the page — then re-run this script. Only the page's prose is
 * hand-written in MigrationPage.tsx.
 *
 * On top of the skill's editorial content, this script computes what only the
 * two CSS surfaces can tell: which `:root` names were actually retired, what each
 * retired or re-valued name used to resolve to and resolves to now (for the
 * colour swatches and counts), and the compatibility snippet. Those come from:
 *
 *   • classic-theme/ODC.OutSystemsUI.css            the pre-migration surface
 *   • dist/ODC.OutSystemsUI.css                     the current surface (needs a build)
 *   • src/scss/tokens/_variables.scss               token fallback chains (npm run build:tokens)
 *   • src/scss/00-abstract/_setup-global-vars.scss  the palette map behind the utility classes
 *
 * and the script fails when the skill and the CSS disagree, which is the point:
 *
 *   1. every `:root` variable the classic bundle declared and the current one
 *      does not must have a replacement row in the skill (plus the palette
 *      expansion) — no gaps, no rows for names that still ship;
 *   2. every `--token-*` the skill names must exist in the token package;
 *   3. the skill's extended-palette rules must match the SCSS map that drives
 *      the shipped `.background-*` / `.text-*` utilities;
 *   4. every re-valued `:root` variable lands in one of the page's tables;
 *   5. `--space-*` must still resolve to its classic values, as the skill says.
 *
 * Writes:
 *   • stories/_helpers/migration-data.ts
 *
 * Run: npm run docs:migration-page            (rewrite)
 *      npm run docs:migration-page -- --check (fail if the data file is stale)
 */

/* eslint-env node */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

const SKILL_DIR = path.join(repoRoot, '.claude', 'skills', 'osui-theme-migration');
const IN = {
	skill: path.join(SKILL_DIR, 'SKILL.md'),
	mapping: path.join(SKILL_DIR, 'references', 'variable-mapping.md'),
	catalog: path.join(SKILL_DIR, 'references', 'widget-catalog.md'),
	recipes: path.join(SKILL_DIR, 'references', 'recipes.md'),
	greyShades: path.join(SKILL_DIR, 'references', 'grey-shades.md'),
	classic: path.join(repoRoot, 'classic-theme', 'ODC.OutSystemsUI.css'),
	current: path.join(repoRoot, 'dist', 'ODC.OutSystemsUI.css'),
	tokens: path.join(repoRoot, 'src', 'scss', 'tokens', '_variables.scss'),
	maps: path.join(repoRoot, 'src', 'scss', '00-abstract', '_setup-global-vars.scss'),
};
const OUT = path.join(repoRoot, 'stories', '_helpers', 'migration-data.ts');

const rel = (f) => path.relative(repoRoot, f);

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
	die(`Cannot read ${rel(file)}. ${hint}`);
}

// `.md` is not in .gitattributes' `eol=lf` list, so normalise on read.
const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

// ═══════════════════════════════════════════════════════════════════════════
// Part 1 — a small Markdown block parser (no dependencies, like the sync script)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Splits Markdown into typed blocks. Inline markup (`code`, **bold**, _em_,
 * [links]) is left as-is in the strings; the page renders it (DocsMarkdown.tsx).
 * Covers what the skill files use: ATX headings, paragraphs, fenced code, flat
 * bullet/numbered lists, pipe tables, blockquotes, `---` rules and HTML comments.
 */
function parseMarkdown(text) {
	const lines = text.split('\n');
	const blocks = [];
	let i = 0;

	const isTableLine = (l) => /^\s*\|.*\|\s*$/.test(l);
	const isListLine = (l) => /^\s*(?:[-*]|\d+\.)\s+/.test(l);
	const isBlank = (l) => l.trim() === '';

	while (i < lines.length) {
		const line = lines[i];

		if (isBlank(line)) {
			i++;
			continue;
		}

		// HTML comment (single or multi-line) — table markers, generator notes.
		if (/^\s*<!--/.test(line)) {
			let text = line;
			while (!/-->\s*$/.test(lines[i]) && i < lines.length - 1) {
				i++;
				text += '\n' + lines[i];
			}
			blocks.push({ type: 'html', text });
			i++;
			continue;
		}

		const fence = line.match(/^\s*```(\w*)\s*$/);
		if (fence) {
			const code = [];
			i++;
			while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) code.push(lines[i++]);
			i++; // closing fence
			blocks.push({ type: 'code', lang: fence[1] || '', code: code.join('\n') });
			continue;
		}

		const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
		if (heading) {
			blocks.push({ type: 'heading', depth: heading[1].length, text: heading[2] });
			i++;
			continue;
		}

		if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
			blocks.push({ type: 'hr' });
			i++;
			continue;
		}

		if (/^\s*>/.test(line)) {
			const quoted = [];
			while (i < lines.length && /^\s*>/.test(lines[i])) quoted.push(lines[i++].replace(/^\s*>\s?/, ''));
			blocks.push({ type: 'quote', text: quoted.join('\n').trim() });
			continue;
		}

		if (isTableLine(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
			const splitRow = (l) =>
				l
					.trim()
					.replace(/^\||\|$/g, '')
					.split(/(?<!\\)\|/)
					.map((c) => c.trim().replace(/\\\|/g, '|'));
			const header = splitRow(line);
			i += 2;
			const rows = [];
			while (i < lines.length && isTableLine(lines[i])) rows.push(splitRow(lines[i++]));
			blocks.push({ type: 'table', header, rows });
			continue;
		}

		if (isListLine(line)) {
			const ordered = /^\s*\d+\./.test(line);
			const items = [];
			while (i < lines.length && (isListLine(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
				if (isListLine(lines[i])) items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''));
				else items[items.length - 1] += ' ' + lines[i].trim();
				i++;
			}
			blocks.push({ type: 'list', ordered, items });
			continue;
		}

		// Paragraph: run until a blank line or the start of another block.
		const para = [];
		while (
			i < lines.length &&
			!isBlank(lines[i]) &&
			!/^\s*```/.test(lines[i]) &&
			!/^#{1,6}\s/.test(lines[i]) &&
			!/^\s*>/.test(lines[i]) &&
			!/^\s*<!--/.test(lines[i]) &&
			!(isTableLine(lines[i]) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) &&
			!isListLine(lines[i])
		) {
			para.push(lines[i++].trim());
		}
		if (para.length) blocks.push({ type: 'paragraph', text: para.join(' ') });
		else i++;
	}
	return blocks;
}

/** YAML-ish frontmatter: only the flat `key: value` lines the skill uses. */
function frontmatter(text) {
	const m = text.match(/^---\n([\s\S]*?)\n---\n/);
	if (!m) return { body: text, meta: {} };
	const meta = {};
	for (const line of m[1].split('\n')) {
		const kv = line.match(/^(\w+):\s*(.*)$/);
		if (kv) meta[kv[1]] = kv[2].trim();
	}
	return { body: text.slice(m[0].length), meta };
}

/** Blocks after the first heading matching `test`, up to the next heading of the same or higher level. */
function section(blocks, test, depth) {
	const start = blocks.findIndex((b) => b.type === 'heading' && (!depth || b.depth === depth) && test(b.text));
	if (start < 0) return null;
	const d = blocks[start].depth;
	const out = [];
	for (let i = start + 1; i < blocks.length; i++) {
		if (blocks[i].type === 'heading' && blocks[i].depth <= d) break;
		out.push(blocks[i]);
	}
	return { heading: blocks[start].text, depth: d, blocks: out };
}

const requireSection = (blocks, test, depth, what, file) => {
	const s = section(blocks, test, depth);
	if (!s) die(`Cannot find the "${what}" section in ${rel(file)} — the page expects it.`);
	return s;
};

const firstOf = (blocks, type) => blocks.find((b) => b.type === type) ?? null;
const requireTable = (blocks, what, file) => {
	const t = firstOf(blocks, 'table');
	if (!t) die(`Cannot find the "${what}" table in ${rel(file)}.`);
	return { header: t.header, rows: t.rows };
};
const firstParagraph = (blocks) => firstOf(blocks, 'paragraph')?.text ?? '';
/** First paragraph, plus the list it introduces when it ends in a colon (Phase 3's summary is that shape). */
const summaryOf = (blocks) => {
	const i = blocks.findIndex((b) => b.type === 'paragraph');
	if (i < 0) return '';
	const text = blocks[i].text;
	const next = blocks[i + 1];
	if (/:$/.test(text) && next?.type === 'list')
		return `${text} ${next.items.map((x) => x.replace(/\.$/, '')).join('; ')}.`;
	return text;
};
/** Drops HTML comments and horizontal rules — the page never renders them. */
const renderable = (blocks) => blocks.filter((b) => b.type !== 'html' && b.type !== 'hr');

/** GitHub-style heading anchor, so links written for the skill's own files line up. */
const slugify = (s) =>
	s
		.toLowerCase()
		.replace(/[`*_"“”]/g, '')
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.trim()
		.replace(/\s+/g, '-');

/** Strips the backticks off a single-code cell: `` `--x` `` → `--x`. */
const code = (cell) => {
	const m = String(cell).match(/^`([^`]+)`$/);
	return m ? m[1] : null;
};

// ═══════════════════════════════════════════════════════════════════════════
// Part 2 — the skill
// ═══════════════════════════════════════════════════════════════════════════

const skillRaw = read(IN.skill);
const { body: skillBody, meta: skillMeta } = frontmatter(skillRaw);
const skillBlocks = parseMarkdown(skillBody);

const numbered = (n) => (t) => new RegExp(`^${n}\\.\\s`).test(t);
const category = (letter) => (t) => new RegExp(`^Category ${letter} —`).test(t);

const s0 = requireSection(skillBlocks, numbered(0), 2, '0. Decide what you are actually fixing', IN.skill);
const s1 = requireSection(skillBlocks, numbered(1), 2, '1. Triage', IN.skill);
const s2 = requireSection(skillBlocks, numbered(2), 2, '2. The breakage categories', IN.skill);
const s5 = requireSection(skillBlocks, numbered(5), 2, '5. New variables', IN.skill);
const s7 = requireSection(skillBlocks, numbered(7), 2, '7. Migration procedure', IN.skill);
const s8 = requireSection(skillBlocks, numbered(8), 2, '8. Same name, new value', IN.skill);
const s12 = requireSection(skillBlocks, numbered(12), 2, '12. What NOT to flag', IN.skill);

const catA = requireSection(s2.blocks, category('A'), 3, 'Category A', IN.skill);
const catB = requireSection(s2.blocks, category('B'), 3, 'Category B', IN.skill);
const catD = requireSection(s2.blocks, category('D'), 3, 'Category D', IN.skill);
const catATables = catA.blocks.filter((b) => b.type === 'table');
if (catATables.length < 2) die(`Category A in ${rel(IN.skill)} should carry the A1 and A2 tables.`);

// The phases and the interactive review steps, each with its first paragraph as the summary.
const phases = [];
for (let i = 0; i < s7.blocks.length; i++) {
	const b = s7.blocks[i];
	if (b.type !== 'heading') continue;
	const phase = b.text.match(/^Phase (\d) — (.*)$/);
	const step = b.text.match(/^Step (2[a-z]) — (.*)$/);
	if (phase && b.depth === 3) {
		const sec = section(s7.blocks.slice(i), () => true, 3);
		phases.push({
			id: `phase-${phase[1]}`,
			n: Number(phase[1]),
			title: phase[2],
			summary: summaryOf(sec.blocks),
			steps: [],
		});
	} else if (step && b.depth === 4 && phases.length) {
		const sec = section(s7.blocks.slice(i), () => true, 4);
		phases
			.at(-1)
			.steps.push({ id: `step-${step[1]}`, label: step[1], title: step[2], summary: summaryOf(sec.blocks) });
	}
}
if (phases.length !== 5)
	die(`Expected five "### Phase N — …" headings in ${rel(IN.skill)} §7, found ${phases.length}.`);

const scope = requireSection(s7.blocks, (t) => /^Scope —/.test(t), 3, 'Scope', IN.skill);
const phase5 = requireSection(s7.blocks, (t) => /^Phase 5 —/.test(t), 3, 'Phase 5', IN.skill);
const manualSteps = requireSection(
	s7.blocks,
	(t) => /^Manual steps/.test(t),
	4,
	'Manual steps outside the stylesheet',
	IN.skill
);

const referencesTable = requireTable(
	skillBlocks.slice(
		0,
		skillBlocks.findIndex((b) => b.type === 'heading' && b.depth === 2)
	),
	'references',
	IN.skill
);

const skill = {
	name: skillMeta.name ?? 'osui-theme-migration',
	description: skillMeta.description ?? '',
	dir: rel(SKILL_DIR),
	references: referencesTable,
	buckets: { intro: firstParagraph(s0.blocks), table: requireTable(s0.blocks, 'buckets', IN.skill) },
	triage: requireTable(s1.blocks, 'triage', IN.skill),
	retiredFamilies: { header: catATables[0].header, rows: catATables[0].rows },
	removedHooks: { header: catATables[1].header, rows: catATables[1].rows },
	legacySelectors: requireTable(catB.blocks, 'legacy selector → knob', IN.skill),
	lineHeight: requireTable(catD.blocks, 'line-height deltas', IN.skill),
	newVariables: requireTable(s5.blocks, 'new variables', IN.skill),
	scopeLocations: requireTable(scope.blocks, 'stylesheet locations', IN.skill),
	phases,
	manualSteps: renderable(manualSteps.blocks),
	writeBack: (() => {
		const t = requireTable(phase5.blocks, 'what you learned → where it goes', IN.skill);
		return { ...t, rows: t.rows.map((r) => r.map((c) => (c === 'this file' ? '`SKILL.md`' : c))) };
	})(),
	sameName: requireTable(s8.blocks, 'same name, new value', IN.skill),
	notToFlag: firstOf(s12.blocks, 'list')?.items ?? [],
};

// ─── variable-mapping.md: the marked tables, keyed by their `<!-- table:ID -->` id ──
const mappingRaw = read(IN.mapping);
const mappingBlocks = parseMarkdown(mappingRaw);
const mappingTables = [];
{
	let title = '';
	let pendingId = null;
	for (const b of mappingBlocks) {
		if (b.type === 'heading') title = b.text;
		const open = b.type === 'html' && b.text.match(/<!-- table:([a-z0-9-]+) -->/);
		if (open) pendingId = open[1];
		if (b.type === 'table' && pendingId) {
			mappingTables.push({ id: pendingId, title, header: b.header, rows: b.rows });
			pendingId = null;
		}
	}
}
const mappingTable = (id) => {
	const t = mappingTables.find((x) => x.id === id);
	if (!t) die(`${rel(IN.mapping)} has no \`<!-- table:${id} -->\` block — the page needs it.`);
	return t;
};
for (const id of [
	'semantic-helpers',
	'shadows',
	'font-sizes',
	'spacing',
	'border-sizes',
	'font-weights',
	'extended-palette-shades',
	'extended-palette-families',
	'semantic-light-shades',
	'border-radius',
	'misc',
])
	mappingTable(id);

// ─── widget-catalog.md: buckets → entries, each with Classic / Now / Restore / Split ──
const catalogBlocks = parseMarkdown(read(IN.catalog));
const shapesList = catalogBlocks.find(
	(b, i) => b.type === 'list' && !catalogBlocks.slice(0, i).some((x) => x.type === 'heading' && x.depth === 2)
);
const catalogBuckets = [];
for (let i = 0; i < catalogBlocks.length; i++) {
	const b = catalogBlocks[i];
	if (b.type !== 'heading' || b.depth !== 2) continue;
	const m = b.text.match(/^(Breaks|Collides|Mixed|Preference)\s*\((\d+)\)$/);
	if (!m)
		die(
			`Unexpected bucket heading "${b.text}" in ${rel(IN.catalog)} — expected "Breaks (N)", "Collides (N)", "Mixed (N)" or "Preference (N)".`
		);
	const sec = section(catalogBlocks.slice(i), () => true, 2);
	const entries = [];
	let intro = '';
	for (let j = 0; j < sec.blocks.length; j++) {
		const x = sec.blocks[j];
		if (x.type === 'paragraph' && !entries.length && !intro) intro = x.text;
		if (x.type !== 'heading' || x.depth !== 3) continue;
		const body = section(sec.blocks.slice(j), () => true, 3).blocks;
		// The four labelled paragraphs are the entry; anything else under the heading
		// (the range slider's long caveats, for instance) is kept as notes, in order.
		const entry = { name: x.text, slug: slugify(x.text), classic: '', now: '', restore: '', split: '', notes: [] };
		for (const p of body) {
			if (p.type !== 'paragraph') continue;
			const field = p.text.match(/^\*\*(Classic|Now|Restore|Split)\*\*\s+—\s+([\s\S]*)$/);
			if (field) entry[field[1].toLowerCase()] = field[2];
			else entry.notes.push(p.text);
		}
		if (!entry.classic || !entry.now || !entry.restore)
			die(
				`Catalog entry "${x.text}" in ${rel(IN.catalog)} is missing a **Classic**, **Now** or **Restore** paragraph.`
			);
		entries.push(entry);
	}
	if (entries.length !== Number(m[2]))
		die(
			`${rel(IN.catalog)}: the "${m[1]}" heading says ${m[2]} entries but ${entries.length} follow it. Fix the count.`
		);
	catalogBuckets.push({ name: m[1], intro, entries });
}
if (catalogBuckets.length !== 4)
	die(`${rel(IN.catalog)} should have exactly four buckets, found ${catalogBuckets.length}.`);
const catalog = { shapes: shapesList?.items ?? [], buckets: catalogBuckets };

// ─── recipes.md: one entry per `### "…"` heading ──
const recipeBlocks = parseMarkdown(read(IN.recipes));
const recipes = [];
for (let i = 0; i < recipeBlocks.length; i++) {
	const b = recipeBlocks[i];
	if (b.type !== 'heading' || b.depth !== 3) continue;
	const sec = section(recipeBlocks.slice(i), () => true, 3);
	recipes.push({
		title: b.text.replace(/^"|"$/g, ''),
		anchor: slugify(b.text),
		slug: `recipe-${slugify(b.text)}`,
		blocks: renderable(sec.blocks),
	});
}
if (!recipes.length) die(`No \`### "…"\` recipes found in ${rel(IN.recipes)}.`);

// ─── grey-shades.md: every `##` section ──
const greyBlocks = parseMarkdown(read(IN.greyShades));
const greyShades = [];
for (let i = 0; i < greyBlocks.length; i++) {
	const b = greyBlocks[i];
	if (b.type !== 'heading' || b.depth !== 2) continue;
	const sec = section(greyBlocks.slice(i), () => true, 2);
	greyShades.push({ title: b.text, slug: `grey-${slugify(b.text)}`, blocks: renderable(sec.blocks) });
}
if (!greyShades.length) die(`No \`##\` sections found in ${rel(IN.greyShades)}.`);

// ═══════════════════════════════════════════════════════════════════════════
// Part 3 — the two CSS surfaces (classic vs current), resolved through the tokens
// ═══════════════════════════════════════════════════════════════════════════

const classicCss = read(IN.classic);
const currentCss = read(IN.current);

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

const byName = (a, b) => a.localeCompare(b, 'en', { numeric: true });
const retired = [...oldVars.keys()].filter((n) => !newVars.has(n)).sort(byName);
const revalued = [...oldVars.keys()].filter((n) => newVars.has(n) && oldVars.get(n) !== newVars.get(n)).sort(byName);
const unchanged = [...oldVars.keys()].filter((n) => newVars.has(n) && oldVars.get(n) === newVars.get(n)).sort(byName);
const added = [...newVars.keys()].filter((n) => !oldVars.has(n)).sort(byName);

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
	if (/^\$token-[a-z0-9-]+$/.test(v)) return resolve(`var(--${v.slice(1)})`, vars, depth + 1);
	const whole = v.match(/^var\(([\s\S]+)\)$/);
	if (whole && splitVar(whole[1])[0].match(/^--[a-z0-9-]+$/)) {
		const [name, fallback] = splitVar(whole[1]);
		if (vars.has(name)) return resolve(vars.get(name), vars, depth + 1);
		if (tokenChains.has(name)) return resolve(tokenChains.get(name), vars, depth + 1);
		return fallback ? resolve(fallback, vars, depth + 1) : v;
	}
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
/** `1.75rem` → `28px` so px-era values compare; leaves everything else alone. */
const toPx = (v) =>
	v === null || v === undefined ? null : /^-?[\d.]+rem$/.test(v) ? `${parseFloat(v) * 16}px` : v === '0' ? '0px' : v;

/**
 * What a replacement from the skill resolves to in the current bundle. A bare
 * `--token-x` / `--color-x` name is read as `var(--name)`; anything else
 * (`none`, `50%`) is a literal.
 */
const replacementLiteral = (to) => toPx(resolve(/^--[a-z0-9-]+$/.test(to) ? `var(${to})` : to, newVars));

/**
 * The literal a hand-written `var(--token-x, <literal>)` needs. The light
 * `--token-*` values are NOT declared at `:root` (SKILL.md, Category A), so a
 * customer-facing snippet must carry the fallback or it is dead in light mode.
 */
const tokenFallback = (token) => {
	if (!tokenChains.has(token)) return null;
	return resolve(tokenChains.get(token), new Map());
};

// ─── Palette map behind the utility classes ─────────────────────────────
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

const extended = extendedMap(mapsSrc);
const SHADES = ['lightest', 'lighter', 'light', '', 'dark', 'darker', 'darkest'];
const shadeVar = (family, shade) => (shade === '' ? `--color-${family}` : `--color-${family}-${shade}`);

// ═══════════════════════════════════════════════════════════════════════════
// Part 4 — reconcile the skill with the CSS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Invariant 3 — the skill's extended-palette rules must describe the SCSS map.
 * The shade table gives `--token-primitives-{family}-NNN` per intermediate shade;
 * the family table gives `lightest` and the bare family per family. Family
 * renames (cyan → aqua/teal, grape → purple) are encoded in those tables.
 */
{
	const shadeRows = mappingTable('extended-palette-shades').rows;
	const shadeStep = {};
	for (const [shade, pattern] of shadeRows) {
		const m = String(pattern).match(/`--token-primitives-\{family\}-(\d+)`/);
		if (m) shadeStep[code(shade)] = m[1];
	}
	for (const s of ['lighter', 'light', 'dark', 'darker', 'darkest'])
		if (!shadeStep[s])
			die(`${rel(IN.mapping)}: the extended-palette-shades table has no primitive step for \`${s}\`.`);

	const familyRows = mappingTable('extended-palette-families').rows;
	const familyRule = new Map(); // family → { lightest, base }
	for (const [families, lightest, base] of familyRows) {
		for (const f of families.split(',').map((x) => x.trim()))
			familyRule.set(f, { lightest: code(lightest), base: code(base) });
	}
	// Primitive family for the intermediate shades: the family itself, unless the family table
	// binds the family to another primitive ramp (cyan → teal is the documented exception).
	const PRIMITIVE_FAMILY = { cyan: 'teal', grape: 'purple' };

	const mismatches = [];
	for (const [family, shades] of extended) {
		const rule = familyRule.get(family);
		if (!rule) {
			mismatches.push(`${family}: not in the extended-palette-families table`);
			continue;
		}
		const expect = (shade) => {
			if (shade === 'lightest') return rule.lightest.replace('{family}', family);
			if (shade === '') return rule.base.replace('{family}', family);
			return `--token-primitives-${PRIMITIVE_FAMILY[family] ?? family}-${shadeStep[shade]}`;
		};
		for (const shade of SHADES) {
			const actual = shades.get(shade);
			if (!actual) {
				mismatches.push(`${shadeVar(family, shade)}: missing from the SCSS map`);
				continue;
			}
			if (actual !== expect(shade))
				mismatches.push(`${shadeVar(family, shade)}: skill says ${expect(shade)}, SCSS map says ${actual}`);
		}
	}
	if (mismatches.length)
		die(
			`The skill's extended-palette tables no longer describe ${rel(IN.maps)}:\n  ${mismatches.join('\n  ')}\nFix the tables in ${rel(IN.mapping)}, then run \`npm run docs:migration\` and this script.`
		);
}

// ─── The retired set the snippet must cover, built from the skill's tables ──
// A1 only: names the classic bundle declared at `:root`. The A2 hooks in the
// `semantic-helpers` table were never declared (read-sites), so they are not in
// the `:root` diff and cannot be revived by a declaration.
const snippetGroups = [];
const addGroup = (id, title, note, rows) => snippetGroups.push({ id, title, note, rows });

const tableRows = (id, toCol = 1) =>
	mappingTable(id)
		.rows.map((r) => ({ name: code(r[0]), to: code(r[toCol]) ?? r[toCol] }))
		.filter((r) => r.name);

addGroup(
	'shadows',
	'Shadows',
	'The new elevations are two-layer shadows — similar, not identical. Four steps, so xs and s collapse.',
	tableRows('shadows')
);
addGroup(
	'font-sizes',
	'Font sizes',
	'h1–h3 are smaller in the new scale; a one-to-one swap changes the rendered size.',
	tableRows('font-sizes')
);
addGroup('border-sizes', 'Border sizes', '', tableRows('border-sizes'));
addGroup(
	'font-weights',
	'Font weights',
	'Word-named, not numeric — `--token-font-weight-400` does not exist.',
	tableRows('font-weights')
);
addGroup(
	'palette',
	'Extended palette shades',
	"Expanded from the skill's shade and family tables; cross-checked against the SCSS map that drives the .background-* / .text-* utilities.",
	[...extended].flatMap(([family, shades]) =>
		SHADES.filter((s) => s !== '' && shades.has(s)).map((s) => ({ name: shadeVar(family, s), to: shades.get(s) }))
	)
);
addGroup('semantic-light', 'Semantic light shades', '', tableRows('semantic-light-shades'));
{
	// `--border-radius-circle` is the one row whose replacement is prose ("use `border-radius: 50%`…").
	const circle = mappingTable('border-radius').rows.find((r) => code(r[0]) === '--border-radius-circle');
	if (!circle || !/Retired/.test(circle[2]))
		die(`${rel(IN.mapping)}: expected \`--border-radius-circle\` to be marked Retired in the border-radius table.`);
	addGroup('radius', 'Border radius', 'The only name with no variable to redirect to — a literal.', [
		{ name: '--border-radius-circle', to: '50%' },
	]);
}
addGroup('misc', 'Other retired names', '', tableRows('misc'));

const covered = snippetGroups.flatMap((g) => g.rows.map((r) => r.name));
const retiredSet = new Set(retired);
const coveredSet = new Set(covered);
const missing = retired.filter((n) => !coveredSet.has(n));
const spurious = covered.filter((n) => !retiredSet.has(n));
const duplicated = covered.filter((n, i) => covered.indexOf(n) !== i);
if (missing.length)
	die(
		`The classic bundle declares ${missing.length} \`:root\` variable(s) the current one does not, and the skill has no replacement row for them:\n  ${missing.join('\n  ')}\nAdd each to a marked table in ${rel(IN.mapping)} (the \`misc\` table takes one-offs).`
	);
if (spurious.length)
	die(
		`The skill lists ${spurious.length} variable(s) as retired that are still declared at \`:root\`:\n  ${spurious.join('\n  ')}`
	);
if (duplicated.length) die(`Duplicate retired-variable rows across the skill's tables:\n  ${duplicated.join('\n  ')}`);

// Invariant 2 — every `--token-*` the skill names exists in the token package.
{
	const named = new Set();
	for (const t of mappingTables)
		for (const r of t.rows)
			for (const c of r) for (const m of String(c).matchAll(/--token-[a-z0-9-]+/g)) named.add(m[0]);
	for (const r of skill.legacySelectors.rows)
		for (const c of r) for (const m of String(c).matchAll(/--token-[a-z0-9-]+/g)) named.add(m[0]);
	// A name ending in `-` is a `{family}` / `{role}` pattern, not a token.
	const ghosts = [...named].filter((t) => !tokenChains.has(t) && !t.endsWith('-')).sort();
	if (ghosts.length)
		die(
			`The skill references token(s) missing from the token package:\n  ${ghosts.join('\n  ')}\nCheck ${rel(IN.tokens)} and fix the row in the skill.`
		);
}

// Invariant 2b — every `--osui-*` knob the skill names is declared or read by the current bundle.
// The widget catalog's "Restore" lines are only as good as the knob names in them: a knob that
// a theming branch renames, or one the skill names before the bundle that ships it is merged,
// would otherwise reach the page as a dead override.
{
	const inBundle = new Set([...currentCss.matchAll(/--osui-[a-z0-9-]+/g)].map((m) => m[0]));
	const named = new Set();
	for (const file of [IN.skill, IN.mapping, IN.catalog, IN.recipes, IN.greyShades])
		for (const m of read(file).matchAll(/--osui-[a-z0-9-]+/g)) named.add(m[0]);
	// A name ending in `-` is a `--osui-{component}-…` pattern, not a knob.
	const ghosts = [...named].filter((k) => !inBundle.has(k) && !k.endsWith('-')).sort();
	if (ghosts.length)
		die(
			`The skill names ${ghosts.length} \`--osui-*\` knob(s) the current bundle neither declares nor reads:\n  ${ghosts.join('\n  ')}\nEither the knob is not shipped yet (merge the branch that adds it, rebuild) or the skill's Restore line is stale.`
		);
}

// Invariant 5 — `--space-*` kept its values (only the plumbing became token-backed), as the skill promises.
{
	const spacing = mappingTable('spacing').rows;
	const drift = [];
	for (const r of spacing) {
		const name = code(r[0]);
		if (!name) continue;
		const o = toPx(oldLiteral(name));
		const n = toPx(newLiteral(name));
		if (o !== n) drift.push(`${name}: ${o} → ${n}`);
	}
	if (drift.length) die(`--space-* values drifted — the skill says they are unchanged:\n  ${drift.join('\n  ')}`);
}

// ─── Resolved values for every name the mapping tables mention (swatches) ──
const values = {};
const noteValue = (name, to) => {
	// `--background-color-neutral-N` and `{family}` rows are patterns, not names.
	if (!name || values[name] || /-N$|\{/.test(name) || (to && /-N$|\{/.test(to))) return;
	values[name] = {
		old: toPx(oldLiteral(name)),
		now: to && /^(--[a-z0-9-]+|none|50%|transparent)$/.test(to) ? replacementLiteral(to) : null,
	};
};
for (const g of snippetGroups) for (const r of g.rows) noteValue(r.name, r.to);
for (const t of mappingTables) for (const r of t.rows) noteValue(code(r[0]), code(r[1]));
for (const r of skill.sameName.rows) noteValue(code(r[0]), null);
for (const name of revalued) noteValue(name, null);
for (const name of Object.keys(values))
	if (values[name].now === null && newVars.has(name)) values[name].now = toPx(newLiteral(name));

// ─── Re-valued names, bucketed for the page's tables (invariant 4) ──
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

// ─── Removed read hooks (A2) — read-sites, so the `:root` diff misses them ──
const HOOK_PREFIXES = ['--background-color-', '--text-color-', '--border-color-'];
const hookNames = (css) =>
	new Set([...css.matchAll(/var\((--(?:background|text|border)-color-[a-z0-9-]+)/g)].map((m) => m[1]));
const oldHooks = hookNames(classicCss);
const newHooks = hookNames(currentCss);
const hooks = HOOK_PREFIXES.map((prefix) => {
	const names = [...oldHooks].filter((n) => n.startsWith(prefix)).sort(byName);
	return {
		prefix,
		retired: names.filter((n) => !newHooks.has(n)).length,
		kept: names.filter((n) => newHooks.has(n)),
	};
});
{
	// The skill names the three surviving hooks explicitly; keep it honest.
	const keptBg = hooks.find((h) => h.prefix === '--background-color-').kept;
	const prose = mappingRaw.split('<!-- table:semantic-helpers -->')[0];
	const notMentioned = keptBg.filter((k) => !prose.includes(`\`${k}\``));
	if (notMentioned.length)
		die(
			`The current bundle still reads ${notMentioned.join(', ')} but ${rel(IN.mapping)} does not list them as surviving hooks.`
		);
}

// ─── Palette grid + typography/body facts ──
const tokenLiteral = (token) => (tokenChains.has(token) ? toPx(resolve(tokenChains.get(token), newVars)) : null);
const palette = [...extended].map(([family, shades]) => ({
	family,
	old: SHADES.map((s) => toPx(oldLiteral(shadeVar(family, s))) ?? '—'),
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

// ─── Compatibility snippet — every A1 name, each with the literal fallback the skill insists on ──
const snippetValue = (to) => {
	if (/^--token-/.test(to)) {
		const fb = tokenFallback(to);
		if (fb === null || fb === undefined) die(`No fallback chain for ${to} in ${rel(IN.tokens)}.`);
		return `var(${to}, ${fb})`;
	}
	if (/^--/.test(to)) return `var(${to})`; // theme-layer roles are declared at :root
	return to;
};
const snippetLines = [':root {'];
snippetGroups.forEach((g, i) => {
	if (i > 0) snippetLines.push('');
	snippetLines.push(`\t/* ${g.title} */`);
	for (const r of g.rows) snippetLines.push(`\t${r.name}: ${snippetValue(r.to)};`);
});
snippetLines.push('}');

// ═══════════════════════════════════════════════════════════════════════════
// Part 4b — reader voice
// ═══════════════════════════════════════════════════════════════════════════

/**
 * The skill addresses an agent working on a customer's CSS from inside this
 * repo. The Storybook page addresses that customer directly — a low-code
 * developer looking at their own app, with no checkout of the repo. Rendered
 * verbatim, the references would say "the customer's CSS" and point at
 * `dist/`, so every string headed for the page goes through this pass. Code
 * blocks, the snippet and the skill's trigger description are left alone.
 *
 * Specific phrasings first (they fix verb agreement), then the generic ones.
 */
const VOICE = [
	// phrasings where the generic swap would break the grammar
	['scale-flip customers want', 'people who flipped the scale want'],
	['what a customer reports', 'what gets reported'],
	['A customer rule like', 'A rule of yours like'],
	['the customer reports "', 'you report "'],
	['the customer never chose and has never seen', 'you never chose and have never seen'],
	['if a customer needs', 'if you need'],
	['If the customer declares', 'If you declare'],
	['If the customer prefers', 'If you prefer'],
	['the customer infers them', 'you infer them'],
	['reason a customer reports', 'reason people report'],
	['you find a customer rule that', 'you find one of your rules that'],
	['unless the customer asks', 'if you want it'],
	['In many customer palettes', 'In many app palettes'],
	['customer CSS', 'custom CSS'],
	// generic
	["The customer's", 'Your'],
	["the customer's", 'your'],
	['Customers', 'People'],
	['customers', 'people'],
	['the customer', 'you'],
	['a customer', 'you'],
	// the skill's own files and section numbers → the page sections that carry the same content.
	// Linked forms first, so the code-span rules below never land inside an existing link.
	[
		'[`references/variable-mapping.md`](references/variable-mapping.md)',
		'the [retired-variable tables](page:#retired)',
	],
	['[`references/widget-catalog.md`](references/widget-catalog.md)', 'the [widget catalog](page:#defaults)'],
	['[`references/grey-shades.md`](references/grey-shades.md)', 'the [grey-shades remediation](page:#dark-grey)'],
	['[`references/recipes.md`](references/recipes.md)', 'the [recipes](page:#recipes)'],
	['See Section 6.', 'See [Dark theme](page:#dark).'],
	['(mapping in `references/variable-mapping.md`)', '(mapped below)'],
	['(semantic shades in `references/variable-mapping.md`)', '([semantic light shades](page:#retired))'],
	['`references/variable-mapping.md` extended palette', 'the [extended palette](page:#palette) table'],
	['`references/variable-mapping.md`', 'the [retired-variable tables](page:#retired)'],
	['`references/widget-catalog.md`', 'the [widget catalog](page:#defaults)'],
	['`references/grey-shades.md`', 'the [grey-shades remediation](page:#dark-grey)'],
	['`references/recipes.md`', 'the [recipes](page:#recipes)'],
	['Section 8 (Category F)', '[Same name, new value](page:#revalued)'],
	['`src/scss/`', 'the **CSS API Reference** page'],
	// pointers into the procedure → the page section that carries the same check
	['(`SKILL.md` § 2)', '(the two-block check under [Dark theme](page:#dark))'],
	['in `SKILL.md` § 2', 'described under [Dark theme](page:#dark)'],
];

function readerVoice(text) {
	let out = text;
	for (const [from, to] of VOICE) out = out.split(from).join(to);
	return out;
}

/** The bundles a developer can save from their own app (browser Network panel) — applied to code blocks too. */
const PATHS = [
	['classic-theme/ODC.OutSystemsUI.css', 'old/ODC.OutSystemsUI.css'],
	['dist/ODC.OutSystemsUI.css', 'new/ODC.OutSystemsUI.css'],
];
const readerPaths = (text) => PATHS.reduce((out, [from, to]) => out.split(from).join(to), text);

/** Applies readerVoice to every string in the tree except code (paths only) and the skill's own description. */
function voiceDeep(value, key = '') {
	// The references table describes the skill to a high-code reader; it keeps the agent's voice.
	if (key === 'references') return value;
	if (typeof value === 'string') {
		if (key === 'snippet' || key === 'description') return value;
		return key === 'code' ? readerPaths(value) : readerPaths(readerVoice(value));
	}
	if (Array.isArray(value)) return value.map((v) => voiceDeep(v, key));
	if (value && typeof value === 'object')
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, voiceDeep(v, k)]));
	return value;
}

// ═══════════════════════════════════════════════════════════════════════════
// Part 5 — emit
// ═══════════════════════════════════════════════════════════════════════════

const data = voiceDeep({
	skill,
	mapping: { tables: mappingTables },
	catalog,
	recipes,
	greyShades,
	computed: {
		counts: {
			classicRoot: oldVars.size,
			retired: retired.length,
			revalued: revalued.length,
			unchanged: unchanged.length,
			added: added.length,
			hooksRetired: hooks.reduce((n, h) => n + h.retired, 0),
			catalogEntries: catalogBuckets.reduce((n, b) => n + b.entries.length, 0),
			recipes: recipes.length,
		},
		values,
		retiredGroups: snippetGroups.map((g) => ({
			id: g.id,
			title: g.title,
			note: g.note,
			rows: g.rows.map((r) => ({
				name: r.name,
				old: toPx(oldLiteral(r.name)),
				to: r.to,
				now: replacementLiteral(r.to),
			})),
		})),
		revalued: buckets,
		hooks,
		palette,
		shades: SHADES.map((s) => s || 'base'),
		headings,
		body,
		snippet: snippetLines.join('\n'),
	},
});

const source = [
	'// Generated by scripts/generate-migration-data.mjs — do not edit by hand.',
	'// Regenerate: npm run docs:migration-page (needs a build + npm run build:tokens first).',
	'// Source of truth: .claude/skills/osui-theme-migration/ — fix migration facts there.',
	'',
	'// Everything is readonly: the data is emitted `as const`.',
	'export type MdBlock =',
	"\t| { readonly type: 'heading'; readonly depth: number; readonly text: string }",
	"\t| { readonly type: 'paragraph'; readonly text: string }",
	"\t| { readonly type: 'code'; readonly lang: string; readonly code: string }",
	"\t| { readonly type: 'list'; readonly ordered: boolean; readonly items: readonly string[] }",
	"\t| { readonly type: 'table'; readonly header: readonly string[]; readonly rows: readonly (readonly string[])[] }",
	"\t| { readonly type: 'quote'; readonly text: string };",
	'export type MdTable = { readonly header: readonly string[]; readonly rows: readonly (readonly string[])[] };',
	'export type MappingTable = MdTable & { readonly id: string; readonly title: string };',
	'export type CatalogEntry = {',
	'\treadonly name: string;',
	'\treadonly slug: string;',
	'\treadonly classic: string;',
	'\treadonly now: string;',
	'\treadonly restore: string;',
	'\treadonly split: string;',
	'\treadonly notes: readonly string[];',
	'};',
	'export type CatalogBucket = { readonly name: string; readonly intro: string; readonly entries: readonly CatalogEntry[] };',
	'export type Recipe = { readonly title: string; readonly anchor: string; readonly slug: string; readonly blocks: readonly MdBlock[] };',
	'export type GreySection = { readonly title: string; readonly slug: string; readonly blocks: readonly MdBlock[] };',
	'export type PhaseStep = { readonly id: string; readonly label: string; readonly title: string; readonly summary: string };',
	'export type Phase = {',
	'\treadonly id: string;',
	'\treadonly n: number;',
	'\treadonly title: string;',
	'\treadonly summary: string;',
	'\treadonly steps: readonly PhaseStep[];',
	'};',
	'export type MigrationRow = { readonly name: string; readonly old: string | null; readonly to: string; readonly now: string | null };',
	'export type MigrationGroup = { readonly id: string; readonly title: string; readonly note: string; readonly rows: readonly MigrationRow[] };',
	'export type RevaluedRow = { readonly name: string; readonly old: string | null; readonly now: string | null; readonly expr: string };',
	'export type MigrationValue = { readonly old: string | null; readonly now: string | null };',
	'',
	`export const MIGRATION_DATA = ${JSON.stringify(data, null, '\t')} as const;`,
	'',
].join('\n');

const prettierConfig = await prettier.resolveConfig(OUT);
const formatted = await prettier.format(source, { ...prettierConfig, filepath: OUT });
const current = fs.existsSync(OUT) ? read(OUT) : '';
const summary = `${retired.length} retired, ${revalued.length} re-valued, ${unchanged.length} unchanged, ${added.length} added; ${data.computed.counts.catalogEntries} catalog entries, ${recipes.length} recipes`;

if (CHECK) {
	if (formatted !== current)
		die(`${rel(OUT)} is out of date.\n  Run \`npm run docs:migration-page\` and commit the result.`);
	console.log(`✓ ${rel(OUT)} is up to date (${summary}).`);
} else if (formatted === current) {
	console.log(`✓ ${rel(OUT)} already up to date (${summary}).`);
} else {
	fs.writeFileSync(OUT, formatted);
	console.log(`Wrote ${rel(OUT)} (${summary}).`);
}
