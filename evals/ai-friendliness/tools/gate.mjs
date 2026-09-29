#!/usr/bin/env node
// @ts-check
/**
 * AI-friendliness regression gate.
 *
 *   node evals/ai-friendliness/tools/gate.mjs [--baseline <label>] [--max-drop 1] [--max-drop-enterprise 1] [--report <file.md>]
 *
 * Runs the suite without writing results, compares the index with the newest entry of
 * results/history.json (or the given label) and exits 1 when it dropped by more than
 * `--max-drop` points; the Enterprise Readiness Index gets the same rule (`--max-drop-enterprise` to
 * override) plus a no-decrease rule on component coverage (R01). `--report` appends a Markdown before/after table to a file (for a PR
 * comment or `$GITHUB_STEP_SUMMARY`). Usable locally and in CI alike.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { insideDir } from '../lib/paths.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const suiteDir = path.join(here, '..');

/**
 * @typedef {{ label: string, date: string, sha: string, scores: Record<string, number>, index: number, enterprise?: { scores: Record<string, number>, index: number } }} HistoryEntry
 */

/**
 * Enterprise coverage (R01) may never decrease: a removed component or feature is a regression whatever
 * the index does. Returns null when either side has no enterprise suite.
 * @param {HistoryEntry} baseline
 * @param {{ enterprise?: { scores: Record<string, number> } }} run
 * @returns {{ ok: boolean, from: number, to: number, message: string }|null}
 */
export function evaluateCoverageRule(baseline, run) {
	const from = baseline.enterprise?.scores.R01;
	const to = run.enterprise?.scores.R01;
	if (from === undefined || to === undefined) return null;
	const ok = to >= from;
	return {
		ok,
		from,
		to,
		message: ok
			? `coverage R01 ${from.toFixed(1)} → ${to.toFixed(1)} (may not decrease: ok)`
			: `coverage R01 ${from.toFixed(1)} → ${to.toFixed(1)}: enterprise component coverage may not decrease`,
	};
}

/**
 * Newest history entry, or the one with the given label.
 * @param {HistoryEntry[]} history
 * @param {string} [label]
 */
export function pickBaseline(history, label) {
	if (history.length === 0) throw new Error('history is empty — run the suite with --label first');
	if (label) {
		const hit = history.find((h) => h.label === label);
		if (!hit) throw new Error(`no history entry labelled "${label}"`);
		return hit;
	}
	return [...history].sort((a, b) => a.date.localeCompare(b.date))[history.length - 1];
}

/**
 * @param {HistoryEntry} baseline
 * @param {{ index: number, scores: Record<string, number> }} run
 * @param {{ maxDrop?: number }} [options]
 */
export function evaluateGate(baseline, run, { maxDrop = 1 } = {}) {
	const delta = Math.round((run.index - baseline.index) * 10) / 10;
	const regressed = Object.keys(baseline.scores)
		.map((id) => ({
			id,
			from: baseline.scores[id],
			to: run.scores[id] ?? 0,
			delta: Math.round(((run.scores[id] ?? 0) - baseline.scores[id]) * 10) / 10,
		}))
		.filter((x) => x.delta < 0)
		.sort((a, b) => a.delta - b.delta);
	const ok = delta >= -maxDrop;
	const head = `AI-Friendliness Index ${baseline.index.toFixed(1)} → ${run.index.toFixed(1)} (${delta >= 0 ? '+' : ''}${delta.toFixed(1)}; baseline "${baseline.label}" @ ${baseline.sha}, tolerance −${maxDrop})`;
	const regressedList = regressed.map((x) => `${x.id} ${x.from.toFixed(1)} → ${x.to.toFixed(1)}`).join(', ');
	const detail = regressed.length ? `\nregressed: ${regressedList}` : '';
	return { ok, delta, regressed, message: `${ok ? 'PASS' : 'FAIL'} — ${head}${detail}` };
}

/** @param {number} d */
const signed = (d) => (d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1));

/** @param {number | null} d */
function formatMark(d) {
	if (d === null) return 'new';
	if (d < 0) return `🔻 ${signed(d)}`;
	if (d > 0) return `🔼 ${signed(d)}`;
	return '0.0';
}

/**
 * @param {HistoryEntry} baseline
 * @param {Record<string, number>} scores
 * @param {{ id: string, name: string, movable: boolean, summary?: string }} r
 */
function formatEvalRow(baseline, scores, r) {
	const before = baseline.scores[r.id];
	const after = scores[r.id] ?? 0;
	const d = before === undefined ? null : Math.round((after - before) * 10) / 10;
	const cls = r.cls ?? (r.movable ? 'movable' : 'structural');
	const tag = cls === 'movable' ? '' : ` _(${cls})_`;
	const beforeCell = before === undefined ? '—' : before.toFixed(1);
	return `| ${r.id} | ${r.name}${tag} | ${beforeCell} | ${after.toFixed(1)} | ${formatMark(d)} | ${r.summary ?? ''} |`;
}

