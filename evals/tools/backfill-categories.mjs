#!/usr/bin/env node
// @ts-check
/**
 * Recomputes the two category indices (component / platform) for every recorded run from its result file,
 * under the current universe (snapshot, registry, inventory), and writes them into results/history.json and
 * the run files as `categories`. The old `tiers` field is removed. Idempotent.
 *
 *   node evals/tools/backfill-categories.mjs      (npm run evals:history:categories)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from '../lib/context.mjs';
import { insideDir } from '../lib/paths.mjs';
import { registry } from '../lib/registry.mjs';
import { categorySummary, normalizeHistoryEntry, normalizeRun } from '../lib/results.mjs';
import { buildUniverse, rowIndex, rowsForResult } from '../lib/universe.mjs';
import { flattenBlocks, isComposable } from '../model/lib/snapshot.mjs';
import { SUITES } from '../suites.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const evalsDir = path.resolve(here, '..');

/** @param {string} a @param {string} b */
const byCodePoint = (a, b) => (a < b ? -1 : Number(a > b));

/**
 * @param {import('../lib/results.mjs').HistoryEntry[]} history
 * @param {(label: string) => any|null} readRun the run file of a label, or null when absent
 * @param {import('../lib/universe.mjs').Row[]} universe
 * @param {{ ignore?: Set<string> }} [options] row names never reported as dropped (blocks that are not composable)
 */
export function backfillCategories(history, readRun, universe, options = {}) {
	const ignore = options.ignore ?? new Set();
	const index = rowIndex(universe);
	/** @type {string[]} */
	const missing = [];
	/** @type {{ label: string, suite: string, names: string[] }[]} */
	const dropped = [];
	/** @type {Record<string, any>} */
	const runs = {};
	const out = history.map((raw) => {
		const entry = normalizeHistoryEntry(raw);
		const file = readRun(entry.label);
		if (!file) {
			missing.push(entry.label);
			return { ...entry, suites: withoutTiers(entry.suites) };
		}
		const run = normalizeRun(file);
		/** @type {Record<string, any>} */
		const suites = {};
		for (const [id, s] of Object.entries(entry.suites)) {
			const rest = withoutTiersField(/** @type {any} */ (s));
			const suite = SUITES.find((x) => x.id === id);
			const runSuite = run.suites[id];
			if (!suite || !runSuite?.results) {
				suites[id] = rest;
				continue;
			}
			const heatmap = new Set(suite.metrics.filter((m) => m.present?.heatmap).map((m) => m.id));
			const { results, unknown } = knownResults(runSuite.results, index, heatmap, ignore);
			if (unknown.length) dropped.push({ label: entry.label, suite: id, names: unknown });
			const categories = categorySummary(results, universe, suite.metrics);
			suites[id] = { ...rest, categories };
			run.suites[id] = { ...withoutTiersField(runSuite), categories };
		}
		runs[entry.label] = run;
		return { ...entry, suites };
	});
	return { history: out, runs, missing, dropped };
}

/**
 * A suite record without the old `tiers` field.
 * @param {Record<string, any>} suite
 */
function withoutTiersField(suite) {
	const copy = { ...suite };
	delete copy.tiers;
	return copy;
}

/**
 * The suites of a history entry without the old `tiers` field.
 * @param {Record<string, any>} suites
 */
function withoutTiers(suites) {
	return Object.fromEntries(Object.entries(suites).map(([id, s]) => [id, withoutTiersField(s)]));
}

/**
 * The results with the per-component rows the universe can place; the names it cannot, listed once. Only a
 * heatmap eval's rows are reported (a per-file or per-requirement eval names no row), and never an ignored name.
 * @param {any[]} results
 * @param {ReturnType<typeof rowIndex>} index
 * @param {Set<string>} heatmap ids of the suite's heatmap evals
 * @param {Set<string>} ignore
 */
function knownResults(results, index, heatmap, ignore) {
	/** @type {Set<string>} */
	const unknown = new Set();
	const out = results.map((r) => {
		const rows = /** @type {any[]} */ (Object.values(r.perComponent ?? {}));
		const kept = rows.filter((row) => {
			const known = rowsForResult(index, row.name).length > 0;
			if (!known && heatmap.has(r.id) && !ignore.has(row.name)) unknown.add(row.name);
			return known;
		});
		return { ...r, perComponent: kept };
	});
	const names = [...unknown];
	names.sort(byCodePoint);
	return { results: out, unknown: names };
}

function main() {
	const ctx = createContext(path.resolve(evalsDir, '..'));
	const universe = buildUniverse(ctx.modelSnapshots(), registry(), ctx.inventory);
	const historyFile = insideDir(evalsDir, 'results', 'history.json');
	const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
	const readRun = (/** @type {string} */ label) => {
		const file = insideDir(evalsDir, 'results', `${label}.json`);
		return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
	};
	// the labels of the blocks that are not composable: their rows left the M-evals on purpose
	const ignore = new Set(
		flattenBlocks(ctx.modelSnapshots())
			.filter((b) => !isComposable(b))
			.map((b) => b.label)
	);
	const r = backfillCategories(history, readRun, universe, { ignore });
	fs.writeFileSync(historyFile, `${JSON.stringify(r.history, null, '\t')}\n`);
	for (const [label, run] of Object.entries(r.runs)) {
		fs.writeFileSync(insideDir(evalsDir, 'results', `${label}.json`), `${JSON.stringify(run, null, '\t')}\n`);
	}
	process.stdout.write(`categories written for ${Object.keys(r.runs).length} runs\n`);
	for (const m of r.missing) process.stderr.write(`no run file for ${m}: entry left as recorded\n`);
	for (const d of r.dropped) {
		process.stderr.write(`${d.label} ${d.suite}: rows without a universe entry dropped: ${d.names.join(', ')}\n`);
	}
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
