import assert from 'node:assert/strict';
import { test } from 'node:test';

import { appliesTo, defaultTierFor, normalizeKind, TIERS, tierText } from '../lib/tiers.mjs';

test('the four tiers, in the order the dashboard lists them', () => {
	assert.deepEqual(TIERS, ['pattern', 'component', 'layout', 'utility']);
});

test('normalizeKind accepts the tiers and the legacy css kind, and rejects anything else', () => {
	for (const t of TIERS) assert.equal(normalizeKind(t), t);
	assert.equal(normalizeKind('css'), 'component', 'a registry that still says css means a CSS-only component');
	assert.equal(normalizeKind('widget'), null);
	assert.equal(normalizeKind(undefined), null);
});

test('defaultTierFor reads the tier a partial gets from its directory', () => {
	assert.equal(defaultTierFor('src/scss/02-layout/_header.scss'), 'layout');
	assert.equal(defaultTierFor('src/scss/03-widgets/_btn.scss'), 'component');
	assert.equal(defaultTierFor('src/scss/04-patterns/02-content/_card.scss'), 'component');
	assert.equal(defaultTierFor('src/scss/04-patterns/06-utilities/_separator.scss'), 'utility');
	assert.equal(defaultTierFor('src/scss/05-useful/_space-margin.scss'), 'utility');
	assert.equal(defaultTierFor('C:\\repo\\src\\scss\\02-layout\\_menu.scss'), 'layout', 'Windows separators');
	assert.equal(
		defaultTierFor('src/scss/04-patterns/03-interaction/_animate.scss'),
		'component',
		'the registry overrides it to utility'
	);
});

test('appliesTo reads the tiers a metric measures', () => {
	assert.equal(appliesTo({ appliesTo: ['pattern'] }, 'pattern'), true);
	assert.equal(appliesTo({ appliesTo: ['pattern'] }, 'component'), false);
	assert.equal(appliesTo({ appliesTo: ['pattern', 'component', 'layout'] }, 'layout'), true);
	assert.equal(appliesTo({ appliesTo: ['pattern', 'component', 'layout'] }, 'utility'), false);
	assert.equal(appliesTo(null, 'utility'), true, 'a metric without a present block measures everything');
});

test('tierText explains why a tier is outside an eval', () => {
	assert.match(tierText('utility'), /utility class/);
	assert.match(tierText('layout'), /app template/);
	assert.match(tierText('component'), /CSS-only/);
	assert.match(tierText('pattern'), /pattern/);
});
