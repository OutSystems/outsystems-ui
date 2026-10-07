import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
	buildDashboardPage,
	createDocumentStub,
	PLACEHOLDER,
	renderCheck,
	REQUIRED_SECTIONS,
} from '../tools/dashboard-page.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('buildDashboardPage inlines the page module and the committed data set into the template', () => {
	const html = buildDashboardPage(evalsDir);
	assert.ok(!html.includes(PLACEHOLDER));
	assert.ok(!html.includes('export function mount('), 'the module export becomes a plain declaration');
	assert.ok(html.includes('function mount(document, window, localStorage, EMBEDDED)'));
	assert.ok(html.includes('mount(document, window, localStorage, {"v":5,'), 'the data set is passed to mount');
	const start =
		html.indexOf('mount(document, window, localStorage, {') + 'mount(document, window, localStorage, '.length;
	const json = html.slice(start, html.lastIndexOf(');'));
	assert.ok(!json.includes('</'), 'no `</` survives inside the embedded JSON');
	assert.equal(JSON.parse(json).v, 5, 'the escaped JSON still parses');
	assert.match(html, /<title>[^<]+<\/title>/);
});

test('the page module renders the committed data set in a document stub and fills every section', async () => {
	const filled = await renderCheck(evalsDir);
	for (const s of REQUIRED_SECTIONS) assert.ok(filled.includes(s), `${s} is filled (filled: ${filled.join(', ')})`);
});

test('the page module renders a data set with a single suite and a single run', async () => {
	const one = {
		v: 5,
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
			{
				n: 'comp',
				id: 'Content/Comp',
				k: 'component',
				c: 'component',
				f: 'Content',
				rt: { p: null, s: 'comp' },
				cells: { X01: { s: null, w: 'unmeasured', h: 'Not measured (no story).' } },
			},
		],
	};
	const filled = await renderCheck(evalsDir, one);
	for (const s of REQUIRED_SECTIONS)
		assert.ok(filled.includes(s), `${s} is filled with one suite (filled: ${filled.join(', ')})`);
});

test('the findings render the per-block tables a suite contributes through extra', async () => {
	const { renderSection } = await import('../tools/dashboard-page.mjs');
	const html = await renderSection(evalsDir, 'findings');
	// a complete table (every block at 100) is named in the Done lead; an incomplete one is rendered as a table
	const data = JSON.parse(fs.readFileSync(path.join(evalsDir, 'results', 'dashboard.json'), 'utf8'));
	const model = data.suites.find((s) => s.id === 'model');
	const tables = Object.entries(model.extra).filter(([, v]) => Array.isArray(v?.rows));
	assert.ok(tables.length >= 3, 'M01, M03 and M04 contribute tables');
	const complete = tables.filter(([, v]) => v.rows.every((r) => r[1] === '100'));
	const open = tables.filter(([, v]) => v.rows.some((r) => r[1] !== '100'));
	for (const [, v] of complete) assert.ok(!html.includes(v.title), `${v.title} leaves the Findings when complete`);
	for (const [, v] of open) assert.ok(html.includes(v.title), `${v.title} stays while a block is below 100`);
	if (complete.length) {
		const ids = complete.map(([key]) => model.evals.map((e) => e.id).find((id) => key.endsWith(id)));
		assert.ok(
			html.includes(`${ids.join(', ')}: every block at 100.`),
			'the Done lead names the complete block evals'
		);
	}
	if (open.length) assert.ok(html.includes('<table class="block-table">'), 'rendered as a table');
});

test('the heatmap category filter offers the two categories with components selected', () => {
	const html = buildDashboardPage(evalsDir);
	assert.ok(html.includes('<option value="all">all</option>'));
	assert.ok(html.includes('<option value="component" selected>components (OML blocks)</option>'));
	assert.ok(html.includes('<option value="platform">platform &amp; layout styles</option>'));
	assert.ok(
		!html.includes('value="pattern"') && !html.includes('value="layout"') && !html.includes('value="utility"')
	);
	const start = html.indexOf('mount(document, window, localStorage, {');
	const withoutData = html.slice(0, start);
	assert.ok(!/\btiers?\b/i.test(withoutData), 'no tier wording in the template or module');
});

