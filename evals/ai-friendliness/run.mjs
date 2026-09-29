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

/** @param {string[]} argv */
function parseArgs(argv) {
	/** @type {{ label?: string, only?: string[], json: boolean, write: boolean, compare?: [string, string], root?: string }} */
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

function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.compare) {
		const [a, b] = args.compare.map(loadRun);
		const c = compareRuns(a, b);
		console.log(args.json ? JSON.stringify(c, null, 2) : formatComparison(c));
		return;
	}

	const root = path.resolve(args.root ?? path.join(here, '..', '..'));
	const ctx = createContext(root);
	const sha = ctx.gitSha();
	const label = args.label ?? `run-${sha}`;
	const selected = args.only ? metrics.filter((m) => args.only?.includes(m.id)) : metrics;
	if (selected.length === 0) throw new Error('No metrics selected');

	const results = [];
	for (const m of selected) {
		const t0 = Date.now();
		if (!args.json) process.stderr.write(`▸ ${m.id} ${m.name} … `);
		const r = m.compute(ctx);
		const ms = Date.now() - t0;
		if (!args.json) process.stderr.write(`${r.score.toFixed(1)} (${ms} ms)\n`);
		results.push({
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
		});
	}

	const agg = aggregate(results);
	const run = {
		label,
		date: new Date().toISOString(),
		sha,
		node: process.version,
		tokenizer: ctx.tokenizerName,
		partial: Boolean(args.only),
		...agg,
		results,
	};

	if (args.write) {
		fs.mkdirSync(resultsDir, { recursive: true });
		fs.writeFileSync(path.join(resultsDir, `${label}.json`), `${JSON.stringify(run, null, '\t')}\n`);
		if (!run.partial) {
			const historyFile = path.join(resultsDir, 'history.json');
			const history = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, 'utf8')) : [];
			const entry = { label, date: run.date, sha, scores: agg.scores, index: agg.index };
			fs.writeFileSync(historyFile, `${JSON.stringify(upsertHistory(history, entry), null, '\t')}\n`);
		}
	}

	if (args.json) {
		console.log(JSON.stringify(run, null, 2));
		return;
	}
	console.log('');
	console.log(formatTable(run));
	const unmeasured = results.reduce((s, r) => s + (r.unmeasured?.length ?? 0), 0);
	if (unmeasured) console.log(`\n${unmeasured} component/metric pairs unmeasured (see results JSON → unmeasured).`);
	if (args.write) {
		const resultsFile = path.relative(root, path.join(resultsDir, `${label}.json`));
		console.log(`\nResults: ${resultsFile}`);
	}
}

main();
