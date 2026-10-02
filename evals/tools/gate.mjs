#!/usr/bin/env node
// @ts-check
/**
 * Regression gate for every eval suite.
 *
 *   node evals/tools/gate.mjs [--baseline <label>] [--report-baseline <label>] [--max-drop 1] [--max-eval-drop 3]
 *                             [--max-drop-<suite> n] [--report <file.md>] [--changed <files.txt>] [--base-run <run.json>]
 *
 * Runs every suite without writing results and, per suite, compares the run with the baseline:
 *   - the index may not drop by more than `--max-drop` points (default: the suite's `maxDrop`);
 *   - no single eval may drop by more than `--max-eval-drop` points (default: the suite's `maxEvalDrop`);
 *   - evals that declare a `no-decrease` rule (R01 coverage) may not go down at all;
 *   - no eval may leave more components unmeasured than the baseline did (once the baseline records counts).
 * The baseline is the newest run recorded on `dev` when history has one, else the newest run of any
 * label (`--baseline <label>` to choose). `--report` appends a Markdown before → after table per suite to a
 * file (for a PR comment or `$GITHUB_STEP_SUMMARY`); without dev runs its table compares with the oldest
 * recorded run, the state before the branch's work (`--report-baseline <label>` to choose), while the
 * verdict keeps the newest run. `--changed` (one repository path per line, as `git diff --name-only` prints)
 * adds the components those files belong to, each heatmap cell before → after; the "before" run is
 * `--base-run` (the results branch's latest.json in CI), else the baseline's own run file when the checkout has
 * it. Exit code 1 when any suite fails. Usable locally and in CI alike.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createContext } from '../lib/context.mjs';
import { insideDir } from '../lib/paths.mjs';
import { loadRegistry } from '../lib/registry.mjs';
import { normalizeHistoryEntry, normalizeRun, unmeasuredCounts } from '../lib/results.mjs';
import { SUITES } from '../suites.mjs';
import { diagnose, renderDoctor } from './doctor.mjs';
import { componentsForFiles, formatTouchedReport, readChangedFiles } from './touched.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const evalsDir = path.join(here, '..');

/**
 * @typedef {import('../lib/results.mjs').HistoryEntry} HistoryEntry
 * @typedef {{ label: string, sha?: string, scores: Record<string, number>, index: number, unmeasured?: Record<string, number> }} SuiteBaseline
 * @typedef {{ ok: boolean, message: string }} RuleResult
 */

/** @param {number} n */
const f1 = (n) => n.toFixed(1);
/** @param {number} d */
const signed = (d) => (d > 0 ? `+${f1(d)}` : f1(d));
/** @param {number} n */
const r1 = (n) => Math.round(n * 10) / 10;
/** @param {any[]} history */
const byDate = (history) => [...history].sort((a, b) => a.date.localeCompare(b.date));

/** A run recorded on the base branch. @param {HistoryEntry} e */
function isDevEntry(e) {
	return e.branch === 'dev' || e.label.startsWith('dev-');
}

/**
 * The entry the verdict compares with: the labelled one, else the newest run recorded on dev, else the
 * newest run of any label.
 * @param {any[]} history
 * @param {string} [label]
 * @returns {HistoryEntry}
 */
export function pickBaseline(history, label) {
	if (history.length === 0) throw new Error('history is empty — run the suite with --label first');
	const entries = history.map((e) => normalizeHistoryEntry(e));
	if (label) {
		const hit = entries.find((h) => h.label === label);
		if (!hit) throw new Error(`no history entry labelled "${label}"`);
		return hit;
	}
	const dev = byDate(entries.filter((e) => isDevEntry(e)));
	if (dev.length) return dev[dev.length - 1];
	return byDate(entries)[entries.length - 1];
}

/**
 * The origin of a suite's before → after table: the labelled entry when it carries the suite, else the
 * newest dev run carrying it, else the oldest entry carrying it (the state before the branch's work).
 * @param {any[]} history
 * @param {string} suiteId
 * @param {string} [label]
 * @returns {HistoryEntry}
 */
export function pickOrigin(history, suiteId, label) {
	const eligible = history.map((e) => normalizeHistoryEntry(e)).filter((h) => h.suites[suiteId]);
	if (eligible.length === 0) throw new Error(`history has no entry to compare against for suite "${suiteId}"`);
	const labelled = label ? eligible.find((h) => h.label === label) : undefined;
	if (labelled) return labelled;
	const dev = byDate(eligible.filter((e) => isDevEntry(e)));
	if (dev.length) return dev[dev.length - 1];
	return byDate(eligible)[0];
}

