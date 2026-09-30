import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
	aggregate,
	compareRuns,
	formatTable,
	historyEntryOf,
	normalizeHistoryEntry,
	normalizeRun,
	upsertHistory,
} from '../lib/results.mjs';

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
	assert.match(lines[0], /^\| ID \| Eval \| Score \| Class \|/);
	assert.equal(lines.length, 2 + results.length + 1, 'header, separator, rows, index');
	assert.match(lines[lines.length - 1], /Index.*50\.4/);
});

test('normalizeHistoryEntry lifts the legacy shape into suites and leaves the new shape alone', () => {
	const legacy = {
		label: 'loop-6',
		date: 'd',
		sha: 'a',
		scores: { E01: 1 },
		index: 1,
		enterprise: { scores: { R01: 2 }, index: 2 },
	};
	const n = normalizeHistoryEntry(legacy);
	assert.deepEqual(n, {
		label: 'loop-6',
		date: 'd',
		sha: 'a',
		suites: { ai: { scores: { E01: 1 }, index: 1 }, enterprise: { scores: { R01: 2 }, index: 2 } },
	});
	assert.deepEqual(normalizeHistoryEntry({ label: 'b', date: 'd', sha: 'a', scores: { E01: 1 }, index: 1 }).suites, {
		ai: { scores: { E01: 1 }, index: 1 },
	});
	const fresh = { label: 'dev-1', date: 'd', sha: 'a', branch: 'dev', suites: { ai: { scores: {}, index: 0 } } };
	assert.equal(normalizeHistoryEntry(fresh), fresh);
});

test('normalizeRun lifts a legacy run file into suites with their results', () => {
	const legacy = {
		label: 'loop-6',
		sha: 'a',
		scores: { E01: 1 },
		index: 1,
		results: [{ id: 'E01' }],
		enterprise: { scores: { R01: 2 }, index: 2, results: [{ id: 'R01' }] },
	};
	const n = normalizeRun(legacy);
	assert.deepEqual(Object.keys(n.suites), ['ai', 'enterprise']);
	assert.deepEqual(n.suites.enterprise.results, [{ id: 'R01' }]);
	assert.equal(n.scores, undefined, 'the legacy top-level fields are gone');
	assert.equal(n.label, 'loop-6');
});

test('historyEntryOf keeps label, date, sha and branch and, per suite, scores, index and unmeasured counts', () => {
	const run = {
		label: 'x',
		date: 'd',
		sha: 's',
		branch: 'dev',
		suites: {
			ai: {
				scores: { E07: 90 },
				index: 90,
				results: [{ id: 'E07', unmeasured: [{ name: 'a' }, { name: 'b' }], notApplicable: [{ name: 'c' }] }],
			},
		},
	};
	assert.deepEqual(historyEntryOf(run), {
		label: 'x',
		date: 'd',
		sha: 's',
		branch: 'dev',
		suites: { ai: { scores: { E07: 90 }, index: 90, unmeasured: { E07: 2 } } },
	});
});
