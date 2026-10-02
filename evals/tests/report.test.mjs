import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { HISTORY_FILE, renderHistory } from '../tools/report.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ai = {
	id: 'ai',
	indexName: 'AI-Friendliness Index',
	describe: 'how legible the library is to coding agents',
	metrics: [
		{ id: 'E01', name: 'Context Token Cost', movable: true },
		{ id: 'E07', name: 'Markup Depth', movable: false },
	],
};
const enterprise = {
	id: 'enterprise',
	indexName: 'Enterprise Readiness Index',
	describe: 'how far the theme meets the enterprise requirements',
	metrics: [
		{ id: 'R01', name: 'Coverage', movable: false, cls: 'roadmap' },
		{ id: 'R02', name: 'A11y', movable: true },
	],
};
// the previous history shape is accepted as is
const history = [
	{ label: 'baseline', date: '2026-09-29T09:00:00Z', sha: 'aaaaaaaaa', scores: { E01: 64.9, E07: 75.1 }, index: 70 },
	{ label: 'loop-1', date: '2026-09-29T10:00:00Z', sha: 'bbbbbbbbb', scores: { E01: 100, E07: 75.1 }, index: 87.6 },
];

test('renderHistory lists every run with its delta against the previous run and the baseline', () => {
	const md = renderHistory(history, [ai]);
	assert.match(md, /\| baseline \| 2026-09-29 \| `aaaaaaaaa` \| 64\.9 \| 75\.1 \| \*\*70\.0\*\* \| — \| — \|/);
	assert.match(
		md,
		/\| loop-1 \| 2026-09-29 \| `bbbbbbbbb` \| 100\.0 \| 75\.1 \| \*\*87\.6\*\* \| \+17\.6 \| \+17\.6 \|/
	);
});

test('renderHistory has one row per eval with its total movement and movability', () => {
	const md = renderHistory(history, [ai]);
	assert.match(md, /\| E01 \| Context Token Cost \| movable \| 64\.9 \| 100\.0 \| \*\*\+35\.1\*\* \|/);
	assert.match(md, /\| E07 \| Markup Depth \| structural \| 75\.1 \| 75\.1 \| 0\.0 \|/);
});

test('renderHistory names the biggest movers and the evals that never moved', () => {
	const md = renderHistory(history, [ai]);
	assert.match(md, /E01 Context Token Cost \+35\.1/);
	assert.match(md, /E07 Markup Depth/);
});

test('renderHistory orders runs by date whatever the input order', () => {
	const md = renderHistory([history[1], history[0]], [ai]);
	assert.ok(md.indexOf('| baseline |') < md.indexOf('| loop-1 |'));
});

test('renderHistory adds a section per suite, only for the runs that carry it', () => {
	const withEnterprise = [
		history[0],
		{
			label: 'loop-1',
			date: '2026-09-29T10:00:00Z',
			sha: 'bbbbbbbbb',
			branch: 'dev',
			suites: {
				ai: { scores: { E01: 100, E07: 75.1 }, index: 87.6 },
				enterprise: { scores: { R01: 68.9, R02: 31 }, index: 50 },
			},
		},
	];
	const md = renderHistory(withEnterprise, [ai, enterprise]);
	assert.match(md, /## AI-Friendliness Index/);
	assert.match(md, /## Enterprise Readiness Index/);
	assert.match(md, /Measured from `loop-1` on/);
	assert.match(md, /\| loop-1 \| 2026-09-29 \| `bbbbbbbbb` \| 68\.9 \| 31\.0 \| \*\*50\.0\*\* \| — \| — \|/);
	assert.match(md, /\| R01 \| Coverage \| roadmap \| 68\.9 \| 0\.0 \|/);
	assert.doesNotMatch(
		renderHistory(history, [ai, enterprise]),
		/Enterprise Readiness/,
		'no section without the suite'
	);
});

test('the committed HISTORY.md is fresh', async () => {
	const { SUITES } = await import('../suites.mjs');
	const stored = JSON.parse(fs.readFileSync(path.join(evalsDir, 'results', 'history.json'), 'utf8'));
	const committed = fs.readFileSync(path.join(evalsDir, HISTORY_FILE), 'utf8').replace(/\r\n/g, '\n');
	assert.equal(committed, renderHistory(stored, SUITES), 'run `npm run evals:report` and commit results/HISTORY.md');
});

test('renderHistory adds an "Index by category" table for the runs that carry categories', () => {
	const runs = [
		{
			label: 'r1',
			date: '2026-09-29T00:00:00.000Z',
			sha: 'aaa',
			suites: { ai: { scores: { E01: 10 }, index: 10 } },
		},
		{
			label: 'r2',
			date: '2026-09-30T00:00:00.000Z',
			sha: 'bbb',
			suites: {
				ai: {
					scores: { E01: 20 },
					index: 20,
					categories: {
						component: { scores: { E01: 25 }, index: 25 },
						platform: { scores: { E01: 15 }, index: 15 },
					},
				},
			},
		},
	];
	const md = renderHistory(runs, [ai]);
	assert.match(md, /### Index by category/);
	assert.match(md, /\| Run \| components \(OML blocks\) \| platform & layout styles \|/);
	assert.match(md, /\| r1 \| — \| — \|/);
	assert.match(md, /\| r2 \| \*\*25\.0\*\* \| \*\*15\.0\*\* \|/);
	assert.ok(!/\btiers?\b/i.test(md), 'no tier wording');
});
