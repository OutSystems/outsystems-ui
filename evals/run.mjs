#!/usr/bin/env node
// @ts-check
/**
 * Eval runner for every suite of the registry (suites.mjs).
 *
 *   node evals/run.mjs [--label <name>] [--suite <id>|all] [--only E01,R02] [--branch <name>] [--json] [--no-write]
 *   node evals/run.mjs --compare <labelA> <labelB>
 *
 * Each suite has its own index. Writes `results/<label>.json` (full details) and, for full runs of every
 * suite, updates `results/history.json`, HISTORY.md and dashboard.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from './lib/context.mjs';
import { insideDir, isSingleSegment } from './lib/paths.mjs';
import {
	aggregate,
	compareRuns,
	formatComparison,
	formatTable,
	historyEntryOf,
	normalizeHistoryEntry,
	normalizeRun,
	upsertHistory,
} from './lib/results.mjs';
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
 * @typedef {{ label?: string, only?: string[], suite: string, branch?: string, json: boolean, write: boolean, compare?: [string, string], root?: string }} Args
 */

/** @param {string[]} argv */
function parseArgs(argv) {
	/** @type {Args} */
	const args = { json: false, write: true, suite: 'all' };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--label') args.label = argv[++i];
		else if (a === '--suite') args.suite = parseSuite(argv[++i]);
		else if (a === '--only') args.only = argv[++i].split(',').map((s) => s.trim().toUpperCase());
		else if (a === '--branch') args.branch = argv[++i];
		else if (a === '--json') args.json = true;
		else if (a === '--no-write') args.write = false;
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
 * Persist a run: its own JSON file and, for full runs, the history entry, HISTORY.md and dashboard.json.
 * @param {any} run
 */
function writeRun(run) {
	fs.mkdirSync(resultsDir, { recursive: true });
	fs.writeFileSync(resultsFileFor(run.label), `${JSON.stringify(run, null, '\t')}\n`);
	if (run.partial) return;
	const historyFile = insideDir(resultsDir, 'history.json');
	const history = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, 'utf8')) : [];
	const updated = upsertHistory(history.map(normalizeHistoryEntry), historyEntryOf(run));
	fs.writeFileSync(historyFile, `${JSON.stringify(updated, null, '\t')}\n`);
	writeHistoryReport(here, updated, SUITES);
	writeDashboardData(here);
}

/**
 * @param {any} run
 * @param {Args} args
 */
function printRun(run, args) {
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
	}
}

/**
 * @param {Args} args
 */
function compare(args) {
	const [a, b] = /** @type {[string, string]} */ (args.compare).map(loadRun);
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
		suites[suite.id] = { ...aggregate(results), results };
	}
	if (selectedCount === 0) throw new Error('No metrics selected');

	const full = !args.only && args.suite === 'all';
	const branch = args.branch ?? ctx.headBranch();
	const run = {
		label,
		date: new Date().toISOString(),
		sha: commit,
		...(branch ? { branch } : {}),
		node: process.version,
		tokenizer: ctx.tokenizerName,
		partial: !full,
		suites,
	};
	if (args.write) writeRun(run);
	printRun(run, args);
}

main();
