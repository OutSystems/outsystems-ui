#!/usr/bin/env node
// @ts-check
/**
 * Eval runner for every suite of the registry (suites.mjs).
 *
 *   node evals/run.mjs [--label <name>] [--suite <id>|all] [--only E01,R02] [--branch <name>] [--json] [--no-write] [--force]
 *   node evals/run.mjs --compare <labelA> <labelB>
 *
 * Each suite has its own index. Writes `results/<label>.json` (full details) and, for full runs of every
 * suite, updates `results/history.json`, HISTORY.md and dashboard.json — unless the measured inputs (src/,
 * stories/, docs-ai/) equal the newest recorded run's: a loop measures pattern code, so a tooling-only
 * change is not recorded (`--force` overrides).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from './lib/context.mjs';
import { measuredFingerprint, shouldRecord } from './lib/inputs.mjs';
import { insideDir, isSingleSegment } from './lib/paths.mjs';
import {
	aggregate,
	compareRuns,
	formatComparison,
	formatTable,
	historyEntryOf,
	normalizeHistoryEntry,
	normalizeRun,
	categorySummary,
	upsertHistory,
} from './lib/results.mjs';
import { registry } from './lib/registry.mjs';
import { buildUniverse } from './lib/universe.mjs';
import { SUITES, suiteOf } from './suites.mjs';
import { writeDashboardData } from './tools/dashboard-data.mjs';
import { writeHistoryReport } from './tools/report.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const resultsDir = path.join(here, 'results');

/**
 * `results/<label>.json`; the label comes from the command line, so it must be one plain file name.
 * @param {string} label
 */
function resultsFileFor(label) {
	if (!isSingleSegment(label)) throw new Error(`Label must be a plain file name, got "${label}"`);
	return insideDir(resultsDir, `${label}.json`);
}

/** CLI output: the run report is the program's product, written to stdout (not a diagnostic log). */
const out = (/** @type {string} */ text) => process.stdout.write(`${text}\n`);

/**
 * @typedef {{ label?: string, only?: string[], suite: string, branch?: string, json: boolean, write: boolean, force: boolean, compare?: [string, string], root?: string }} Args
 */

/** @param {string[]} argv */
function parseArgs(argv) {
	/** @type {Args} */
	const args = { json: false, write: true, force: false, suite: 'all' };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--label') args.label = argv[++i];
		else if (a === '--suite') args.suite = parseSuite(argv[++i]);
		else if (a === '--only') args.only = argv[++i].split(',').map((s) => s.trim().toUpperCase());
		else if (a === '--branch') args.branch = argv[++i];
		else if (a === '--json') args.json = true;
		else if (a === '--no-write') args.write = false;
		else if (a === '--force') args.force = true;
		else if (a === '--root') args.root = argv[++i];
		else if (a === '--compare') args.compare = [argv[++i], argv[++i]];
		else throw new Error(`Unknown argument: ${a}`);
	}
	return args;
}

/** @param {string} value */
function parseSuite(value) {
	if (value === 'all') return value;
	return suiteOf(value).id;
}

/** @param {string} label */
function loadRun(label) {
	const file = resultsFileFor(label);
	if (!fs.existsSync(file)) throw new Error(`No results for label "${label}" (${file})`);
	return normalizeRun(JSON.parse(fs.readFileSync(file, 'utf8')));
}

/**
 * Compute every selected metric, reporting progress on stderr unless `quiet`.
 * @param {import('./lib/context.mjs').EvalContext} ctx
 * @param {any[]} selected
 * @param {boolean} quiet
 */
function runMetrics(ctx, selected, quiet) {
	return selected.map((m) => {
		const t0 = Date.now();
		if (!quiet) process.stderr.write(`▸ ${m.id} ${m.name} … `);
		const r = m.compute(ctx);
		const ms = Date.now() - t0;
		if (!quiet) process.stderr.write(`${r.score.toFixed(1)} (${ms} ms)\n`);
		return {
			id: m.id,
			name: m.name,
			criterion: m.criterion,
			formula: m.formula,
			movable: m.movable,
			cls: m.cls ?? (m.movable ? 'movable' : 'structural'),
			score: r.score,
			summary: r.summary,
			raw: r.raw,
			perComponent: r.perComponent,
			unmeasured: r.unmeasured,
			notApplicable: r.notApplicable,
			details: r.details,
			ms,
		};
	});
}

/**
 * Persist a run: its own JSON file and, for full runs whose measured inputs changed, the history entry,
 * HISTORY.md and dashboard.json. Returns the label of the recorded run the inputs equal, when not recorded.
 * @param {any} run
 * @param {boolean} force record even when the inputs equal the newest recorded run's
 * @returns {string|null}
 */
