import assert from 'node:assert/strict';
import { test } from 'node:test';

import M06, { knobNamesOf, scoreSurfaces } from '../metrics/M06-silent-surfaces.mjs';

test('knobNamesOf lists declared --osui-* custom properties once each', () => {
	const css = '.a{--osui-a-color:red;--osui-a-gap:4px;color:var(--osui-a-color)}.b{--osui-a-color:blue}';
	assert.deepEqual(knobNamesOf(css), ['--osui-a-color', '--osui-a-gap']);
	assert.deepEqual(knobNamesOf(''), []);
});

test('scoreSurfaces gives 25 per fully documented surface and prorates the rest', () => {
	const r = scoreSurfaces({
		utilities: { documented: 500, total: 500 },
		knobs: { documented: 300, total: 600 },
		icons: { documented: 0, total: 2 },
		enums: { documented: 3, total: 4 },
	});
	assert.deepEqual(r.parts, { utilities: 25, knobs: 12.5, icons: 0, enums: 18.8 });
	assert.equal(r.score, 56.3);
	assert.equal(
		scoreSurfaces({
			utilities: { documented: 0, total: 0 },
			knobs: { documented: 0, total: 0 },
			icons: { documented: 0, total: 0 },
			enums: { documented: 0, total: 0 },
		}).score,
		100
	);
});

test('M06 is a whole-repository eval', () => {
	assert.equal(M06.present.heatmap, false);
	assert.equal(typeof M06.present.advice, 'function');
});

test('a knob counts as documented only when its full name appears, not a longer name with the same prefix', async () => {
	const { knobDocumented } = await import('../metrics/M06-silent-surfaces.mjs');
	assert.equal(knobDocumented('- --osui-card-padding-inline\n', '--osui-card-padding'), false);
	assert.equal(knobDocumented('- --osui-card-padding — the padding\n', '--osui-card-padding'), true);
	assert.equal(knobDocumented('x --osui-card-padding: 4px', '--osui-card-padding'), true);
});

test('M06 computes on the repository context (every reader it needs is imported)', async () => {
	const { createContext } = await import('../../lib/context.mjs');
	const path = await import('node:path');
	const { fileURLToPath } = await import('node:url');
	const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
	const r = M06.compute(createContext(root));
	assert.equal(typeof r.score, 'number');
	assert.ok(r.raw.surfaces.utilities.total > 0);
});
