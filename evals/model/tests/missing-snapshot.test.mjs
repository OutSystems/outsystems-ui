import assert from 'node:assert/strict';
import { test } from 'node:test';

import { countTokens } from '../../lib/tokens.mjs';
import M02 from '../metrics/M02-crosswalk.mjs';
import M03 from '../metrics/M03-parameter-precision.mjs';
import M04 from '../metrics/M04-block-cards.mjs';

export const NO_SNAPSHOT = 'no evals/model/osui.blocks*.json snapshot';

test('every snapshot-driven eval says so in its summary when no snapshot is present', () => {
	const ctx = {
		modelSnapshots: () => [],
		docsAi: () => null,
		tokens: { countTokens },
		inventory: { patterns: [{ name: 'Tabs' }] },
	};
	for (const m of [M02, M03, M04]) assert.equal(m.compute(/** @type {any} */ (ctx)).summary, NO_SNAPSHOT, m.id);
});
