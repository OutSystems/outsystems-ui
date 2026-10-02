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
	assert.equal(M01.present.heatmap, false);
	assert.equal(M01.present.extra(r).blocksM01.rows.length, 0);
});
