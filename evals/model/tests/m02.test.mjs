import assert from 'node:assert/strict';
import { test } from 'node:test';

import M02, { scoreCrosswalk } from '../metrics/M02-crosswalk.mjs';

test('scoreCrosswalk weights the link, the parameter map and the event map', () => {
	assert.equal(scoreCrosswalk({ linked: false, params: 3, mapped: 0, events: 1, eventsMapped: 0 }), 0);
	assert.equal(scoreCrosswalk({ linked: true, params: 0, mapped: 0, events: 0, eventsMapped: 0 }), 100);
	assert.equal(scoreCrosswalk({ linked: true, params: 4, mapped: 2, events: 2, eventsMapped: 1 }), 75);
	assert.equal(scoreCrosswalk({ linked: true, params: 4, mapped: 0, events: 0, eventsMapped: 0 }), 70);
});

test('M02 is a pattern heatmap whose cell names what to map', () => {
	assert.equal(M02.present.heatmap, true);
	assert.deepEqual(M02.present.appliesTo, ['pattern']);
	const cell = M02.present.cell({
		score: 70,
		linked: true,
		source: 'hint',
		blocks: ['Interaction/Carousel'],
		missing: ['Carousel.Loop'],
		unmappedEvents: [],
	});
	assert.equal(cell.s, 70);
	assert.ok(cell.h.includes('Carousel.Loop'));
});