/** Mounts the page module on a document stub with a data set and returns the document. @param {any} data */
async function renderWith(data) {
	const { mount } = await import('../dashboard/dashboard.mjs');
	const document = createDocumentStub();
	mount(document, {}, { getItem: () => null, setItem() {} }, data);
	return document;
}

test('the page renders a v5 data set with a platform category only (no snapshot) and a block table with a lead', async () => {
	const data = {
		v: 5,
		generated: '2026-10-02T00:00:00.000Z',
		latest: { label: 'only', sha: 'abc', date: '2026-10-02T00:00:00.000Z' },
		history: [
			{
				label: 'only',
				date: '2026-10-02T00:00:00.000Z',
				sha: 'abc',
				suites: {
					x: { scores: { X01: 50 }, index: 50, categories: { platform: { scores: { X01: 50 }, index: 50 } } },
				},
			},
		],
		suites: [
			{
				id: 'x',
				name: 'X',
				indexName: 'X Index',
				describe: 'd',
				tone: 0,
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
						appliesTo: ['component'],
						advice: ['a'],
						unmeasured: { n: 0, items: [] },
						notApplicable: 0,
						unmeasuredHint: '',
					},
				],
				heatmapEvals: ['X01'],
				baseline: { label: 'only', sha: 'abc', date: '2026-10-02T00:00:00.000Z', index: 50 },
				latest: { index: 50 },
				categories: { platform: { index: 50, evals: 1, base: 50, baseLabel: 'only' } },
				extra: {
					blocksX01: {
						title: 'T',
						lead: '100 = all.',
						columns: ['Block', 'Score', 'Missing', 'Do'],
						rows: [['Content/Card', '50', 'params 1/2', 'OML: describe']],
					},
				},
			},
		],
		components: [
			{
				n: 'btn',
				id: 'btn',
				k: 'component',
				c: 'platform',
				f: null,
				rt: { p: null, s: 'btn' },
				cells: { X01: { s: 50, w: 'ok', h: 'h' } },
			},
		],
		kindTexts: { pattern: 'p', component: 'c', layout: 'l', utility: 'u', block: 'b' },
		categoryLabels: { component: 'components (OML blocks)', platform: 'platform & layout styles' },
	};
	const doc = await renderWith(data);
	assert.match(doc.getElementById('heat-count').textContent, /^0 of 1 rows shown/);
	assert.match(doc.getElementById('strip').innerHTML, /X · platform &amp; layout styles/);
	assert.ok(
		!doc.getElementById('strip').innerHTML.includes('components (OML blocks)'),
		'no component tile without a component category'
	);
	assert.match(doc.getElementById('findings').innerHTML, /100 = all\./);
	assert.match(doc.getElementById('findings').innerHTML, /<th>Missing<\/th><th>Do<\/th>/);
});

