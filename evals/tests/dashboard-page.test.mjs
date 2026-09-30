import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildDashboardPage, PLACEHOLDER, renderCheck, REQUIRED_SECTIONS } from '../tools/dashboard-page.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('buildDashboardPage inlines the page module and the committed data set into the template', () => {
	const html = buildDashboardPage(evalsDir);
	assert.ok(!html.includes(PLACEHOLDER));
	assert.ok(!html.includes('export function mount('), 'the module export becomes a plain declaration');
	assert.ok(html.includes('function mount(document, window, localStorage, EMBEDDED)'));
	assert.ok(html.includes('mount(document, window, localStorage, {"v":3,'), 'the data set is passed to mount');
	const start =
		html.indexOf('mount(document, window, localStorage, {') + 'mount(document, window, localStorage, '.length;
	const json = html.slice(start, html.lastIndexOf(');'));
	assert.ok(!json.includes('</'), 'no `</` survives inside the embedded JSON');
	assert.equal(JSON.parse(json).v, 3, 'the escaped JSON still parses');
	assert.match(html, /<title>[^<]+<\/title>/);
});

test('the page module renders the committed data set in a document stub and fills every section', async () => {
	const filled = await renderCheck(evalsDir);
	for (const s of REQUIRED_SECTIONS) assert.ok(filled.includes(s), `${s} is filled (filled: ${filled.join(', ')})`);
});

test('the page module renders a data set with a single suite and a single run', async () => {
	const one = {
		v: 3,
		generated: '2026-09-30T00:00:00.000Z',
		latest: { label: 'only', sha: 'abc', date: '2026-09-30T00:00:00.000Z' },
		history: [
			{
				label: 'only',
				date: '2026-09-30T00:00:00.000Z',
				sha: 'abc',
				suites: { x: { scores: { X01: 50 }, index: 50 } },
			},
		],
		suites: [
			{
				id: 'x',
				name: 'X',
				indexName: 'X Index',
				describe: 'a test suite',
				tone: 2,
				evals: [
					{
						id: 'X01',
						name: 'One',
						criterion: 'c',
						formula: 'f',
						movable: true,
						cls: 'movable',
						score: 50,
						base: 50,
						summary: 's',
						scope: 'sc',
						advice: ['a'],
						unmeasured: { n: 1, items: [{ n: 'comp', r: 'no story' }] },
						notApplicable: 0,
						unmeasuredHint: 'Add a story.',
					},
				],
				heatmapEvals: ['X01'],
				baseline: { label: 'only', sha: 'abc', date: '2026-09-30T00:00:00.000Z', index: 50 },
				latest: { index: 50 },
				extra: {},
			},
		],
		components: [
			{ n: 'comp', k: 'css', cells: { X01: { s: null, w: 'unmeasured', h: 'Not measured (no story).' } } },
		],
	};
	const filled = await renderCheck(evalsDir, one);
	for (const s of REQUIRED_SECTIONS)
		assert.ok(filled.includes(s), `${s} is filled with one suite (filled: ${filled.join(', ')})`);
});
