import assert from 'node:assert/strict';
import { test } from 'node:test';

import { linksFor, patternOfBlock } from '../lib/crosswalk.mjs';
import { flattenBlocks } from '../lib/snapshot.mjs';
import { sample } from './snapshot.test.mjs';

const blocks = flattenBlocks([sample()]); // [Content/Internal, Interaction/Carousel]

test('linksFor prefers the registry and falls back to the snapshot hints', () => {
	const reg = {
		components: {
			Carousel: {
				kind: 'pattern',
				block: [{ flow: 'Interaction', name: 'Carousel', paramMap: { Color: 'Color' } }],
			},
		},
	};
	assert.deepEqual(
		linksFor('Carousel', reg, blocks).map((l) => [l.key, l.source, l.paramMap]),
		[['Interaction/Carousel', 'registry', { Color: 'Color' }]]
	);
	assert.deepEqual(
		linksFor('Carousel', { components: { Carousel: { kind: 'pattern' } } }, blocks).map((l) => [l.key, l.source]),
		[['Interaction/Carousel', 'hint']]
	);
	assert.deepEqual(linksFor('Tabs', { components: {} }, blocks), []);
});

test('patternOfBlock resolves a registry link, a single hint, and nothing otherwise', () => {
	const reg = { components: { Carousel: { kind: 'pattern', block: [{ flow: 'Interaction', name: 'Carousel' }] } } };
	assert.deepEqual(patternOfBlock(blocks[1], ['Carousel'], reg), { pattern: 'Carousel', source: 'registry' });
	assert.deepEqual(patternOfBlock(blocks[1], ['Carousel'], { components: {} }), {
		pattern: 'Carousel',
		source: 'hint',
	});
	assert.deepEqual(patternOfBlock(blocks[1], ['Tabs'], { components: {} }), { pattern: null, source: null });
	assert.deepEqual(patternOfBlock(blocks[0], ['Carousel'], { components: {} }), { pattern: null, source: null });
});

test('patternOfBlock ignores stylesheet entries: a block linked from a CSS-only component has no pattern', () => {
	const registry = {
		components: {
			card: { kind: 'component', block: [{ flow: 'Content', name: 'Card' }] },
			Tooltip: { kind: 'pattern', block: [{ flow: 'Content', name: 'Tooltip', paramMap: {} }] },
		},
	};
	const block = (flow, name) => ({
		flow,
		name,
		key: `${flow}/${name}`,
		label: `${flow}/${name}`,
		public: true,
		patternHints: { apiCalls: [] },
	});
	assert.deepEqual(patternOfBlock(block('Content', 'Card'), ['Tooltip'], registry), {
		pattern: null,
		source: 'registry',
	});
	assert.deepEqual(patternOfBlock(block('Content', 'Tooltip'), ['Tooltip'], registry), {
		pattern: 'Tooltip',
		source: 'registry',
	});
});

test('patternOfBlock never falls back to an API hint for a block the registry links from a stylesheet', () => {
	const registry = {
		components: {
			card: { kind: 'component', block: [{ flow: 'Content', name: 'Card' }] },
			Tooltip: { kind: 'pattern' },
		},
	};
	const block = {
		flow: 'Content',
		name: 'Card',
		key: 'Content/Card',
		label: 'Content/Card',
		public: true,
		patternHints: { apiCalls: ['TooltipAPI'] },
	};
	assert.deepEqual(patternOfBlock(block, ['Tooltip'], registry), { pattern: null, source: 'registry' });
});