test('the heatmap keys rows by id and labels the first column Row, so two platforms never collide', async () => {
	const row = (id, platform) => ({
		n: 'Tooltip',
		id,
		k: 'pattern',
		c: 'component',
		f: 'Content',
		rt: { p: 'Tooltip', s: null },
		cells: { X01: { s: 50, w: 'ok', h: platform } },
	});
	const data = {
		v: 5,
		generated: '2026-10-02T00:00:00.000Z',
		latest: { label: 'only', sha: 'abc', date: '2026-10-02T00:00:00.000Z' },
		history: [
			{
				label: 'only',
				date: '2026-10-02T00:00:00.000Z',
				sha: 'abc',
				suites: { x: { scores: { X01: 50 }, index: 50 } },
			},
		],
		suites: [
			{
				id: 'x',
				name: 'X',
				indexName: 'X Index',
				describe: 'd',
				tone: 0,
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
						appliesTo: ['pattern'],
						advice: ['a'],
						unmeasured: { n: 0, items: [] },
						notApplicable: 0,
						unmeasuredHint: '',
					},
				],
				heatmapEvals: ['X01'],
				baseline: { label: 'only', sha: 'abc', date: '2026-10-02T00:00:00.000Z', index: 50 },
				latest: { index: 50 },
				extra: {},
			},
		],
		components: [row('Content/Tooltip (O11)', 'O11'), row('Content/Tooltip (ODC)', 'ODC')],
		kindTexts: { pattern: 'p', component: 'c', layout: 'l', utility: 'u', block: 'b' },
		categoryLabels: { component: 'components (OML blocks)', platform: 'platform & layout styles' },
	};
	const doc = await renderWith(data);
	const body = doc.querySelector('#heat tbody').innerHTML;
	assert.ok(
		body.includes('data-n="Content/Tooltip (O11)"') && body.includes('data-n="Content/Tooltip (ODC)"'),
		'rows are keyed by id'
	);
	assert.ok(body.includes('(O11)') && body.includes('(ODC)'), 'the platform suffix is visible');
	assert.ok(doc.querySelector('#heat thead').innerHTML.includes('>Row<'), 'the first column is Row');
	assert.ok(!doc.querySelector('#heat thead').innerHTML.includes('>Component<'));
});

/** The embedded data set of the row-document tests: one suite, one eval, no rows. */
function embeddedBase() {
	return {
		v: 5,
		generated: '2026-10-02T00:00:00.000Z',
		latest: { label: 'old', sha: 'aaa', date: '2026-10-02T00:00:00.000Z' },
		history: [
			{
				label: 'old',
				date: '2026-10-02T00:00:00.000Z',
				sha: 'aaa',
				suites: { x: { scores: { X01: 50 }, index: 50 } },
			},
		],
		suites: [
			{
				id: 'x',
				name: 'X',
				indexName: 'X Index',
				describe: 'd',
				tone: 0,
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
						appliesTo: ['component'],
						advice: ['a'],
						unmeasured: { n: 0, items: [] },
						notApplicable: 0,
						unmeasuredHint: '',
					},
				],
				heatmapEvals: ['X01'],
				baseline: { label: 'old', sha: 'aaa', date: '2026-10-02T00:00:00.000Z', index: 50 },
				latest: { index: 50 },
				extra: {},
			},
		],
		components: [],
		kindTexts: { pattern: 'p', component: 'c', layout: 'l', utility: 'u', block: 'b' },
		categoryLabels: { component: 'components (OML blocks)', platform: 'platform & layout styles' },
	};
}

test('the refresh merges the row documents the main database document announces', async () => {
	const { createDocumentStub } = await import('../tools/dashboard-page.mjs');
	const { mount } = await import('../dashboard/dashboard.mjs');
	const base = embeddedBase();
	const row = (id) => ({
		n: id,
		id,
		k: 'component',
		c: 'component',
		f: 'Content',
		rt: { p: null, s: null },
		cells: { X01: { s: 50, w: 'ok', h: 'h' } },
	});
	const published = {
		...base,
		generated: '2026-10-03T00:00:00.000Z',
		latest: { label: 'new', sha: 'bbb', date: '2026-10-03T00:00:00.000Z' },
		rowDocs: 2,
	};
	delete published.components;
	const docs = {
		'evals/dashboard': published,
		'evals/dashboard-rows-1': { part: 1, of: 2, components: [row('Content/A'), row('Content/B')] },
		'evals/dashboard-rows-2': { part: 2, of: 2, components: [row('Content/C')] },
	};
	const db = { doc: (path) => ({ get: async () => ({ exists: path in docs, data: () => docs[path] }) }) };
	const window = { claude: { use: async () => db } };
	const document = createDocumentStub();
	mount(document, window, { getItem: () => null, setItem() {} }, base);
	await new Promise((resolve) => setTimeout(resolve, 20));
	assert.match(document.getElementById('heat-count').textContent, /^3 of 3 rows shown/);
	assert.match(document.getElementById('status').textContent, /new @ bbb/);
});

