import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isMarked, isRuntimeOnlyLine, RUNTIME_ONLY, stripListPrefix } from '../lib/producers.mjs';

test('marker detection survives list prefixes and CRLF', () => {
	assert.equal(stripListPrefix('12. foo'), 'foo');
	assert.equal(stripListPrefix('- foo'), 'foo');
	assert.equal(isMarked(`3. ${RUNTIME_ONLY} Lifecycle: Create → Initialize\r`), true);
	assert.equal(isMarked('Lifecycle: Create → Initialize'), false);
	assert.equal(isRuntimeOnlyLine(`${RUNTIME_ONLY} Markup skeleton (from x): <div>`), true);
	assert.equal(isRuntimeOnlyLine('Skeleton (from stories/Alert.stories.ts): <div>'), true);
	assert.equal(isRuntimeOnlyLine('Props: none'), false);
});
