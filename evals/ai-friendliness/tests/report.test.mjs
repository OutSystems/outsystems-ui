import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { HISTORY_FILE, renderHistory } from '../tools/report.mjs';

const suiteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const evals = [
	{ id: 'E01', name: 'Context Token Cost', movable: true },
	{ id: 'E07', name: 'Markup Depth', movable: false },
];
const history = [
	{ label: 'baseline', date: '2026-09-29T09:00:00Z', sha: 'aaaaaaaaa', scores: { E01: 64.9, E07: 75.1 }, index: 70 },
	{ label: 'loop-1', date: '2026-09-29T10:00:00Z', sha: 'bbbbbbbbb', scores: { E01: 100, E07: 75.1 }, index: 87.6 },
];

test('renderHistory lists every run with its delta against the previous run and the baseline', () => {
	const md = renderHistory(history, evals);
	assert.match(md, /\| baseline \| 2026-09-29 \| `aaaaaaaaa` \| 64\.9 \| 75\.1 \| \*\*70\.0\*\* \| — \| — \|/);
	assert.match(
		md,
		/\| loop-1 \| 2026-09-29 \| `bbbbbbbbb` \| 100\.0 \| 75\.1 \| \*\*87\.6\*\* \| \+17\.6 \| \+17\.6 \|/
	);
});

test('renderHistory has one row per eval with its total movement and movability', () => {
	const md = renderHistory(history, evals);
	assert.match(md, /\| E01 \| Context Token Cost \| movable \| 64\.9 \| 100\.0 \| \*\*\+35\.1\*\* \|/);
	assert.match(md, /\| E07 \| Markup Depth \| structural \| 75\.1 \| 75\.1 \| 0\.0 \|/);
});

test('renderHistory names the biggest movers and the evals that never moved', () => {
	const md = renderHistory(history, evals);
	assert.match(md, /E01 Context Token Cost \+35\.1/);
	assert.match(md, /E07 Markup Depth/);
});

test('renderHistory orders runs by date whatever the input order', () => {
	const md = renderHistory([history[1], history[0]], evals);
	assert.ok(md.indexOf('| baseline |') < md.indexOf('| loop-1 |'));
});

test('the committed HISTORY.md is fresh', async () => {
	const { metrics } = await import('../metrics/index.mjs');
	const { metrics: enterprise } = await import('../../enterprise/metrics/index.mjs');
	const stored = JSON.parse(fs.readFileSync(path.join(suiteDir, 'results', 'history.json'), 'utf8'));
	const committed = fs.readFileSync(path.join(suiteDir, HISTORY_FILE), 'utf8').replace(/\r\n/g, '\n');
	assert.equal(
		committed,
		renderHistory(stored, metrics, enterprise),
		'run `npm run evals:report` and commit results/HISTORY.md'
	);
});

test('renderHistory adds the Enterprise Readiness section only for the runs that carry it', () => {
	const rEvals = [
		{ id: 'R01', name: 'Coverage', movable: false, cls: 'roadmap' },
		{ id: 'R02', name: 'A11y', movable: true },
	];
	const withEnterprise = [history[0], { ...history[1], enterprise: { scores: { R01: 68.9, R02: 31 }, index: 50 } }];
	const md = renderHistory(withEnterprise, evals, rEvals);
	assert.match(md, /## Enterprise Readiness Index/);
	assert.match(md, /Measured from `loop-1` on/);
	assert.match(md, /\| loop-1 \| 2026-09-29 \| `bbbbbbbbb` \| 68\.9 \| 31\.0 \| \*\*50\.0\*\* \| — \| — \|/);
	assert.match(md, /\| R01 \| Coverage \| roadmap \| 68\.9 \| 0\.0 \|/);
	assert.doesNotMatch(renderHistory(history, evals, rEvals), /Enterprise Readiness/, 'no section without the suite');
});
