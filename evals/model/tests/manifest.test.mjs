import assert from 'node:assert/strict';
import { test } from 'node:test';

import { blockTable } from '../lib/manifest.mjs';

test('blockTable has four columns, a lead, and sorts the lowest score first', () => {
	const t = blockTable('T', '100 = everything.', [
		{ label: 'B', score: 100, missing: 'nothing', do: '' },
		{ label: 'A', score: 40, missing: '2 params undescribed', do: 'OML: describe X, Y' },
		{ label: 'C', score: null, missing: 'no card', do: 'npm run docs:ai' },
	]);
	assert.deepEqual(t.columns, ['Block', 'Score', 'Missing', 'Do']);
	assert.equal(t.lead, '100 = everything.');
	assert.deepEqual(t.rows, [
		['C', '–', 'no card', 'npm run docs:ai'],
		['A', '40', '2 params undescribed', 'OML: describe X, Y'],
		['B', '100', 'nothing', ''],
	]);
});