/**
 * Markdown "before → after" report for a PR check: one row per eval, the index, and the verdict.
 * @param {HistoryEntry} baseline
 * @param {{ label: string, sha?: string, index: number, scores: Record<string, number>, results: { id: string, name: string, movable: boolean, summary?: string }[] }} run
 * @param {ReturnType<typeof evaluateGate>} verdict
 * @param {{ maxDrop?: number, title?: string, extra?: string }} [options] index title (default AI-Friendliness Index) and an extra line under it
 */
export function formatGateReport(
	baseline,
	run,
	verdict,
	{ maxDrop = 1, title = 'AI-Friendliness Index', extra = '' } = {}
) {
	const status = verdict.ok ? '✅ **Passed**' : '❌ **Failed**';
	const lines = [
		`### 📊 ${title}: ${status}`,
		...(extra ? ['', extra] : []),
		'',
		`${baseline.index.toFixed(1)} → **${run.index.toFixed(1)}** (${signed(verdict.delta)}); baseline \`${baseline.label}\` @ \`${baseline.sha}\`, this run @ \`${run.sha ?? 'unknown'}\`, tolerance −${maxDrop}.`,
		'',
		'| ID | Eval | Before | After | Δ | Notes |',
		'| --- | --- | ---: | ---: | ---: | --- |',
		...run.results.map((r) => formatEvalRow(baseline, run.scores, r)),
		`| — | **Index** | **${baseline.index.toFixed(1)}** | **${run.index.toFixed(1)}** | **${signed(verdict.delta)}** | |`,
		'',
		'History of every run: `evals/ai-friendliness/results/HISTORY.md`. Formulas and bands: `docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md`.',
	];
	return lines.join('\n');
}

/**
 * Gate the Enterprise Readiness Index: the drop rule plus the coverage no-decrease rule.
 * @param {HistoryEntry} baseline
 * @param {any} run the full run (with `enterprise`)
 * @param {number} maxDrop
 * @returns {{ verdict: ReturnType<typeof evaluateGate>, report: string }|null} null when either side lacks the suite
 */
export function enterpriseVerdict(baseline, run, maxDrop) {
	if (!baseline.enterprise || !run.enterprise) return null;
	const eBaseline = { ...baseline, scores: baseline.enterprise.scores, index: baseline.enterprise.index };
	const eResult = evaluateGate(eBaseline, run.enterprise, { maxDrop });
	const coverage = evaluateCoverageRule(baseline, run);
	const ok = eResult.ok && (coverage?.ok ?? true);
	const tail = eResult.message.slice(eResult.message.indexOf('Index'));
	const coverageNote = coverage ? `; ${coverage.message}` : '';
	const verdict = {
		...eResult,
		ok,
		message: `${ok ? 'PASS' : 'FAIL'} — Enterprise Readiness ${tail}${coverageNote}`,
	};
	const report = formatGateReport(eBaseline, { ...run.enterprise, label: run.label, sha: run.sha }, verdict, {
		maxDrop,
		title: 'Enterprise Readiness Index',
		extra: coverage ? `Coverage rule: ${coverage.message}.` : '',
	});
	return { verdict, report };
}

function main() {
	const argv = process.argv.slice(2);
	/** @type {{ baseline?: string, maxDrop: number, maxDropEnterprise?: number, report?: string }} */
	const args = { maxDrop: 1 };
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--baseline') args.baseline = argv[++i];
		else if (argv[i] === '--max-drop') args.maxDrop = Number(argv[++i]);
		else if (argv[i] === '--max-drop-enterprise') args.maxDropEnterprise = Number(argv[++i]);
		else if (argv[i] === '--report') args.report = argv[++i];
		else throw new Error(`Unknown argument: ${argv[i]}`);
	}
	const history = JSON.parse(fs.readFileSync(insideDir(suiteDir, 'results', 'history.json'), 'utf8'));
	const baseline = pickBaseline(history, args.baseline);
	const json = execFileSync(
		process.execPath,
		[path.join(suiteDir, 'run.mjs'), '--label', 'gate', '--no-write', '--json'],
		{
			encoding: 'utf8',
			maxBuffer: 64 * 1024 * 1024,
			stdio: ['ignore', 'pipe', 'inherit'],
		}
	);
	const run = JSON.parse(json);
	const result = evaluateGate(baseline, run, { maxDrop: args.maxDrop });
	const verdicts = [result];
	/** @type {string[]} */
	const reports = [formatGateReport(baseline, run, result, { maxDrop: args.maxDrop })];
	const enterprise = enterpriseVerdict(baseline, run, args.maxDropEnterprise ?? args.maxDrop);
	if (enterprise) {
		verdicts.push(enterprise.verdict);
		reports.push(enterprise.report);
	} else if (run.enterprise) {
		reports.push('### 📊 Enterprise Readiness Index: first measurement, no baseline yet\n');
	}
	if (args.report) {
		// appended, so it can target $GITHUB_STEP_SUMMARY as well as a fresh file
		fs.appendFileSync(path.resolve(args.report), `${reports.join('\n\n')}\n`);
	}
	for (const v of verdicts) console.log(v.message);
	process.exitCode = verdicts.every((v) => v.ok) ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
