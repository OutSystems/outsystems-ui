import assert from 'node:assert/strict';
import { test } from 'node:test';

import M03, { measureBlock, scorePrecision } from '../metrics/M03-parameter-precision.mjs';
import { sample } from './snapshot.test.mjs';

test('scorePrecision weights descriptions, defaults and precise types', () => {
	assert.equal(scorePrecision({ params: 4, described: 4, optional: 2, defaulted: 2, precise: 4 }), 100);
	assert.equal(scorePrecision({ params: 4, described: 2, optional: 0, defaulted: 0, precise: 2 }), 65);
	assert.equal(scorePrecision({ params: 2, described: 0, optional: 2, defaulted: 1, precise: 0 }), 15);
});

test('measureBlock counts the sample block: 3 params, 2 described, 3 optional, 2 defaulted, 2 precise', () => {
	const block = sample().blocks['Interaction/Carousel'];
	assert.deepEqual(measureBlock(block), {
		params: 3,
		described: 2,
		optional: 3,
		defaulted: 2,
		precise: 2,
		freeText: ['ExtendedClass'],
		undescribed: ['Color'],
		undefaulted: ['ItemsPerSlide'],
	});
});

test('M03 marks blocks without parameters and non-public blocks as not applicable', () => {
	const snap = sample();
	snap.blocks['Content/Public'] = { ...snap.blocks['Content/Internal'], public: true };
	const r = M03.compute(/** @type {any} */ ({ modelSnapshots: () => [snap] }));
	assert.equal(r.perComponent.length, 1);
	assert.deepEqual(r.notApplicable.map((n) => n.name).sort(), ['Content/Internal', 'Content/Public']);
	assert.equal(M03.present.heatmap, false);
	assert.equal(M03.present.extra(r).blocksM03.rows.length, 1);
});

test('M03 scores 0 with an empty table when no public block has parameters', () => {
	const snap = sample();
	delete snap.blocks['Interaction/Carousel'];
	const r = M03.compute(/** @type {any} */ ({ modelSnapshots: () => [snap] }));
	assert.equal(r.score, 0);
	assert.deepEqual(r.perComponent, []);
});
