#!/usr/bin/env node
// @ts-check
/**
 * AI-friendliness eval runner.
 *
 *   node evals/ai-friendliness/run.mjs [--label <name>] [--only E01,E03] [--json] [--no-write]
 *   node evals/ai-friendliness/run.mjs --compare <labelA> <labelB>
 *
 * Writes `results/<label>.json` (full details) and, for full runs, updates `results/history.json`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from './lib/context.mjs';
import { aggregate, compareRuns, formatComparison, formatTable, upsertHistory } from './lib/results.mjs';
import { metrics } from './metrics/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const resultsDir = path.join(here, 'results');

/** CLI output: the run report is the program's product, written to stdout (not a diagnostic log). */
const out = (/** @type {string} */ text) => process.stdout.write(`${text}\n`);

/**
 * @typedef {{ label?: string, only?: string[], json: boolean, write: boolean, compare?: [string, string], root?: string }} Args
 */

/** @param {string[]} argv */
function parseArgs(argv) {
	/** @type {Args} */
	const args = { json: false, write: true };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--label') args.label = argv[++i];
		else if (a === '--only') args.only = argv[++i].split(',').map((s) => s.trim().toUpperCase());
		else if (a === '--json') args.json = true;
		else if (a === '--no-write') args.write = false;
		else if (a === '--root') args.root = argv[++i];
		else if (a === '--compare') args.compare = [argv[++i], argv[++i]];
		else throw new Error(`Unknown argument: ${a}`);
	}
	return args;
}

/** @param {string} label */
function loadRun(label) {
	const file = path.join(resultsDir, `${label}.json`);
	if (!fs.existsSync(file)) throw new Error(`No results for label "${label}" (${file})`);
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Compute every selected metric, reporting progress on stderr unless `quiet`.
 * @param {import('./lib/context.mjs').EvalContext} ctx
 * @param {typeof metrics} selected
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
			score: r.score,
			summary: r.summary,
			raw: r.raw,
			perComponent: r.perComponent,
			unmeasured: r.unmeasured,
			details: r.details,
			ms,
		};
	});
}

/**
 * Persist a run: its own JSON file and, for full runs, the history entry.
 * @param {any} run
 */
function writeRun(run) {
	fs.mkdirSync(resultsDir, { recursive: true });
	fs.writeFileSync(path.join(resultsDir, `${run.label}.json`), `${JSON.stringify(run, null, '\t')}\n`);
	if (run.partial) return;
	const historyFile = path.join(resultsDir, 'history.json');
	const history = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, 'utf8')) : [];
	const entry = { label: run.label, date: run.date, sha: run.sha, scores: run.scores, index: run.index };
	fs.writeFileSync(historyFile, `${JSON.stringify(upsertHistory(history, entry), null, '\t')}\n`);
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
	out('');
	out(formatTable(run));
	const unmeasured = run.results.reduce(
		(/** @type {number} */ s, /** @type {any} */ r) => s + (r.unmeasured?.length ?? 0),
		0
	);
	if (unmeasured) out(`\n${unmeasured} component/metric pairs unmeasured (see results JSON → unmeasured).`);
	if (args.write) {
		const resultsFile = path.relative(process.cwd(), path.join(resultsDir, `${run.label}.json`));
		out(`\nResults: ${resultsFile}`);
	}
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.compare) {
		const [a, b] = args.compare.map(loadRun);
		const c = compareRuns(a, b);
		out(args.json ? JSON.stringify(c, null, 2) : formatComparison(c));
		return;
	}

	const root = path.resolve(args.root ?? path.join(here, '..', '..'));
	const ctx = createContext(root);
	const sha = ctx.gitSha();
	const label = args.label ?? `run-${sha}`;
	const selected = args.only ? metrics.filter((m) => args.only?.includes(m.id)) : metrics;
	if (selected.length === 0) throw new Error('No metrics selected');

	const results = runMetrics(ctx, selected, args.json);
	const run = {
		label,
		date: new Date().toISOString(),
		sha,
		node: process.version,
		tokenizer: ctx.tokenizerName,
		partial: Boolean(args.only),
		...aggregate(results),
		results,
	};
	if (args.write) writeRun(run);
	printRun(run, args);
}

main();