/**
 * One suite of a history entry, flattened for the gate; null when the entry does not carry it.
 * @param {any} entry
 * @param {string} suiteId
 * @returns {SuiteBaseline|null}
 */
export function suiteView(entry, suiteId) {
	const e = normalizeHistoryEntry(entry);
	const s = e.suites[suiteId];
	if (!s) return null;
	return { label: e.label, sha: e.sha, scores: s.scores, index: s.index, unmeasured: s.unmeasured };
}

/**
 * The index rule and the per-eval rule of one suite.
 * @param {SuiteBaseline} baseline
 * @param {{ index: number, scores: Record<string, number> }} run
 * @param {{ maxDrop?: number, maxEvalDrop?: number }} [options]
 */
export function evaluateGate(baseline, run, { maxDrop = 1, maxEvalDrop = Number.POSITIVE_INFINITY } = {}) {
	const delta = r1(run.index - baseline.index);
	const regressed = Object.keys(baseline.scores)
		.map((id) => ({
			id,
			from: baseline.scores[id],
			to: run.scores[id] ?? 0,
			delta: r1((run.scores[id] ?? 0) - baseline.scores[id]),
		}))
		.filter((x) => x.delta < 0)
		.sort((a, b) => a.delta - b.delta);
	const overEval = regressed.filter((x) => x.delta < -maxEvalDrop);
	const ok = delta >= -maxDrop && overEval.length === 0;
	const head = `Index ${f1(baseline.index)} → ${f1(run.index)} (${signed(delta)}; baseline "${baseline.label}" @ ${baseline.sha ?? 'unknown'}, tolerance −${maxDrop})`;
	const regressedList = regressed.map((x) => `${x.id} ${f1(x.from)} → ${f1(x.to)}`).join(', ');
	const detail = regressed.length ? `\nregressed: ${regressedList}` : '';
	const overList = overEval
		.map((x) => `${x.id} ${f1(x.from)} → ${f1(x.to)} dropped more than ${maxEvalDrop}`)
		.join('; ');
	const evalDetail = overEval.length ? `\n${overList}` : '';
	return { ok, delta, regressed, overEval, message: `${ok ? 'PASS' : 'FAIL'} — ${head}${detail}${evalDetail}` };
}

/**
 * The `no-decrease` rules the suite's metrics declare, evaluated where both sides have the eval.
 * @param {{ id: string, rules?: { kind: string, why: string }[] }[]} metrics
 * @param {SuiteBaseline} baseline
 * @param {{ scores: Record<string, number> }} run
 * @returns {RuleResult[]}
 */
export function evaluateRules(metrics, baseline, run) {
	/** @type {RuleResult[]} */
	const out = [];
	for (const m of metrics) {
		for (const rule of m.rules ?? []) {
			if (rule.kind !== 'no-decrease') continue;
			const from = baseline.scores[m.id];
			const to = run.scores[m.id];
			if (from === undefined || to === undefined) continue;
			const ok = to >= from;
			out.push({
				ok,
				message: ok
					? `${m.id} ${f1(from)} → ${f1(to)} (may not decrease: ok)`
					: `${m.id} ${f1(from)} → ${f1(to)}: ${rule.why}`,
			});
		}
	}
	return out;
}

/**
 * No eval may leave more components unmeasured than the baseline did. Null when the baseline predates
 * the counts.
 * @param {SuiteBaseline} baseline
 * @param {{ results: { id: string, unmeasured?: unknown[] }[] }} run
 * @returns {RuleResult|null}
 */
export function evaluateMeasurementRule(baseline, run) {
	if (!baseline.unmeasured) return null;
	const counts = unmeasuredCounts(run.results);
	const grew = Object.entries(counts)
		.filter(([id, to]) => baseline.unmeasured?.[id] !== undefined && to > (baseline.unmeasured?.[id] ?? 0))
		.map(([id, to]) => `${id} ${baseline.unmeasured?.[id]} → ${to}`);
	const ok = grew.length === 0;
	return {
		ok,
		message: ok
			? 'measurement coverage: no eval leaves more components unmeasured than the baseline (ok)'
			: `measurement coverage: ${grew.join(', ')} more components unmeasured than the baseline`,
	};
}

/** @param {number | null} d */
function formatMark(d) {
	if (d === null) return 'new';
	if (d < 0) return `🔻 ${signed(d)}`;
	if (d > 0) return `🔼 ${signed(d)}`;
	return '0.0';
}

/**
 * @param {SuiteBaseline} origin
 * @param {Record<string, number>} scores
 * @param {{ id: string, name: string, movable: boolean, cls?: string, summary?: string }} r
 */
