import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { countFileTokens, countTokens, tokenizerName } from '../lib/tokens.mjs';

test('counts o200k_base BPE tokens', () => {
	assert.equal(tokenizerName, 'o200k_base');
	assert.equal(countTokens('Hello world'), 2);
	assert.equal(countTokens(''), 0);
});

test('file token counts are cached per path and content', () => {
	const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'osui-evals-')), 'a.ts');
	fs.writeFileSync(file, 'const a = 1;');
	const first = countFileTokens(file);
	assert.ok(first > 0);
	fs.writeFileSync(file, 'const a = 1; const b = 2; const c = 3;');
	const second = countFileTokens(file);
	assert.ok(second > first, 'changed content must not return the stale cached count');
	assert.equal(countFileTokens(file), second);
});
