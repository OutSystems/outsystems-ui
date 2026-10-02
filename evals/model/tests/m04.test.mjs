import assert from 'node:assert/strict';
import { test } from 'node:test';

import { countTokens } from '../../lib/tokens.mjs';
import M04, { CARD_BUDGET_BLOCK, CARD_WORST, recipesOf, scoreCard } from '../metrics/M04-block-cards.mjs';
import { sample } from './snapshot.test.mjs';

test('scoreCard bands the tokens and counts the recipes', () => {
	assert.equal(scoreCard({ tokens: CARD_BUDGET_BLOCK, openui: true, tsx: true }), 100);
	assert.equal(scoreCard({ tokens: CARD_WORST, openui: true, tsx: true }), 30);
	assert.equal(scoreCard({ tokens: 425, openui: true, tsx: false }), 50);
	assert.equal(scoreCard({ tokens: null, openui: false, tsx: false }), 0);
});

test('recipesOf reads the recipe lines of a card', () => {
	assert.deepEqual(
		recipesOf('## A/B\nPurpose: x\nOpenUI: _B1 = Block(SourceBlock: A/B)\nTSX: <B data-source={"A/B"} />\n'),
		{ openui: true, tsx: true }
	);
	assert.deepEqual(recipesOf('## A/B\nOpenUI: x\n'), { openui: true, tsx: false });
});

test('M04 scores the sample block from a card text and reports blocks without a card at 0', () => {
	const card =
		'## Interaction/Carousel\nPurpose: A carousel.\nOpenUI: _Carousel1 = Block(SourceBlock: Interaction/Carousel)\nTSX: <Carousel id={"_Carousel1"} data-source={"Interaction/Carousel"} />\n';
	const ctx = {
		modelSnapshots: () => [sample()],
		docsAi: (n) => (n === 'llms-blocks.txt' ? `# Blocks\n\n${card}` : null),
		tokens: { countTokens },
	};
	const r = M04.compute(/** @type {any} */ (ctx));
	assert.equal(r.perComponent.length, 1);
	assert.equal(r.perComponent[0].score, 100);
	assert.equal(r.notApplicable.length, 1, 'the non-public block');
	const none = M04.compute(/** @type {any} */ ({ ...ctx, docsAi: () => null }));
	assert.equal(none.score, 0);
	assert.equal(none.perComponent[0].tokens, null);
	assert.equal(M04.present.extra(none).blocksM04.rows[0][1], '0');
});
