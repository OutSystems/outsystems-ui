import assert from 'node:assert/strict';
import { test } from 'node:test';

import { backfillCategories } from '../tools/backfill-categories.mjs';

const rows = [
	{
		id: 'Content/Tooltip',
		name: 'Tooltip',
		flow: 'Content',
		category: 'component',
		kind: 'pattern',
		runtime: { pattern: 'Tooltip', style: null },
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
const run = (label, extra = {}) => ({
	label,
	date: '2026-09-29T00:00:00.000Z',
	sha: 'abc',
	suites: {
		ai: {
			scores: { E07: 50 },
			index: 50,
			tiers: { pattern: { scores: { E07: 60 }, index: 60 } },
			results: [
				{
					id: 'E07',
					score: 50,
					perComponent: [
						{ name: 'Tooltip', kind: 'pattern', depth: 3, elements: 4, classes: 2, score: 60 },
						{ name: 'btn', kind: 'component', depth: 2, elements: 2, classes: 1, score: 40 },
						...(extra.rows ?? []),
					],
				},
			],
		},
	},
});

test('backfillCategories writes categories into every entry whose run file exists, removes tiers, and reports missing files', () => {
	const history = [
		{
			label: 'a',
			date: '2026-09-29T00:00:00.000Z',
			sha: 'abc',
			suites: { ai: { scores: { E07: 50 }, index: 50, tiers: { pattern: { scores: { E07: 60 }, index: 60 } } } },
		},
		{
			label: 'b',
			date: '2026-09-30T00:00:00.000Z',
			sha: 'def',
			suites: { ai: { scores: { E07: 50 }, index: 50 } },
		},
	];
	const out = backfillCategories(history, (label) => (label === 'a' ? run('a') : null), rows);
	assert.deepEqual(out.missing, ['b']);
	assert.equal(out.history[0].suites.ai.tiers, undefined);
	assert.equal(out.history[0].suites.ai.categories.component.scores.E07, 60);
	assert.equal(out.history[0].suites.ai.categories.platform.scores.E07, 40);
	assert.equal(out.history[1].suites.ai.categories, undefined, 'left as it was');
	assert.equal(out.runs.a.suites.ai.categories.component.index, 60);
	assert.equal(out.runs.a.suites.ai.tiers, undefined);
});

test('backfillCategories drops rows the universe does not know and lists them', () => {
	const history = [
		{
			label: 'a',
			date: '2026-09-29T00:00:00.000Z',
			sha: 'abc',
			suites: { ai: { scores: { E07: 50 }, index: 50 } },
		},
	];
	const out = backfillCategories(
		history,
		() => {
			const r = run('a', { rows: [{ name: 'Renamed', kind: 'pattern', score: 10 }] });
			// a non-heatmap eval's rows (files) and an ignored name are never reported
			r.suites.ai.results.push({ id: 'E04', score: 100, perComponent: [{ name: 'src/x.ts', score: 1 }] });
			r.suites.ai.results[0].perComponent.push({ name: 'Content/DEPRECATED_Card', score: 5 });
			return r;
		},
		rows,
		{ ignore: new Set(['Content/DEPRECATED_Card']) }
	);
	assert.deepEqual(out.dropped, [{ label: 'a', suite: 'ai', names: ['Renamed'] }]);
	assert.equal(out.history[0].suites.ai.categories.component.scores.E07, 60);
});

test('backfillCategories is idempotent', () => {
	const history = [
		{
			label: 'a',
			date: '2026-09-29T00:00:00.000Z',
			sha: 'abc',
			suites: { ai: { scores: { E07: 50 }, index: 50 } },
		},
	];
	const once = backfillCategories(history, () => run('a'), rows);
	const twice = backfillCategories(once.history, () => once.runs.a, rows);
	assert.deepEqual(twice.history, once.history);
});
