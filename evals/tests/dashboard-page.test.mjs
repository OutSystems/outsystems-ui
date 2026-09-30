import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildDashboardPage, PLACEHOLDER, renderCheck, REQUIRED_SECTIONS } from '../tools/dashboard-page.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('buildDashboardPage embeds the committed data set in the template and escapes script-ending sequences', () => {
	const html = buildDashboardPage(evalsDir);
	assert.ok(!html.includes(PLACEHOLDER));
	assert.match(html, /<script id="data" type="application\/json">\{"v":3,/);
	const data = /<script id="data" type="application\/json">([\s\S]*?)<\/script>/.exec(html)[1];
	assert.ok(!data.includes('</'), 'no `</` survives inside the embedded JSON');
	assert.equal(JSON.parse(data).v, 3, 'the escaped JSON still parses');
	assert.match(html, /<title>[^<]+<\/title>/);
});

test('the page script renders the committed data set in a document stub and fills every section', () => {
	const filled = renderCheck(buildDashboardPage(evalsDir));
	for (const s of REQUIRED_SECTIONS) assert.ok(filled.includes(s), `${s} is filled (filled: ${filled.join(', ')})`);
});

test('the page script renders a data set with a single suite and a single run', () => {
	const html = buildDashboardPage(evalsDir);
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
	const swapped = html.replace(
		/<script id="data" type="application\/json">[\s\S]*?<\/script>/,
		`<script id="data" type="application/json">${JSON.stringify(one)}</script>`
	);
	const filled = renderCheck(swapped);
	for (const s of REQUIRED_SECTIONS)
		assert.ok(filled.includes(s), `${s} is filled with one suite (filled: ${filled.join(', ')})`);
});