function formatEvalRow(origin, scores, r) {
	const before = origin.scores[r.id];
	const after = scores[r.id] ?? 0;
	const d = before === undefined ? null : r1(after - before);
	const cls = r.cls ?? (r.movable ? 'movable' : 'structural');
	const tag = cls === 'movable' ? '' : ` _(${cls})_`;
	const beforeCell = before === undefined ? '—' : f1(before);
	return `| ${r.id} | ${r.name}${tag} | ${beforeCell} | ${f1(after)} | ${formatMark(d)} | ${r.summary ?? ''} |`;
}

/**
 * Markdown "before → after" report of one suite for a PR check. The table compares this run with
 * `origin`; the verdict comes from the regression gate against `gate` (the baseline), named when it
 * differs from the origin so both comparisons are visible.
 * @param {SuiteBaseline} origin
 * @param {{ label: string, sha?: string, index: number, scores: Record<string, number>, results: { id: string, name: string, movable: boolean, cls?: string, summary?: string }[] }} run
 * @param {{ ok: boolean, delta: number }} verdict
 * @param {{ maxDrop?: number, title?: string, extra?: string|string[], gate?: SuiteBaseline }} [options]
 */
export function formatGateReport(origin, run, verdict, { maxDrop = 1, title = 'Index', extra = [], gate } = {}) {
	const status = verdict.ok ? '✅ **Passed**' : '❌ **Failed**';
	const sinceOrigin = r1(run.index - origin.index);
	const extraLines = (Array.isArray(extra) ? extra : [extra]).filter(Boolean);
	const gateLine =
		gate && gate.label !== origin.label
			? `Regression gate against the newest recorded run \`${gate.label}\` @ \`${gate.sha ?? 'unknown'}\`: ${f1(gate.index)} → ${f1(run.index)} (${signed(verdict.delta)}), tolerance −${maxDrop}.`
			: `Tolerance −${maxDrop}.`;
	const lines = [
		`### 📊 ${title}: ${status}`,
		...(extraLines.length ? ['', ...extraLines] : []),
		'',
		`Since the branch baseline \`${origin.label}\` @ \`${origin.sha}\`: ${f1(origin.index)} → **${f1(run.index)}** (${signed(sinceOrigin)}); this run @ \`${run.sha ?? 'unknown'}\`. ${gateLine}`,
		'',
		'| ID | Eval | Before | After | Δ | Notes |',
		'| --- | --- | ---: | ---: | ---: | --- |',
		...run.results.map((r) => formatEvalRow(origin, run.scores, r)),
		`| — | **Index** | **${f1(origin.index)}** | **${f1(run.index)}** | **${signed(sinceOrigin)}** | |`,
		'',
		'History of every run: `evals/results/HISTORY.md`. Formulas and bands: `docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md`.',
	];
	return lines.join('\n');
}

/**
 * Gate one suite of a run: every rule, one verdict, one report section.
 * @param {import('../suites.mjs').Suite} suite
 * @param {any[]} history
 * @param {any} run the full run, in the suites shape
 * @param {{ baselineLabel?: string, originLabel?: string, maxDrop?: number, maxEvalDrop?: number }} [options]
 * @returns {{ verdict: { ok: boolean, message: string }|null, report: string }}
 */
function gateSuite(suite, history, run, options = {}) {
	const runSuite = run.suites[suite.id];
	const maxDrop = options.maxDrop ?? suite.maxDrop;
	const maxEvalDrop = options.maxEvalDrop ?? suite.maxEvalDrop;
	const baseline = suiteView(pickBaseline(history, options.baselineLabel), suite.id);
	if (!baseline) {
		return { verdict: null, report: `### 📊 ${suite.indexName}: first measurement, no baseline yet\n` };
	}
	const origin = /** @type {SuiteBaseline} */ (
		suiteView(pickOrigin(history, suite.id, options.originLabel), suite.id)
	);
	const index = evaluateGate(baseline, runSuite, { maxDrop, maxEvalDrop });
	const rules = [...evaluateRules(suite.metrics, baseline, runSuite)];
	const measurement = evaluateMeasurementRule(baseline, runSuite);
	if (measurement) rules.push(measurement);
	const ok = index.ok && rules.every((r) => r.ok);
	const tail = index.message.slice(index.message.indexOf('Index'));
	const ruleNotes = rules.map((r) => `; ${r.message}`).join('');
	const verdict = {
		ok,
		message: `${ok ? 'PASS' : 'FAIL'} — ${suite.indexName.replace(/ Index$/, '')} ${tail}${ruleNotes}`,
	};
	const report = formatGateReport(origin, { ...runSuite, label: run.label, sha: run.sha }, index, {
		maxDrop,
		title: suite.indexName,
		extra: rules.map((r) => `${r.ok ? '✅' : '❌'} ${r.message}.`),
		gate: baseline,
	});
	return { verdict, report };
}

