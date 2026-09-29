#!/usr/bin/env node
// @ts-check
/**
 * AI-friendliness eval runner.
 *
 *   node evals/ai-friendliness/run.mjs [--label <name>] [--suite ai|enterprise|all] [--only E01,R02] [--json] [--no-write]
 *   node evals/ai-friendliness/run.mjs --compare <labelA> <labelB>
 *
 * Runs the AI-friendliness evals (E01–E10) and the enterprise-readiness evals (R01–R06); each suite has
 * its own index. Writes `results/<label>.json` (full details) and, for full runs of both suites,
 * updates `results/history.json`, HISTORY.md and dashboard.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from './lib/context.mjs';
import { insideDir, isSingleSegment } from './lib/paths.mjs';
import { aggregate, compareRuns, formatComparison, formatTable, INDEX_NAMES, upsertHistory } from './lib/results.mjs';
import { metrics as aiMetrics } from './metrics/index.mjs';
import { metrics as enterpriseMetrics } from '../enterprise/metrics/index.mjs';

/** Every eval of both suites, keyed by suite. */
const SUITES = { ai: aiMetrics, enterprise: enterpriseMetrics };
const metrics = aiMetrics;
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
 * @typedef {{ label?: string, only?: string[], suite: 'ai'|'enterprise'|'all', json: boolean, write: boolean, compare?: [string, string], root?: string }} Args
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
	if (value === 'ai' || value === 'enterprise' || value === 'all') return value;
	throw new Error(`--suite must be ai, enterprise or all, got "${value}"`);
}

/** @param {string} label */
function loadRun(label) {
	const file = resultsFileFor(label);
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
			cls: m.cls ?? (m.movable ? 'movable' : 'structural'),
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
 * Persist a run: its own JSON file and, for full runs, the history entry, HISTORY.md and dashboard.json.
 * @param {any} run
 */
function writeRun(run) {
	fs.mkdirSync(resultsDir, { recursive: true });
	fs.writeFileSync(resultsFileFor(run.label), `${JSON.stringify(run, null, '\t')}\n`);
	if (run.partial) return;
	const historyFile = insideDir(resultsDir, 'history.json');
	const history = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile, 'utf8')) : [];
	const entry = { label: run.label, date: run.date, sha: run.sha, scores: run.scores, index: run.index };
	if (run.enterprise) entry.enterprise = { scores: run.enterprise.scores, index: run.enterprise.index };
	const updated = upsertHistory(history, entry);
	fs.writeFileSync(historyFile, `${JSON.stringify(updated, null, '\t')}\n`);
	writeHistoryReport(here, updated, metrics, enterpriseMetrics);
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
	out('');
	if (run.results.length) out(formatTable(run));
	if (run.enterprise) {
		out('');
		out(formatTable({ ...run.enterprise, label: run.label, sha: run.sha }, { title: INDEX_NAMES.enterprise }));
	}
	const unmeasured = [...run.results, ...(run.enterprise?.results ?? [])].reduce(
		(/** @type {number} */ s, /** @type {any} */ r) => s + (r.unmeasured?.length ?? 0),
		0
	);
	if (unmeasured) out(`\n${unmeasured} component/metric pairs unmeasured (see results JSON → unmeasured).`);
	if (args.write) {
		const resultsFile = path.relative(process.cwd(), resultsFileFor(run.label));
		out(`\nResults: ${resultsFile}`);
	}
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.compare) {
		const [a, b] = args.compare.map(loadRun);
		const c = compareRuns(a, b);
		const e =
			a.enterprise && b.enterprise
				? compareRuns({ ...a.enterprise, label: a.label }, { ...b.enterprise, label: b.label })
				: null;
		if (args.json) {
			out(JSON.stringify({ ai: c, enterprise: e }, null, 2));
			return;
		}
		out(`**${INDEX_NAMES.ai}**\n\n${formatComparison(c)}`);
		if (e) out(`\n**${INDEX_NAMES.enterprise}**\n\n${formatComparison(e)}`);
		return;
	}

	const root = path.resolve(args.root ?? path.join(here, '..', '..'));
	const ctx = createContext(root);
	const commit = ctx.headCommit();
	const label = args.label ?? `run-${commit}`;
	const wantAi = args.suite !== 'enterprise';
	const wantEnterprise = args.suite !== 'ai';
	const pick = (/** @type {typeof metrics} */ list) =>
		args.only ? list.filter((m) => args.only?.includes(m.id)) : list;
	const selectedAi = wantAi ? pick(SUITES.ai) : [];
	const selectedEnterprise = wantEnterprise ? pick(SUITES.enterprise) : [];
	if (selectedAi.length + selectedEnterprise.length === 0) throw new Error('No metrics selected');

	const results = runMetrics(ctx, selectedAi, args.json);
	const enterpriseResults = runMetrics(ctx, selectedEnterprise, args.json);
	const full = !args.only && args.suite === 'all';
	const run = {
		label,
		date: new Date().toISOString(),
		sha: commit,
		node: process.version,
		tokenizer: ctx.tokenizerName,
		partial: !full,
		...aggregate(results),
		results,
		...(enterpriseResults.length
			? { enterprise: { ...aggregate(enterpriseResults), results: enterpriseResults } }
			: {}),
	};
	if (args.write) writeRun(run);
	printRun(run, args);
}

main();