test('a published document that announces no row documents and carries no rows leaves the embedded data set in place', async () => {
	const { createDocumentStub } = await import('../tools/dashboard-page.mjs');
	const { mount } = await import('../dashboard/dashboard.mjs');
	const base = embeddedBase();
	const published = {
		...base,
		generated: '2026-10-03T00:00:00.000Z',
		latest: { label: 'new', sha: 'bbb', date: '2026-10-03T00:00:00.000Z' },
	};
	delete published.components;
	const docs = { 'evals/dashboard': published };
	const db = { doc: (path) => ({ get: async () => ({ exists: path in docs, data: () => docs[path] }) }) };
	const window = { claude: { use: async () => db } };
	const document = createDocumentStub();
	mount(document, window, { getItem: () => null, setItem() {} }, base);
	await new Promise((resolve) => setTimeout(resolve, 20));
	assert.doesNotMatch(document.getElementById('status').textContent, /new @ bbb/);
	assert.match(document.getElementById('heat-count').textContent, /^0 of 0 rows shown/);
});

test('the trend axis shows short run labels without commits, and a block table where every row is at 100 collapses to one line', async () => {
	const data = {
		v: 5,
		generated: '2026-10-02T00:00:00.000Z',
		latest: { label: 'loop-14', sha: 'abcdef123', date: '2026-10-02T00:00:00.000Z' },
		history: [
			{
				label: 'baseline',
				date: '2026-09-29T00:00:00.000Z',
				sha: '111111111',
				suites: { x: { scores: { X01: 50 }, index: 50 } },
			},
			{
				label: 'loop-14',
				date: '2026-10-02T00:00:00.000Z',
				sha: 'abcdef123',
				suites: { x: { scores: { X01: 100 }, index: 100 } },
			},
		],
		suites: [
			{
				id: 'x',
				name: 'X',
				indexName: 'X Index',
				describe: 'd',
				tone: 0,
				evals: [
					{
						id: 'X01',
						name: 'One',
						criterion: 'c',
						formula: 'f',
						movable: true,
						cls: 'movable',
						score: 100,
						base: 50,
						summary: 's',
						scope: 'sc',
						appliesTo: ['block'],
						advice: ['a'],
						unmeasured: { n: 0, items: [] },
						notApplicable: 0,
						unmeasuredHint: '',
					},
				],
				heatmapEvals: ['X01'],
				baseline: { label: 'baseline', sha: '111111111', date: '2026-09-29T00:00:00.000Z', index: 50 },
				latest: { index: 100 },
				extra: {
					blocksX01: {
						title: 'T',
						lead: '100 = all.',
						columns: ['Block', 'Score', 'Missing', 'Do'],
						rows: [
							['Content/A', '100', 'nothing', ''],
							['Content/B', '100', 'nothing', ''],
						],
					},
				},
			},
		],
		components: [],
		kindTexts: { pattern: 'p', component: 'c', layout: 'l', utility: 'u', block: 'b' },
		categoryLabels: { component: 'components (OML blocks)', platform: 'platform & layout styles' },
	};
	const doc = await renderWith(data);
	const trend = doc.getElementById('trend').innerHTML;
	assert.ok(trend.includes('>L1<') && trend.includes('>L2<'), 'runs are numbered in date order on the axis');
	assert.ok(!trend.includes('>baseline<') && !trend.includes('>L14<'), 'labels live in the tooltip, not on the axis');
	assert.ok(!trend.includes('abcdef123'), 'no commit on the axis');
	assert.ok(!doc.filled().includes('trend-caption'), 'no trend caption is written');
	const findings = doc.getElementById('findings').innerHTML;
	assert.ok(
		!findings.includes('X: per-block tables'),
		'a complete table leaves the per-block group, which disappears when empty'
	);
	assert.match(findings, /X01: every block at 100\./, 'the Done lead names the complete block evals');
	assert.match(findings, /OML block snapshot/, 'the Done group tells the model-bridge story');
	assert.ok(!findings.includes('<table class="block-table">'), 'no table when every row is complete');
});
