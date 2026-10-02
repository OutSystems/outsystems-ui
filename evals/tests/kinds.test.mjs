import assert from 'node:assert/strict';
import { test } from 'node:test';

import { appliesTo, defaultKindFor, KIND_TEXT, KINDS, kindText, normalizeKind, rowApplies } from '../lib/kinds.mjs';

test('the five kinds, in the order the data set lists them', () => {
	assert.deepEqual([...KINDS], ['pattern', 'component', 'layout', 'utility', 'block']);
});

test('normalizeKind accepts the kinds and rejects anything else, the legacy css value included', () => {
	for (const k of KINDS) assert.equal(normalizeKind(k), k);
	assert.equal(normalizeKind('css'), null);
	assert.equal(normalizeKind('tier'), null);
	assert.equal(normalizeKind(undefined), null);
});

test('defaultKindFor reads the kind a partial gets from its directory', () => {
	assert.equal(defaultKindFor('src/scss/02-layout/_layout.scss'), 'layout');
	assert.equal(defaultKindFor('src/scss/05-useful/_text.scss'), 'utility');
	assert.equal(defaultKindFor('src\\scss\\04-patterns\\06-utilities\\_animate.scss'), 'utility');
	assert.equal(defaultKindFor('src/scss/03-widgets/_btn.scss'), 'component');
});

test('appliesTo reads the kinds a metric measures; an absent list means every kind', () => {
	assert.equal(appliesTo({ appliesTo: ['pattern'] }, 'pattern'), true);
	assert.equal(appliesTo({ appliesTo: ['pattern'] }, 'layout'), false);
	assert.equal(appliesTo({}, 'utility'), true);
	assert.equal(appliesTo(null, 'block'), true);
});

test('rowApplies: a block row satisfies the block kind whatever its runtime; a platform row never does', () => {
	const m = { appliesTo: ['block'] };
	assert.equal(rowApplies(m, { kind: 'pattern', category: 'component' }), true);
	assert.equal(rowApplies(m, { kind: 'block', category: 'component' }), true);
	assert.equal(rowApplies(m, { kind: 'component', category: 'platform' }), false);
	assert.equal(rowApplies({ appliesTo: ['pattern'] }, { kind: 'component', category: 'component' }), false);
	assert.equal(rowApplies({ appliesTo: ['component'] }, { kind: 'component', category: 'platform' }), true);
	assert.equal(rowApplies({}, { kind: 'utility', category: 'platform' }), true);
});

test('kindText explains why a kind is outside an eval, the pure OML block included', () => {
	assert.equal(kindText('block'), KIND_TEXT.block);
	assert.match(kindText('block'), /pure OML block/);
	assert.match(kindText('layout'), /layout partials/);
	assert.match(kindText('nonsense'), /nonsense/);
});

test('rowKindText: a stylesheet-only block and a pure OML block get block-specific texts, other rows their kind text', async () => {
	const { rowKindText } = await import('../lib/kinds.mjs');
	assert.match(
		rowKindText({ kind: 'component', category: 'component' }),
		/this block drives a CSS-only component, not a TypeScript pattern/
	);
	assert.match(
		rowKindText({ kind: 'layout', category: 'component' }),
		/this block drives a CSS-only component, not a TypeScript pattern/
	);
	assert.match(rowKindText({ kind: 'block', category: 'component' }), /pure OML block/);
	assert.equal(rowKindText({ kind: 'component', category: 'platform' }), KIND_TEXT.component);
	assert.equal(rowKindText({ kind: 'pattern', category: 'component' }), KIND_TEXT.pattern);
	assert.equal(typeof KIND_TEXT.styleBlock, 'string');
});
