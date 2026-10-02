import assert from 'node:assert/strict';
import { test } from 'node:test';

import M03, { measureBlock, scorePrecision } from '../metrics/M03-parameter-precision.mjs';
import { sample } from './snapshot.test.mjs';

test('scorePrecision weighs descriptions 60 and precise types 40; defaults come from the platform and are not scored', () => {
	assert.equal(scorePrecision({ params: 4, described: 4, precise: 4 }), 100);
	assert.equal(scorePrecision({ params: 4, described: 2, precise: 2 }), 50);
	assert.equal(scorePrecision({ params: 2, described: 0, precise: 0 }), 0);
	assert.equal(scorePrecision({ params: 5, described: 5, precise: 2 }), 76);
});

test('measureBlock counts the sample block: every optional param has a default (OML or platform), ExtendedClass is Text on purpose', () => {
	const block = sample().blocks['Interaction/Carousel'];
	assert.deepEqual(measureBlock(block), {
		params: 3,
		described: 2,
		optional: 3,
		defaulted: 3,
		platformDefaulted: ['ItemsPerSlide'],
		precise: 3,
		freeText: [],
		undescribed: ['Color'],
	});
});

test('M03 marks blocks without parameters and non-public blocks as not applicable', () => {
	const snap = sample();
	snap.blocks['Content/Public'] = { ...snap.blocks['Content/Internal'], public: true };
	const r = M03.compute(/** @type {any} */ ({ modelSnapshots: () => [snap] }));
	assert.equal(r.perComponent.length, 1);
	assert.deepEqual(r.notApplicable.map((n) => n.name).sort(), ['Content/Internal', 'Content/Public']);
	assert.equal(M03.present.extra(r).blocksM03.rows.length, 1);
});

test('M03 scores 0 with an empty table when no public block has parameters', () => {
	const snap = sample();
	delete snap.blocks['Interaction/Carousel'];
	const r = M03.compute(/** @type {any} */ ({ modelSnapshots: () => [snap] }));
	assert.equal(r.score, 0);
	assert.deepEqual(r.perComponent, []);
});

test('M03 missing counts the gaps and do names the parameters, in the OML', async () => {
	const { missingOf, doOf } = await import('../metrics/M03-parameter-precision.mjs');
	const row = { undescribed: ['A', 'B'], freeText: ['D'] };
	assert.equal(missingOf(row), '2 undescribed, 1 free Text');
	assert.equal(doOf(row), 'In the OML: describe A, B; type D as a static entity, structure or number');
	assert.equal(missingOf({ undescribed: [], freeText: [] }), 'nothing');
	assert.equal(doOf({ undescribed: [], freeText: [] }), '');
	assert.equal(M03.present.heatmap, true);
	assert.deepEqual(M03.present.appliesTo, ['block']);
	assert.match(M03.present.extra({ perComponent: [] }).blocksM03.lead, /^100 = /);
});
