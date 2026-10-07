import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
	aggregate,
	categorySummary,
	compareRuns,
	formatTable,
	historyEntryOf,
	normalizeHistoryEntry,
	normalizeRun,
	projectedValue,
	upsertHistory,
} from '../lib/results.mjs';
import { rowIndex } from '../lib/universe.mjs';

const universeRows = [
	{
		id: 'Interaction/DropdownSearch',
		name: 'DropdownSearch',
		flow: 'Interaction',
		category: 'component',
		kind: 'pattern',
		runtime: { pattern: 'Dropdown', style: null },
		platform: 'ODC',
	},
	{
		id: 'Interaction/DropdownTags',
		name: 'DropdownTags',
		flow: 'Interaction',
		category: 'component',
		kind: 'pattern',
		runtime: { pattern: 'Dropdown', style: null },
		platform: 'ODC',
	},
	{
		id: 'Content/Card',
		name: 'Card',
		flow: 'Content',
		category: 'component',
		kind: 'component',
		runtime: { pattern: null, style: 'card' },
		platform: 'ODC',
	},
	{
		id: 'Adaptive/Columns2',
		name: 'Columns2',
		flow: 'Adaptive',
		category: 'component',
		kind: 'block',
		runtime: { pattern: null, style: null },
		platform: 'ODC',
	},
	{
		id: 'btn',
		name: 'btn',
		flow: null,
		category: 'platform',
		kind: 'component',
		runtime: { pattern: null, style: 'btn' },
		platform: '',
	},
];
const universeMetrics = [
	{ id: 'E02', present: { heatmap: true, appliesTo: ['pattern'] } },
	{
		id: 'E07',
		present: { heatmap: true, appliesTo: ['pattern', 'component', 'layout'], cell: (r) => ({ s: r.depthScore }) },
	},
	{ id: 'M03', present: { heatmap: true, appliesTo: ['block'] } },
	{ id: 'E04', present: { heatmap: false, appliesTo: ['pattern'] } },
	{ id: 'U01', present: { heatmap: true, appliesTo: ['utility'] } },
];
const universeResults = [
	{ id: 'E02', score: 90, perComponent: [{ name: 'Dropdown', score: 80 }] },
	{
		id: 'E07',
		score: 70,
		perComponent: [
			{ name: 'Dropdown', depthScore: 60 },
			{ name: 'card', depthScore: 100 },
			{ name: 'btn', depthScore: 40 },
		],
	},
	{
		id: 'M03',
		score: 75,
		perComponent: [
			{ name: 'Interaction/DropdownSearch', score: 50 },
			{ name: 'Content/Card', score: 100 },
			{ name: 'Adaptive/Columns2', score: 90 },
		],
	},
	{ id: 'E04', score: 100, perComponent: [] },
	{ id: 'U01', score: 30, perComponent: [{ name: 'text', score: 30 }] },
];

test('projectedValue reads a block row from its own eval row, else from its pattern, else from its stylesheet', () => {
	const index = rowIndex(universeRows);
	const [r0, r1, r2, , r4] = universeRows;
	const [e02, e07, m03] = universeResults;
	assert.equal(projectedValue(m03, universeMetrics[2].present, r0, index), 50);
	assert.equal(projectedValue(e02, universeMetrics[0].present, r1, index), 80, 'DropdownTags inherits Dropdown');
	assert.equal(
		projectedValue(e07, universeMetrics[1].present, r2, index),
		100,
		'Card inherits card through present.cell'
	);
	assert.equal(projectedValue(e02, universeMetrics[0].present, r2, index), null, 'no pattern, no E02 value');
	assert.equal(
		projectedValue(e07, universeMetrics[1].present, r4, index),
		40,
		'a platform row reads its own stylesheet'
	);
});

test('categorySummary: each block weighs once, shared patterns twice, non-heatmap evals by score, absent categories omitted', () => {
	const s = categorySummary(universeResults, universeRows, universeMetrics);
	assert.deepEqual(Object.keys(s), ['component', 'platform']);
	// component: E02 over DropdownSearch, DropdownTags (80, 80) = 80; E07 over the two Dropdown blocks and Card (60, 60, 100) = 73.3;
	// M03 over three blocks (50, 100, 90) = 80; E04 non-heatmap = 100; U01 applies to no component row → absent
	assert.deepEqual(s.component.scores, { E02: 80, E07: 73.3, M03: 80, E04: 100 });
	assert.equal(s.component.index, 83.3);
	assert.deepEqual(s.platform.scores, { E07: 40 });
	assert.equal(s.platform.index, 40);
	assert.deepEqual(
		categorySummary(
			universeResults,
			universeRows.filter((r) => r.category === 'platform'),
			universeMetrics
		),
		{ platform: { scores: { E07: 40 }, index: 40 } }
	);
	const entry = historyEntryOf({
		label: 'l',
		date: 'd',
		sha: 's',
		suites: {
			ai: {
				scores: { E02: 90 },
				index: 90,
				results: universeResults,
				categories: s,
				tiers: { pattern: { scores: {}, index: 0 } },
			},
		},
	});
	assert.deepEqual(entry.suites.ai.categories.platform, { scores: { E07: 40 }, index: 40 });
	assert.equal(entry.suites.ai.tiers, undefined, 'tiers are never written again');
});

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

test('two snapshots: a pattern feeds the row of each platform and the block evals read their own platform row', () => {
	const two = [
		{
			id: 'Content/Tooltip (O11)',
			name: 'Tooltip',
			flow: 'Content',
			category: 'component',
			kind: 'pattern',
			runtime: { pattern: 'Tooltip', style: null },
			platform: 'O11',
		},
		{
			id: 'Content/Tooltip (ODC)',
			name: 'Tooltip',
			flow: 'Content',
			category: 'component',
			kind: 'pattern',
			runtime: { pattern: 'Tooltip', style: null },
			platform: 'ODC',
		},
	];
	const metrics = [
		{ id: 'E02', present: { heatmap: true, appliesTo: ['pattern'] } },
		{ id: 'M03', present: { heatmap: true, appliesTo: ['block'] } },
	];
	const results = [
		{ id: 'E02', score: 80, perComponent: [{ name: 'Tooltip', score: 80 }] },
		{
			id: 'M03',
			score: 60,
			perComponent: [
				{ name: 'Content/Tooltip (O11)', score: 40 },
				{ name: 'Content/Tooltip (ODC)', score: 80 },
			],
		},
	];
	const index = rowIndex(two);
	assert.equal(projectedValue(results[0], metrics[0].present, two[0], index), 80);
	assert.equal(projectedValue(results[0], metrics[0].present, two[1], index), 80);
	assert.equal(projectedValue(results[1], metrics[1].present, two[0], index), 40);
	assert.equal(projectedValue(results[1], metrics[1].present, two[1], index), 80);
	assert.deepEqual(categorySummary(results, two, metrics).component, { scores: { E02: 80, M03: 60 }, index: 70 });
});
