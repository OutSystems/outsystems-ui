import assert from 'node:assert/strict';
import { test } from 'node:test';

import M01, { scoreBlockFacets, scoreEval } from '../metrics/M01-block-manifest.mjs';
import { sample } from './snapshot.test.mjs';

const block = {
	...sample().blocks['Interaction/Carousel'],
	key: 'Interaction/Carousel',
	label: 'Interaction/Carousel',
	platform: 'ODC',
};

test('a complete manifest entry scores 100; a missing entry 0 with every facet at 0', () => {
	const entry = {
		params: block.inputParameters.map((p) => ({
			...p,
			description: p.description || 'x',
			default: p.mandatory ? null : (p.default ?? '""'),
		})),
		placeholders: [{ name: 'CarouselItems', description: 'The slides.' }],
		events: [
			{
				name: 'OnSlideMoved',
				description: 'Fires after a move.',
				parameters: [{ name: 'Position', type: 'Integer', description: 'Index.' }],
			},
		],
		recipes: { openui: 'x = Block(…)', tsx: '<Carousel …/>' },
		pattern: 'Carousel',
		hints: ['CarouselAPI'],
	};
	assert.equal(scoreBlockFacets(block, entry).score, 100);
	const missing = scoreBlockFacets(block, undefined);
	assert.equal(missing.score, 0);
	assert.deepEqual(Object.values(missing.facets), [0, 0, 0, 0, 0]);
});

test('facets are prorated and a facet with nothing to cover is omitted', () => {
	const entry = {
		params: block.inputParameters.map((p, i) => ({
			...p,
			description: i === 0 ? 'x' : '',
			default: i === 0 ? '…' : null,
		})),
		placeholders: [{ name: 'CarouselItems', description: '' }],
		events: [
			{
				name: 'OnSlideMoved',
				description: '',
				parameters: [{ name: 'Position', type: 'Integer', description: '' }],
			},
		],
		recipes: { openui: 'x', tsx: '' },
		pattern: null,
		hints: ['CarouselAPI'],
	};
	const r = scoreBlockFacets(block, entry);
	assert.deepEqual(r.facets, { params: 33.3, placeholders: 0, events: 0, recipes: 50, pattern: 0 });
	const bare = { ...block, inputParameters: [], placeholders: [], events: [], patternHints: { apiCalls: [] } };
	const bareEntry = {
		params: [],
		placeholders: [],
		events: [],
		recipes: { openui: 'x', tsx: 'y' },
		pattern: null,
		hints: [],
	};
	assert.deepEqual(scoreBlockFacets(bare, bareEntry).facets, {
		params: null,
		placeholders: null,
		events: null,
		recipes: 100,
		pattern: 100,
	});
	assert.equal(scoreBlockFacets(bare, bareEntry).score, 100);
});

test('scoreEval multiplies the mean by manifest coverage and is 0 without blocks', () => {
	assert.equal(scoreEval({ blockScores: [100, 50], entries: 2, blocks: 4 }), 37.5);
	assert.equal(scoreEval({ blockScores: [], entries: 0, blocks: 0 }), 0);
});

test('M01 scores 0 and lists every block as not applicable when no block is public', () => {
	const only = { ...sample(), blocks: { 'Content/Internal': sample().blocks['Content/Internal'] } };
	const ctx = { docsAi: () => null, modelSnapshots: () => [only] };
	const r = M01.compute(/** @type {any} */ (ctx));
	assert.equal(r.score, 0);
	assert.deepEqual(r.perComponent, []);
	assert.equal(r.notApplicable.length, 1);
	assert.equal(M01.present.heatmap, true);
	assert.equal(M01.present.extra(r).blocksM01.rows.length, 0);
});

test('M01 missing and do name the facets under 100 and where to fix each', async () => {
	const { missingOf, doOf } = await import('../metrics/M01-block-manifest.mjs');
	const row = {
		present: true,
		facets: { params: 71.4, placeholders: 100, events: 0, recipes: 100, pattern: 0 },
		counts: { params: [5, 7], placeholders: [1, 1], events: [0, 2] },
		hints: ['TooltipAPI'],
	};
	assert.equal(missingOf(row), 'params 5/7, events 0/2, pattern link');
	assert.equal(
		doOf(row),
		'OML: describe and default the parameters; OML: describe the events and their payloads; components.json: link the block to Tooltip'
	);
	const complete = {
		present: true,
		facets: { params: 100, placeholders: null, events: null, recipes: 100, pattern: 100 },
		counts: {},
		hints: [],
	};
	assert.equal(missingOf(complete), 'nothing');
	assert.equal(doOf(complete), '');
	assert.equal(missingOf({ present: false, facets: {}, counts: {}, hints: [] }), 'entry in docs-ai/osui.blocks.json');
	assert.equal(doOf({ present: false, facets: {}, counts: {}, hints: [] }), 'npm run docs:ai');
});

test('M01 is a heatmap eval over block rows and its table carries Missing and Do', () => {
	assert.equal(M01.present.heatmap, true);
	assert.deepEqual(M01.present.appliesTo, ['block']);
	const row = {
		label: 'Content/Card',
		score: 50,
		present: true,
		facets: { params: 50, placeholders: null, events: null, recipes: 100, pattern: 100 },
		counts: { params: [1, 2] },
		hints: [],
	};
	const table = M01.present.extra({ perComponent: [row] }).blocksM01;
	assert.deepEqual(table.columns, ['Block', 'Score', 'Missing', 'Do']);
	assert.match(table.lead, /^100 = /);
	assert.deepEqual(table.rows[0], ['Content/Card', '50', 'params 1/2', 'OML: describe and default the parameters']);
	assert.equal(M01.present.cell(row).s, 50);
	assert.match(M01.present.cell(row).h, /Missing: params 1\/2\. Do: OML: describe and default the parameters\./);
});
