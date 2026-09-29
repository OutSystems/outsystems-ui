import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';

import { insideDir, isRefName, isSingleSegment } from '../lib/paths.mjs';

const base = path.resolve('repo');

test('insideDir resolves relative segments under the base', () => {
	assert.equal(insideDir(base, 'a', 'b.txt'), path.join(base, 'a', 'b.txt'));
	assert.equal(insideDir(base), base);
});

test('insideDir accepts an absolute path that is already under the base', () => {
	assert.equal(insideDir(base, path.join(base, 'x', 'y')), path.join(base, 'x', 'y'));
});

test('insideDir rejects traversal, absolute escapes and sibling prefixes', () => {
	assert.throws(() => insideDir(base, '..', 'etc', 'passwd'), /outside/);
	assert.throws(() => insideDir(base, 'a', '..', '..', 'z'), /outside/);
	assert.throws(() => insideDir(base, path.resolve('elsewhere')), /outside/);
	assert.throws(() => insideDir(base, `${base}-sibling`), /outside/);
});

test('isSingleSegment accepts plain file names only', () => {
	assert.equal(isSingleSegment('loop-4.json'), true);
	assert.equal(isSingleSegment('llms.txt'), true);
	assert.equal(isSingleSegment(''), false);
	assert.equal(isSingleSegment('.'), false);
	assert.equal(isSingleSegment('..'), false);
	assert.equal(isSingleSegment('a/b'), false);
	assert.equal(isSingleSegment('a\\b'), false);
	assert.equal(isSingleSegment('C:x'), false);
});

test('isRefName accepts git ref names and rejects traversal', () => {
	assert.equal(isRefName('refs/heads/dev'), true);
	assert.equal(isRefName('refs/heads/agents/osui-validate-evals'), true);
	assert.equal(isRefName('refs/remotes/origin/feature_x.1'), true);
	assert.equal(isRefName('refs/heads/../../etc'), false);
	assert.equal(isRefName('heads/dev'), false);
	assert.equal(isRefName('refs//dev'), false);
	assert.equal(isRefName('refs/heads/dev\\x'), false);
	assert.equal(isRefName('refs/heads/.hidden'), false);
});
