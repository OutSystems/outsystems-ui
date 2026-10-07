import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseCards } from '../lib/cards.mjs';

test('parseCards splits an llms card file on its ## headings, keyed by heading', () => {
	const cards = parseCards('# intro\n\n## A\nbody a\n\n## B/C (ODC)\nbody b\n');
	assert.deepEqual([...cards.keys()], ['A', 'B/C (ODC)']);
	assert.equal(cards.get('A'), '## A\nbody a\n\n');
	assert.equal(parseCards(null).size, 0);
});