function writeRun(run, force) {
	fs.mkdirSync(resultsDir, { recursive: true });
	const json = `${JSON.stringify(run, null, '\t')}\n`;
	fs.writeFileSync(resultsFileFor(run.label), json);
	if (run.partial) return null;
	const historyFile = insideDir(resultsDir, 'history.json');
	const history = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, 'utf8')) : [];
	const decision = shouldRecord(history, run.inputs, force);
	if (!decision.record) return decision.same;
	// latest.json is what the results branch keeps (not versioned in the repository; see .gitignore)
	fs.writeFileSync(insideDir(resultsDir, 'latest.json'), json);
	const updated = upsertHistory(
		history.map((e) => normalizeHistoryEntry(e)),
		historyEntryOf(run)
	);
	fs.writeFileSync(historyFile, `${JSON.stringify(updated, null, '\t')}\n`);
	writeHistoryReport(here, updated, SUITES);
	writeDashboardData(here);
	return null;
}

/**
 * @param {any} run
 * @param {Args} args
 * @param {string|null} notRecorded label of the recorded run whose inputs this run equals, when not recorded
 */
function printRun(run, args, notRecorded) {
	if (args.json) {
		out(JSON.stringify(run, null, 2));
		return;
	}
	let unmeasured = 0;
	for (const suite of SUITES) {
		const s = run.suites[suite.id];
		if (!s) continue;
		out('');
		out(formatTable({ ...s, label: run.label, sha: run.sha }, { title: suite.indexName }));
		unmeasured += s.results.reduce(
			(/** @type {number} */ n, /** @type {any} */ r) => n + (r.unmeasured?.length ?? 0),
			0
		);
	}
	if (unmeasured) out(`\n${unmeasured} component/metric pairs unmeasured (see results JSON → unmeasured).`);
	if (args.write) {
		const resultsFile = path.relative(process.cwd(), resultsFileFor(run.label));
		out(`\nResults: ${resultsFile}`);
		if (notRecorded)
			out(
				`Not recorded in history: the measured inputs (src/, stories/, docs-ai/) are those of ${notRecorded}; a loop measures pattern code. Pass --force to record anyway.`
			);
	}
}

/**
 * @param {Args} args
 */
function compare(args) {
	const [a, b] = /** @type {[string, string]} */ (args.compare).map((label) => loadRun(label));
	/** @type {Record<string, ReturnType<typeof compareRuns>>} */
	const comparisons = {};
	for (const suite of SUITES) {
		if (a.suites[suite.id] && b.suites[suite.id]) {
			comparisons[suite.id] = compareRuns(
				{ ...a.suites[suite.id], label: a.label },
				{ ...b.suites[suite.id], label: b.label }
			);
		}
	}
	if (args.json) {
		out(JSON.stringify(comparisons, null, 2));
		return;
	}
	for (const suite of SUITES) {
		const c = comparisons[suite.id];
		if (c) out(`**${suite.indexName}**\n\n${formatComparison(c)}\n`);
	}
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.compare) {
		compare(args);
		return;
	}

	const root = path.resolve(args.root ?? path.join(here, '..'));
	const ctx = createContext(root);
	// the rows of the universe, for the per-category view of each suite
	const universe = buildUniverse(ctx.modelSnapshots(), registry(), ctx.inventory);
	const commit = ctx.headCommit();
	const label = args.label ?? `run-${commit}`;
	const selectedSuites = args.suite === 'all' ? SUITES : [suiteOf(args.suite)];
	/** @type {Record<string, any>} */
	const suites = {};
	let selectedCount = 0;
	for (const suite of selectedSuites) {
		const selected = args.only ? suite.metrics.filter((m) => args.only?.includes(m.id)) : suite.metrics;
		if (selected.length === 0) continue;
		selectedCount += selected.length;
		const results = runMetrics(ctx, selected, args.json);
		suites[suite.id] = {
			...aggregate(results),
			categories: categorySummary(results, universe, suite.metrics),
			results,
		};
	}
	if (selectedCount === 0) throw new Error('No metrics selected');

	const full = !args.only && args.suite === 'all';
	const branch = args.branch ?? ctx.headBranch();
	const run = {
		label,
		date: new Date().toISOString(),
		sha: commit,
		...(branch ? { branch } : {}),
		inputs: measuredFingerprint(root),
		node: process.version,
		tokenizer: ctx.tokenizerName,
		partial: !full,
		suites,
	};
	const notRecorded = args.write ? writeRun(run, args.force) : null;
	printRun(run, args, notRecorded);
}

main();
