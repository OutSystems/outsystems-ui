import assert from 'node:assert/strict';
import { test } from 'node:test';

import { aggregate, compareRuns, formatTable, upsertHistory } from '../lib/results.mjs';

const results = [
	{ id: 'E01', name: 'Context Token Cost', score: 71.24, movable: true, raw: { meanTokens: 2400 } },
	{ id: 'E02', name: 'Prop Surface', score: 80, movable: true, raw: {} },
	{ id: 'E03', name: 'Schema', score: 0, movable: true, raw: {} },
];

test('aggregate rounds scores to one decimal and computes the unweighted index', () => {
	const a = aggregate(results);
	assert.deepEqual(a.scores, { E01: 71.2, E02: 80, E03: 0 });
	assert.equal(a.index, 50.4);
});

test('upsertHistory replaces an entry with the same label and appends new ones', () => {
	const h1 = upsertHistory([], { label: 'baseline', date: 'd1', sha: 'a', scores: { E01: 1 }, index: 1 });
	const h2 = upsertHistory(h1, { label: 'loop-1', date: 'd2', sha: 'b', scores: { E01: 2 }, index: 2 });
	const h3 = upsertHistory(h2, { label: 'baseline', date: 'd3', sha: 'c', scores: { E01: 3 }, index: 3 });
	assert.equal(h3.length, 2);
	assert.deepEqual(
		h3.map((e) => [e.label, e.sha]),
		[
			['baseline', 'c'],
			['loop-1', 'b'],
		]
	);
});

test('compareRuns lists per-metric deltas and the index delta', () => {
	const a = { label: 'baseline', scores: { E01: 50, E02: 80 }, index: 65 };
	const b = { label: 'loop-1', scores: { E01: 60, E02: 80 }, index: 70 };
	const c = compareRuns(a, b);
	assert.deepEqual(c.rows, [
		{ id: 'E01', from: 50, to: 60, delta: 10 },
		{ id: 'E02', from: 80, to: 80, delta: 0 },
	]);
	assert.equal(c.indexDelta, 5);
});

test('formatTable renders a markdown table with one row per metric and an index row', () => {
	const table = formatTable({ label: 'baseline', sha: 'abc1234', results, ...aggregate(results) });
	const lines = table.trim().split('\n');
	assert.match(lines[0], /^\| ID \| Eval \| Score \| Movable \|/);
	assert.equal(lines.length, 2 + results.length + 1, 'header, separator, rows, index');
	assert.match(lines[lines.length - 1], /Index.*50\.4/);
});
