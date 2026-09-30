import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { blobId, MEASURED_DIRS, measuredFingerprint, shouldRecord } from '../lib/inputs.mjs';

function scaffold() {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-inputs-'));
	fs.mkdirSync(path.join(root, 'src', 'scss', 'tokens'), { recursive: true });
	fs.mkdirSync(path.join(root, 'stories'));
	fs.mkdirSync(path.join(root, 'docs-ai'));
	fs.mkdirSync(path.join(root, 'evals'));
	fs.writeFileSync(path.join(root, 'src', 'a.ts'), 'export const a = 1;\n');
	fs.writeFileSync(path.join(root, 'src', 'scss', '_b.scss'), '.b { color: red; }\n');
	fs.writeFileSync(path.join(root, 'src', 'scss', 'tokens', '_generated.scss'), ':root { --t: 1px; }\n');
	fs.writeFileSync(path.join(root, 'stories', 'A.stories.ts'), 'export default {};\n');
	fs.writeFileSync(path.join(root, 'docs-ai', 'llms.txt'), '# docs\n');
	fs.writeFileSync(path.join(root, 'evals', 'x.mjs'), '// tooling\n');
	return root;
}

test('blobId is the git blob id of the content', () => {
	assert.equal(blobId(Buffer.from('')), 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391');
	assert.equal(blobId(Buffer.from('hello\n')), 'ce013625030ba8dba906f756967f9e9ca394464a');
});

test('measuredFingerprint covers the pattern sources, stories and agent docs, not tooling or generated tokens', () => {
	assert.deepEqual(MEASURED_DIRS, ['src', 'stories', 'docs-ai']);
	const root = scaffold();
	const first = measuredFingerprint(root);
	assert.match(first, /^[0-9a-f]{64}$/);
	fs.writeFileSync(path.join(root, 'evals', 'x.mjs'), '// tooling changed\n');
	fs.writeFileSync(path.join(root, 'src', 'scss', 'tokens', '_generated.scss'), ':root { --t: 2px; }\n');
	assert.equal(measuredFingerprint(root), first, 'tooling and generated tokens do not count');
	fs.writeFileSync(path.join(root, 'src', 'scss', '_b.scss'), '.b { color: blue; }\n');
	const second = measuredFingerprint(root);
	assert.notEqual(second, first, 'a pattern partial counts');
	fs.writeFileSync(path.join(root, 'stories', 'B.stories.ts'), 'export default {};\n');
	assert.notEqual(measuredFingerprint(root), second, 'a new story counts');
	fs.rmSync(root, { recursive: true, force: true });
});

test('shouldRecord refuses a run whose measured inputs equal the newest recorded entry unless forced', () => {
	const history = [
		{ label: 'a', date: '2026-09-29T09:00:00Z', inputs: 'f1' },
		{ label: 'b', date: '2026-09-29T10:00:00Z', inputs: 'f2' },
	];
	assert.deepEqual(shouldRecord(history, 'f2'), { record: false, same: 'b' });
	assert.deepEqual(shouldRecord(history, 'f1'), { record: true, same: null }, 'only the newest entry counts');
	assert.deepEqual(shouldRecord(history, 'f2', true), { record: true, same: 'b' });
	assert.deepEqual(shouldRecord([], 'f2'), { record: true, same: null });
	assert.deepEqual(
		shouldRecord([{ label: 'old', date: '2026-09-29T09:00:00Z' }], 'f2'),
		{ record: true, same: null },
		'an entry without a fingerprint cannot block'
	);
});
