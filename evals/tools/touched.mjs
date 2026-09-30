// @ts-check
/**
 * The components a change touches, and how their cells moved: the PR-scoped section of the gate report.
 *
 * A changed file belongs to a pattern when it is its API file, one of its contract or typing files, one of
 * its SCSS partials, its story, or lies inside its framework or provider directory; to a CSS-only component
 * when it is its partial or its story. Everything else (docs, tooling, tests) maps to no component.
 */
import path from 'node:path';

import { componentCells } from './dashboard-data.mjs';

/** @param {string} p */
const posix = (p) => p.replace(/\\/g, '/');

/**
 * One path per line, as `git diff --name-only` prints them; blank lines dropped, separators normalised.
 * @param {string} text
 */
export function readChangedFiles(text) {
	return text
		.split('\n')
		.map((l) => posix(l.trim()))
		.filter((l) => l.length > 0);
}

/**
 * @typedef {{ kind: import('../lib/tiers.mjs').Tier, files: string[] }} Touched
 */

/**
 * The components the changed files belong to.
 * @param {import('../lib/inventory.mjs').Inventory} inventory
 * @param {string} root repository root the inventory paths are absolute under
 * @param {string[]} files repository-relative paths
 * @returns {Map<string, Touched>}
 */
export function componentsForFiles(inventory, root, files) {
	const rel = (/** @type {string|null} */ f) => (f ? posix(path.relative(root, f)) : null);
	/** @type {Map<string, Touched>} */
	const out = new Map();
	const add = (
		/** @type {string} */ name,
		/** @type {import('../lib/tiers.mjs').Tier} */ kind,
		/** @type {string} */ file
	) => {
		const hit = out.get(name) ?? { kind, files: [] };
		if (!hit.files.includes(file)) hit.files.push(file);
		out.set(name, hit);
	};
	for (const file of files) {
		for (const p of inventory.patterns) {
			const own = [p.apiFile, ...p.contractFiles, ...p.typingFiles, ...p.scssFiles, p.storyFile].map((f) =>
				rel(f)
			);
			const dirs = [p.patternDir, ...p.providerDirs].map((d) => rel(d)).filter((d) => d !== null);
			if (own.includes(file) || dirs.some((d) => file.startsWith(`${d}/`))) add(p.name, 'pattern', file);
		}
		for (const c of inventory.cssComponents) {
			if (rel(c.scssFile) === file || rel(c.storyFile) === file) add(c.name, c.kind, file);
		}
	}
	return out;
}

/** Every metric result of a run, across its suites. @param {any} run */
const resultsOf = (run) => Object.values(run.suites ?? {}).flatMap((/** @type {any} */ s) => s.results ?? []);

/** @param {number} n */
const f1 = (n) => n.toFixed(1);
/** @param {number} d */
const signed = (d) => (d > 0 ? `+${f1(d)}` : f1(d));

/** Text of a cell on its own: the score, `n/a`, or `—` when unmeasured. @param {{ s: number|null, w: string }} c */
function cellText(c) {
	if (c.s !== null) return f1(c.s);
	return c.w === 'na' ? 'n/a' : '—';
}

/**
 * `80.0 → 100.0 (🔼 +20.0)`, `— → 71.0 (new)`, `n/a`, or `71.0` without a baseline.
 * @param {{ s: number|null, w: string }|undefined} before
 * @param {{ s: number|null, w: string }} after
 * @param {boolean} hasBaseline
 */
function movement(before, after, hasBaseline) {
	const afterText = cellText(after);
	if (!hasBaseline) return afterText;
	const beforeScore = before && before.s !== null ? before.s : null;
	const beforeText = beforeScore === null ? '—' : f1(beforeScore);
	if (after.s === null) return `${beforeText} → ${afterText}`;
	if (beforeScore === null) return `${beforeText} → ${afterText} (new)`;
	const d = Math.round((after.s - beforeScore) * 10) / 10;
	let mark = '0.0';
	if (d > 0) mark = `🔼 ${signed(d)}`;
	if (d < 0) mark = `🔻 ${signed(d)}`;
	return `${beforeText} → ${afterText} (${mark})`;
}

/**
 * The lines of one touched component: its cells before → after, then the hints of the cells that dropped or
 * sit below 80.
 * @param {string} name
 * @param {Touched} t
 * @param {any[]} afterResults
 * @param {any[]|null} beforeResults
 * @param {string[]} heatmapIds
 */
function componentLines(name, t, afterResults, beforeResults, heatmapIds) {
	const cellsAfter = componentCells(afterResults, name, t.kind);
	const cellsBefore = beforeResults ? componentCells(beforeResults, name, t.kind) : {};
	const parts = [];
	const hints = [];
	for (const id of heatmapIds) {
		const a = cellsAfter[id];
		if (!a) continue;
		const b = cellsBefore[id];
		parts.push(`${id} ${movement(b, a, beforeResults !== null)}`);
		if (needsHint(b, a)) hints.push(`- ${id}: ${a.h}`);
	}
	const files = `${t.files.length} ${plural(t.files.length, 'file')}`;
	return [`**${name}** (${t.kind}) — ${files} → ${parts.join(', ')}`, ...hints, ''];
}

/**
 * A cell deserves its hint when it dropped against the baseline or sits below 80.
 * @param {{ s: number|null }|undefined} before
 * @param {{ s: number|null }} after
 */
function needsHint(before, after) {
	if (after.s === null) return false;
	const dropped = Boolean(before) && before.s !== null && after.s < before.s;
	return after.s < 80 || dropped;
}

/** @param {number} n @param {string} word */
const plural = (n, word) => (n === 1 ? word : `${word}s`);

/**
 * Markdown section: each touched component with its heatmap cells before → after, and the hints of the
 * cells that dropped or sit below 80. Empty when nothing maps to a component.
 * @param {Map<string, Touched>} touched
 * @param {any|null} before the baseline run (suites shape), or null
 * @param {any} after this run (suites shape)
 * @param {string[]} heatmapIds eval ids with a per-component column, in display order
 * @param {{ maxComponents?: number }} [options]
 */
export function formatTouchedReport(touched, before, after, heatmapIds, { maxComponents = 12 } = {}) {
	if (touched.size === 0) return '';
	const files = new Set([...touched.values()].flatMap((t) => t.files));
	const afterResults = resultsOf(after);
	const beforeResults = before ? resultsOf(before) : null;
	const baseline = before
		? `before = \`${before.label}\` @ \`${before.sha ?? 'unknown'}\``
		: 'no baseline run to compare with, scores of this run only';
	const names = [...touched.keys()].sort((a, b) => a.localeCompare(b));
	const counts = `${names.length} ${plural(names.length, 'component')} from ${files.size} changed ${plural(files.size, 'file')}`;
	const lines = [
		'### 🧩 Components touched by this pull request',
		'',
		`${counts}; ${baseline}. Cells are the per-component scores of the evals that measure components.`,
		'',
	];
	for (const name of names.slice(0, maxComponents)) {
		lines.push(
			...componentLines(name, /** @type {Touched} */ (touched.get(name)), afterResults, beforeResults, heatmapIds)
		);
	}
	if (names.length > maxComponents) {
		lines.push(`… and ${names.length - maxComponents} more: ${names.slice(maxComponents).join(', ')}.`, '');
	}
	return lines.join('\n').trimEnd();
}
