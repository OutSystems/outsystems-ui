import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../../lib/context.mjs';
import { metrics } from '../metrics/index.mjs';
import U01 from '../metrics/U01-naming-grammar.mjs';
import U02, { scaleCoverage } from '../metrics/U02-scale-completeness.mjs';
import U03 from '../metrics/U03-token-routing.mjs';
import U04 from '../metrics/U04-documentation-parity.mjs';
import { signatureOf } from '../../lib/utilities.mjs';
import U05 from '../metrics/U05-synonym-pressure.mjs';
import U06 from '../metrics/U06-responsive-coverage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ctx = createContext(root);
const rowsOf = (r) => Object.values(r.perComponent);

test('the utilities suite registers six evals with utility as their only kind', () => {
	assert.deepEqual(
		metrics.map((m) => m.id),
		['U01', 'U02', 'U03', 'U04', 'U05', 'U06']
	);
	for (const m of metrics)
		assert.deepEqual(m.present.appliesTo, ['utility'], `${m.id} measures utility classes only`);
});

test('U01 counts grammar-conformant names per style family and leaves hook families out', () => {
	const r = U01.compute(ctx);
	const rows = rowsOf(r);
	const margin = rows.find((x) => x.name === 'space-margin');
	assert.equal(margin.kind, 'utility');
	assert.equal(margin.conformant, margin.total, 'every margin class follows the grammar');
	assert.equal(margin.score, 100);
	const typography = rows.find((x) => x.name === 'typography');
	assert.ok(typography.legacy.includes('bold') && typography.legacy.includes('italic'));
	assert.ok(typography.score < 100);
	assert.ok(r.notApplicable.some((n) => n.name === 'a11y' && /hook/.test(n.reason)));
	assert.ok(!rows.some((x) => x.name === 'miscellaneous'));
	assert.ok(r.score > 85 && r.score < 95, `global conformance ${r.score}`);
	const cell = U01.present.cell(typography);
	assert.equal(cell.s, typography.score);
	assert.match(cell.h, /bold/);
});

test('U02 measures the size scale per scalable property and reports the missing steps', () => {
	assert.deepEqual(scaleCoverage(['margin-none', 'margin-xs', 'margin-m'], 'margin'), {
		present: ['none', 'xs', 'm'],
		missing: ['s', 'base', 'l', 'xl', 'xxl'],
	});
	const r = U02.compute(ctx);
	const rows = rowsOf(r);
	assert.equal(rows.find((x) => x.name === 'space-margin').score, 100);
	const typography = rows.find((x) => x.name === 'typography');
	assert.deepEqual(typography.properties['font-size'].missing, ['none', 'm', 'l', 'xl', 'xxl']);
	const flex = rows.find((x) => x.name === 'display-flex');
	assert.deepEqual(flex.properties.gap.missing, ['none']);
	assert.ok(r.notApplicable.some((n) => n.name === 'border-radius' && /shape vocabulary/.test(n.hint)));
	assert.ok(r.score > 60 && r.score < 90, `scale completeness ${r.score}`);
});

test('U03 measures how many themeable utility declarations read a token', () => {
	const r = U03.compute(ctx);
	const rows = rowsOf(r);
	const margin = rows.find((x) => x.name === 'space-margin');
	assert.equal(margin.routed, margin.total, 'spacing reads the scale tokens');
	assert.ok(
		r.notApplicable.some((n) => n.name === 'display'),
		'display has nothing a token would drive'
	);
	assert.ok(r.score >= 70 && r.score <= 100, `token routing ${r.score}`);
	assert.match(U03.present.cell(margin).h, /read a token/);
});

test('U04 scores documentation parity against llms-utilities.txt and osui.utilities.json', () => {
	const r = U04.compute(ctx);
	const rows = rowsOf(r);
	assert.equal(rows.length, 24);
	for (const row of rows) assert.equal(row.score, 100, `${row.name}: ${row.missing.join(', ')}`);
	assert.equal(r.score, 100);
	const absent = U04.compute({ ...ctx, docsAi: () => null });
	assert.equal(absent.score, 0);
	assert.match(absent.summary, /docs:ai/);
});

test('U05 finds classes whose declarations equal another class', () => {
	assert.equal(
		signatureOf({
			declarations: [
				{ prop: 'b', value: '1' },
				{ prop: 'a', value: '2' },
			],
		}),
		'a:2;b:1'
	);
	assert.equal(signatureOf({ declarations: [] }), null, 'a class without plain declarations has no signature');
	const r = U05.compute(ctx);
	const rows = rowsOf(r);
	const pairs = rows.flatMap((x) => x.duplicates);
	assert.ok(
		pairs.some((d) => d.name === 'bold' || d.sameAs.includes('bold')),
		'bold and font-bold are synonyms'
	);
	assert.ok(
		pairs.some((d) => d.name === 'hidden' || d.sameAs.includes('hidden')),
		'hidden and display-none are synonyms'
	);
	assert.ok(
		r.raw.pairs.some((p) => /background-teal-light = background-cyan-light/.test(p)),
		'teal and cyan resolve to the same tokens'
	);
	assert.ok(r.score > 80 && r.score < 95, `synonym pressure ${r.score}`);
});

test('U06 counts the layout families that offer a viewport variant', () => {
	const r = U06.compute(ctx);
	const rows = rowsOf(r);
	assert.ok(rows.some((x) => x.name === 'space-margin' && x.responsive === false));
	assert.ok(r.notApplicable.some((n) => n.name === 'colors-palette'));
	assert.equal(U06.cls, 'roadmap', 'variants are a product decision, not a refactor');
	assert.ok(r.score < 30, `responsive coverage ${r.score}`);
});
