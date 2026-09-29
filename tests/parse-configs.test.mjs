import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { loadNamespaceFile } from './helpers/load-namespace.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { OSFramework } = loadNamespaceFile(path.join(root, 'src/scripts/OSFramework/OSUI/Helper/ParseConfigs.ts'));
const { ParseConfigs } = OSFramework.OSUI.Helper;

test('a JSON string is parsed exactly like JSON.parse did', () => {
	assert.deepEqual(ParseConfigs('{"MultipleItems":true,"ExtendedClass":""}'), { MultipleItems: true, ExtendedClass: '' });
	assert.deepEqual(ParseConfigs('{}'), {});
});

test('a plain object is returned as-is so typed callers need no JSON.stringify', () => {
	const configs = { MultipleItems: false, ExtendedClass: '' };
	assert.equal(ParseConfigs(configs), configs);
});

test('invalid JSON still throws (unchanged failure mode)', () => {
	assert.throws(() => ParseConfigs('{ not json'), SyntaxError);
});

test('anything that is neither a string nor an object is rejected with a clear message', () => {
	assert.throws(() => ParseConfigs(undefined), /expected a JSON string or an object/);
	assert.throws(() => ParseConfigs(null), /expected a JSON string or an object/);
	assert.throws(() => ParseConfigs(42), /expected a JSON string or an object/);
	assert.throws(() => ParseConfigs([1, 2]), /expected a JSON string or an object/);
});