/**
 * @param {string[]} argv
 * @returns {{ baseline?: string, reportBaseline?: string, maxDrop?: number, maxEvalDrop?: number, report?: string, changed?: string, baseRun?: string, perSuite: Record<string, number> }}
 */
export function parseArgs(argv) {
	/** @type {{ baseline?: string, reportBaseline?: string, maxDrop?: number, maxEvalDrop?: number, report?: string, changed?: string, baseRun?: string, perSuite: Record<string, number> }} */
	const args = { perSuite: {} };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--baseline') args.baseline = argv[++i];
		else if (a === '--report-baseline') args.reportBaseline = argv[++i];
		else if (a === '--max-drop') args.maxDrop = Number(argv[++i]);
		else if (a === '--max-eval-drop') args.maxEvalDrop = Number(argv[++i]);
		else if (a === '--report') args.report = argv[++i];
		else if (a === '--changed') args.changed = argv[++i];
		else if (a === '--base-run') args.baseRun = argv[++i];
		else if (a.startsWith('--max-drop-')) args.perSuite[a.slice('--max-drop-'.length)] = Number(argv[++i]);
		else throw new Error(`Unknown argument: ${a}`);
	}
	return args;
}

/**
 * The run the touched-components section compares with: the given file, else the baseline's own run file
 * when this checkout has it, else the results directory's latest.json, else null.
 * @param {any[]} history
 * @param {string} [baselineLabel]
 * @param {string} [file]
 */
function baseRun(history, baselineLabel, file) {
	const candidates = [];
	if (file) candidates.push(path.resolve(file));
	candidates.push(
		insideDir(evalsDir, 'results', `${pickBaseline(history, baselineLabel).label}.json`),
		insideDir(evalsDir, 'results', 'latest.json')
	);
	const hit = candidates.find((f) => fs.existsSync(f));
	return hit ? normalizeRun(JSON.parse(fs.readFileSync(hit, 'utf8'))) : null;
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const history = JSON.parse(fs.readFileSync(insideDir(evalsDir, 'results', 'history.json'), 'utf8'));
	const json = execFileSync(
		process.execPath,
		[path.join(evalsDir, 'run.mjs'), '--label', 'gate', '--no-write', '--json'],
		{
			encoding: 'utf8',
			maxBuffer: 64 * 1024 * 1024,
			stdio: ['ignore', 'pipe', 'inherit'],
		}
	);
	const run = normalizeRun(JSON.parse(json));
	/** @type {{ ok: boolean, message: string }[]} */
	const verdicts = [];
	/** @type {string[]} */
	const reports = [];
	for (const suite of SUITES) {
		if (!run.suites[suite.id]) continue;
		const { verdict, report } = gateSuite(suite, history, run, {
			baselineLabel: args.baseline,
			originLabel: args.reportBaseline,
			maxDrop: args.perSuite[suite.id] ?? args.maxDrop,
			maxEvalDrop: args.maxEvalDrop,
		});
		if (verdict) verdicts.push(verdict);
		reports.push(report);
	}
	const ctx = createContext(path.join(evalsDir, '..'));
	// the components the change touches, each cell before → after (informational)
	if (args.changed) {
		const files = readChangedFiles(fs.readFileSync(path.resolve(args.changed), 'utf8'));
		const touched = componentsForFiles(ctx.inventory, ctx.root, files);
		const before = baseRun(history, args.baseline, args.baseRun);
		const heatmapIds = SUITES.flatMap((s) => s.metrics.filter((m) => m.present?.heatmap).map((m) => m.id));
		const section = formatTouchedReport(touched, before, run, heatmapIds);
		if (section) reports.push(section);
	}
	// the component registry section: what a new or renamed component still needs (informational; the
	// registry test is what fails the job)
	const doctor = renderDoctor(diagnose(ctx, loadRegistry()));
	if (doctor) reports.push(doctor);
	if (args.report) {
		// appended, so it can target $GITHUB_STEP_SUMMARY as well as a fresh file
		fs.appendFileSync(path.resolve(args.report), `${reports.join('\n\n')}\n`);
	}
	for (const v of verdicts) console.log(v.message);
	process.exitCode = verdicts.every((v) => v.ok) ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
