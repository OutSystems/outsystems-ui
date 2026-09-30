import assert from 'node:assert/strict';
import { test } from 'node:test';

import { band, clamp01, mean, penalty, round1 } from '../lib/score.mjs';

test('clamp01 bounds to [0, 1]', () => {
	assert.equal(clamp01(-1), 0);
	assert.equal(clamp01(0.4), 0.4);
	assert.equal(clamp01(7), 1);
});

test('band maps a lower-is-better value onto 0–100 between best and worst', () => {
	assert.equal(band(600, 600, 6000), 100);
	assert.equal(band(6000, 600, 6000), 0);
	assert.equal(band(200, 600, 6000), 100);
	assert.equal(round1(band(3300, 600, 6000)), 50);
});

test('penalty subtracts from 100 and never goes below 0', () => {
	assert.equal(penalty([10, 20]), 70);
	assert.equal(penalty([80, 50]), 0);
	assert.equal(penalty([]), 100);
});

test('mean ignores nothing and returns null for an empty list', () => {
	assert.equal(mean([1, 2, 3]), 2);
	assert.equal(mean([]), null);
});
