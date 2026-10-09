import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { compareDocs } from '../scripts/ai-docs/lib/ai-docs-fresh.mjs';

const mk = (files) => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-fresh-'));
	for (const [name, text] of Object.entries(files)) {
		fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
		fs.writeFileSync(path.join(dir, name), text);
	}
	return dir;
};

test('compareDocs reports no drift when committed files equal a fresh generation', () => {
	const committed = mk({ 'llms.txt': 'a\n', 'osui.components.json': '{}\n', 'schema/x.json': '{}' });
	const fresh = mk({ 'llms.txt': 'a\n', 'osui.components.json': '{}\n' });
	assert.deepEqual(compareDocs(committed, fresh), []);
});

test('compareDocs lists modified and missing generated files, ignoring CRLF differences', () => {
	const committed = mk({ 'llms.txt': 'a\r\nb\r\n', 'llms-tokens.txt': 'old\n' });
	const fresh = mk({ 'llms.txt': 'a\nb\n', 'llms-tokens.txt': 'new\n', 'llms-utilities.txt': 'u\n' });
	assert.deepEqual(compareDocs(committed, fresh), [
		{ file: 'llms-tokens.txt', status: 'modified' },
		{ file: 'llms-utilities.txt', status: 'missing' },
	]);
});
