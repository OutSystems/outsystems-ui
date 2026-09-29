import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { analyseDeclarations, analyseSelectors, compileScss } from '../lib/scss.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const scssRoot = path.join(root, 'src', 'scss');

test('compileScss compiles a partial standalone against src/scss load paths', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-scss-'));
	const file = path.join(dir, '_ok.scss');
	fs.writeFileSync(file, "@use 'tokens/variables';\n.a { padding: variables.$token-scale-400; }\n");
	const { css, error } = compileScss(file, { loadPaths: [scssRoot] });
	assert.equal(error, null);
	assert.match(css, /var\(--token-scale-400/);
});

test('compileScss reports a compile error instead of throwing', () => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-scss-'));
	const file = path.join(dir, '_bad.scss');
	fs.writeFileSync(file, '.a { padding: $does-not-exist; }\n');
	const { css, error } = compileScss(file, { loadPaths: [scssRoot] });
	assert.equal(css, null);
	assert.match(error, /does-not-exist/);
});

test('analyseSelectors computes combinator depth and specificity, skipping keyframes', () => {
	const css = `.a .b > .c:not(.d) { color: red; }
#x li::before { color: red; }
@keyframes k { from { opacity: 0; } to { opacity: 1; } }
.e, .f .g { color: red; }`;
	const r = analyseSelectors(css);
	assert.equal(r.selectors.length, 4);
	const [s1, s2, s3, s4] = r.selectors;
	assert.equal(s1.selector, '.a .b > .c:not(.d)');
	assert.equal(s1.depth, 2);
	assert.deepEqual(s1.specificity, [0, 4, 0]);
	assert.equal(s2.depth, 1);
	assert.deepEqual(s2.specificity, [1, 0, 2]);
	assert.equal(s3.depth, 0);
	assert.equal(s4.depth, 1);
	assert.equal(r.maxDepth, 2);
	assert.equal(r.avgDepth, 1);
	assert.equal(r.p90b, 4);
});

test('analyseDeclarations distinguishes literals, routed CSS-API reads and token reads', () => {
	const css = `.a {
  padding: 16px;
  color: var(--osui-a-color);
  background: var(--token-bg, #fff);
  margin: 0;
  border: 1px solid #ccc !important;
  --osui-a-color: #333;
  --osui-a-gap: var(--token-scale-200, 8px);
  width: 100%;
  display: flex;
}`;
	const r = analyseDeclarations(css);
	assert.equal(r.total, 7, 'width/display are not themeable declarations');
	assert.equal(r.literal, 3, 'padding, border and the --osui-a-color knob default are hardcoded');
	assert.equal(r.routed, 1);
	assert.equal(r.tokened, 2);
	assert.equal(r.important, 1);
	assert.equal(r.knobs, 2);
	assert.deepEqual(
		r.samples.map((s) => s.prop),
		['padding', 'border', '--osui-a-color']
	);
});
