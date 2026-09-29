#!/usr/bin/env node
// @ts-check
/**
 * AI-friendliness regression gate.
 *
 *   node evals/ai-friendliness/tools/gate.mjs [--baseline <label>] [--max-drop 1] [--report <file.md>]
 *
 * Runs the suite without writing results, compares the index with the newest entry of
 * results/history.json (or the given label) and exits 1 when it dropped by more than
 * `--max-drop` points. `--report` appends a Markdown before/after table to a file (for a PR
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
 * @typedef {{ label: string, date: string, sha: string, scores: Record<string, number>, index: number }} HistoryEntry
 */

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

/**
 * Markdown "before → after" report for a PR check: one row per eval, the index, and the verdict.
 * @param {HistoryEntry} baseline
 * @param {{ label: string, sha?: string, index: number, scores: Record<string, number>, results: { id: string, name: string, movable: boolean, summary?: string }[] }} run
 * @param {ReturnType<typeof evaluateGate>} verdict
 * @param {{ maxDrop?: number }} [options]
 */
export function formatGateReport(baseline, run, verdict, { maxDrop = 1 } = {}) {
	/** @param {number} d */
	const signed = (d) => (d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1));
	const status = verdict.ok ? '✅ **Passed**' : '❌ **Failed**';
	const lines = [
		`### 📊 AI-Friendliness Index: ${status}`,
		'',
		`${baseline.index.toFixed(1)} → **${run.index.toFixed(1)}** (${signed(verdict.delta)}); baseline \`${baseline.label}\` @ \`${baseline.sha}\`, this run @ \`${run.sha ?? 'unknown'}\`, tolerance −${maxDrop}.`,
		'',
		'| ID | Eval | Before | After | Δ | Notes |',
		'| --- | --- | ---: | ---: | ---: | --- |',
	];
	for (const r of run.results) {
		const before = baseline.scores[r.id];
		const after = run.scores[r.id] ?? 0;
		const d = before === undefined ? null : Math.round((after - before) * 10) / 10;
		const mark = d === null ? 'new' : d < 0 ? `🔻 ${signed(d)}` : d > 0 ? `🔼 ${signed(d)}` : '0.0';
		const movable = r.movable ? '' : ' _(structural)_';
		lines.push(
			`| ${r.id} | ${r.name}${movable} | ${before === undefined ? '—' : before.toFixed(1)} | ${after.toFixed(1)} | ${mark} | ${r.summary ?? ''} |`
		);
	}
	lines.push(
		`| — | **Index** | **${baseline.index.toFixed(1)}** | **${run.index.toFixed(1)}** | **${signed(verdict.delta)}** | |`
	);
	lines.push(
		'',
		'History of every run: `evals/ai-friendliness/results/HISTORY.md`. Formulas and bands: `docs-internal/ai-friendliness/2026-09-29-eval-suite-design.md`.'
	);
	return lines.join('\n');
}

function main() {
	const argv = process.argv.slice(2);
	/** @type {{ baseline?: string, maxDrop: number, report?: string }} */
	const args = { maxDrop: 1 };
	for (let i = 0; i < argv.length; i++) {
		if (argv[i] === '--baseline') args.baseline = argv[++i];
		else if (argv[i] === '--max-drop') args.maxDrop = Number(argv[++i]);
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
	if (args.report) {
		// appended, so it can target $GITHUB_STEP_SUMMARY as well as a fresh file
		fs.appendFileSync(
			path.resolve(args.report),
			`${formatGateReport(baseline, run, result, { maxDrop: args.maxDrop })}\n`
		);
	}
	console.log(result.message);
	process.exitCode = result.ok ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
