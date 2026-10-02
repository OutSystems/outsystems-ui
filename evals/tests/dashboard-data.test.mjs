import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildDashboardData, cellFor, DASHBOARD_FILE } from '../tools/dashboard-data.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

test('cellFor turns each metric row into a score, a state and a concrete hint through the metric itself', () => {
	const e02 = cellFor('E02', {
		name: 'AccordionItem',
		n: 4,
		precise: 2,
		stringlyTypedEnums: ['Icon (default Enum.IconType.Caret)', 'IconPosition (default GlobalEnum.Direction.Right)'],
		untyped: [],
		score: 76,
	});
	assert.equal(e02.s, 76);
	assert.equal(e02.w, 'ok');
	assert.match(e02.h, /2 of 4 props precise/);
	assert.match(e02.h, /Icon/);

	const e07 = cellFor('E07', { name: 'lightbox-image', kind: 'css', depth: 8, elements: 22, classes: 26, score: 0 });
	assert.match(e07.h, /depth 8/);
	assert.match(e07.h, /22 distinct parts/);

	const e05 = cellFor('E05', {
		name: 'X',
		apiDocumented: 3,
		apiTotal: 4,
		undocumentedApi: ['Foo'],
		propsDocumented: 1,
		propsTotal: 1,
		undocumentedProps: [],
	});
	assert.equal(e05.s, 80);
	assert.match(e05.h, /Foo/);

	const r03 = cellFor('R03', { name: 'DatePicker', score: 100, failed: [], delegated: true });
	assert.equal(r03.w, 'ok');
	assert.match(r03.h, /provider library/);

	const unknown = cellFor('X99', { name: 'x', score: 12 });
	assert.deepEqual(unknown, { s: 12, w: 'ok', h: '' }, 'an eval without a cell builder still yields its score');
});

test('cellFor explains a cell with no measurement from the metric scope and hints', () => {
	const na = cellFor('E02', null, { kind: 'component' });
	assert.equal(na.s, null);
	assert.equal(na.w, 'na');
	assert.match(na.h, /measures patterns; this is a CSS-only component/);
	assert.equal(
		cellFor('E02', null, { kind: 'css' }).w,
		'unmeasured',
		'css is no longer a kind: no not-applicable text for it'
	);
	const layout = cellFor('E07', null, { kind: 'layout' });
	assert.equal(layout.w, 'na');
	assert.match(layout.h, /measures patterns, components; layout partials style markup the app template/);
	const utility = cellFor('R04', null, { kind: 'utility' });
	assert.equal(utility.w, 'na');
	assert.match(utility.h, /utility classes have no anatomy/);
	const un = cellFor('E07', null, { kind: 'component', reason: 'no story' });
	assert.equal(un.w, 'unmeasured');
	assert.match(un.h, /no story/);
	assert.match(un.h, /Storybook story/);
	const host = cellFor('E07', null, {
		kind: 'component',
		notApplicable: { reason: 'host-styled: markup emitted by X', hint: 'Style it through its knobs.' },
	});
	assert.equal(host.w, 'na');
	assert.match(host.h, /host-styled/);
	assert.match(host.h, /knobs/);
});

test('buildDashboardData assembles the history, one block per suite and the rows of the universe with their cells', () => {
	const d = buildDashboardData(evalsDir);
	assert.equal(d.v, 5);
	assert.deepEqual(d.categoryLabels, { component: 'components (OML blocks)', platform: 'platform & layout styles' });
	assert.equal(typeof d.kindTexts.block, 'string');
	assert.deepEqual(
		d.suites.map((s) => s.id),
		['ai', 'enterprise', 'utilities', 'model']
	);
	const [ai, ent, util, model] = d.suites;
	assert.equal(util.evals.length, 6);
	assert.deepEqual(util.heatmapEvals, ['U01', 'U02', 'U03', 'U04', 'U05', 'U06']);
	assert.deepEqual(Object.keys(util.categories), ['platform'], 'utility families are platform rows');
	// the 24 families the utilities suite measures plus the 6 helper classes the registry files as utilities
	assert.equal(d.components.filter((c) => c.k === 'utility').length, 30);
	assert.equal(d.components.filter((c) => c.k === 'utility' && c.cells.U01?.w !== 'unmeasured').length, 24);
	const animate = d.components.find((c) => c.id === 'animate');
	assert.equal(animate.cells.U01.w, 'unmeasured');
	assert.equal(animate.cells.U01.h, 'Not measured: the eval reports no entry for this row.');
	const margin = d.components.find((c) => c.id === 'space-margin');
	assert.equal(margin.c, 'platform');
	assert.equal(margin.cells.U01.w, 'ok');
	assert.equal(margin.cells.E07, undefined, 'the AI evals do not apply to a utility family');
	assert.deepEqual(util.evals[0].appliesTo, ['utility']);
	assert.equal(ai.indexName, 'AI-Friendliness Index');
	assert.equal(ai.evals.length, 10);
	assert.ok(!ai.heatmapEvals.includes('E04'), 'E04 is measured per file, so it is not a heatmap column');
	assert.equal(ent.evals.length, 6);
	assert.deepEqual(ent.heatmapEvals, ['R02', 'R03', 'R04', 'R05', 'R06']);
	assert.deepEqual(model.heatmapEvals, ['M01', 'M02', 'M03', 'M04'], 'the block evals have heatmap columns');
	assert.ok(ent.extra.requirements.length > 80, 'R01 contributes the requirement table');
	assert.equal(ent.extra.flows.length, 9);
	assert.ok(ent.baseline.label, 'each suite names the first run that carried it');
	assert.equal(typeof ent.latest.index, 'number');
	assert.ok(d.history.length >= 2);
	assert.ok(
		d.history.every((h) => h.suites),
		'history entries are in the suites shape'
	);
	assert.equal(d.latest.label, [...d.history].sort((a, b) => a.date.localeCompare(b.date)).at(-1).label);
	const e02 = ai.evals.find((e) => e.id === 'E02');
	assert.ok(e02.advice.length > 0, 'every eval carries at least one next step');
	assert.ok(e02.scope.length > 10, 'every eval says what its per-component cells mean');
	assert.equal(typeof e02.notApplicable, 'number');
	assert.deepEqual(e02.appliesTo, ['pattern'], 'every eval carries the kinds it applies to');

	// block rows: id, name, flow, category, kind, runtime and projected cells
	const accordion = d.components.find((c) => c.id === 'Content/Accordion');
	assert.ok(accordion, 'the Accordion block is a row');
	assert.equal(accordion.n, 'Accordion');
	assert.equal(accordion.f, 'Content');
	assert.equal(accordion.c, 'component');
	assert.equal(accordion.k, 'pattern');
	assert.deepEqual(accordion.rt, { p: 'Accordion', s: null });
	for (const id of [...ai.heatmapEvals, ...ent.heatmapEvals, ...model.heatmapEvals])
		assert.ok(accordion.cells[id], `Content/Accordion has an ${id} cell`);
	assert.equal(accordion.cells.E01.w, 'ok', 'E01 projected from the Accordion pattern');
	assert.equal(accordion.cells.M01.w, 'ok');
	const card = d.components.find((c) => c.id === 'Content/Card');
	assert.deepEqual(card.rt, { p: null, s: 'card' });
	assert.equal(card.k, 'component');
	assert.equal(card.cells.E07.w, 'ok', 'E07 projected from the card stylesheet');
	assert.equal(
		card.cells.E02,
		undefined,
		'a pattern eval has no cell for a stylesheet-only block: the page composes n/a'
	);
	const columns = d.components.find((c) => c.id === 'Adaptive/Columns2');
	assert.equal(columns.k, 'block');
	assert.equal(columns.cells.M03.w, 'ok', 'Columns2 has parameters');
	const display = d.components.find((c) => c.id === 'Adaptive/DisplayOnDevice');
	assert.equal(display.cells.M03.w, 'na', 'no parameters: M03 marks it not applicable');
	assert.equal(columns.cells.E07, undefined, 'a pure OML block has no stylesheet to measure');
	assert.ok(!d.components.some((c) => c.id.includes('DEPRECATED_')));
	assert.ok(!d.components.some((c) => c.id === 'Licenses/Licenses'));

	// platform rows keep their cells and get no block cell
	const btn = d.components.find((c) => c.id === 'btn');
	assert.equal(btn.c, 'platform');
	assert.equal(btn.cells.M01, undefined);
	assert.equal(btn.cells.E02, undefined, 'E02 measures patterns only');
	assert.equal(btn.cells.R03, undefined, 'keyboard checks need a script');
	const layout = d.components.find((c) => c.id === 'header');
	assert.equal(layout.k, 'layout');
	assert.equal(layout.cells.E07, undefined, 'a layout partial has no markup contract to measure');
	assert.equal(layout.cells.E08.w, 'ok');
	const balloon = d.components.find((c) => c.id === 'balloon');
	assert.equal(balloon.cells.E07.w, 'na', 'a host-styled component keeps the cell the metric declared');
	assert.match(balloon.cells.E07.h, /host-styled/);
	assert.equal(
		d.components.filter((c) => c.c === 'component').length,
		d.components.filter((c) => c.f !== null).length,
		'every block row is a component row and the reverse'
	);
	for (const s of d.suites.filter((x) => x.id !== 'utilities')) {
		assert.ok(s.categories.component, `${s.id} carries a component index`);
		assert.equal(typeof s.categories.component.index, 'number');
		assert.equal(
			s.categories.component.baseLabel,
			s.baseline.label,
			'the category series starts at the suite baseline'
		);
		assert.equal(s.tiers, undefined);
	}
});

test('the committed dashboard.json is fresh', () => {
	const committed = fs.readFileSync(path.join(evalsDir, DASHBOARD_FILE), 'utf8').replace(/\r\n/g, '\n');
	const fresh = JSON.parse(committed);
	const built = buildDashboardData(evalsDir);
	built.generated = fresh.generated; // the generation date is the only field allowed to differ
	assert.deepEqual(fresh, built, 'run `npm run evals:dashboard` and commit results/dashboard.json');
});

test('buildDashboardData falls back to results/latest.json when the latest run file is absent', () => {
	const os = require('node:os');
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'osui-dash-'));
	fs.mkdirSync(path.join(tmp, 'results'));
	const history = JSON.parse(fs.readFileSync(path.join(evalsDir, 'results', 'history.json'), 'utf8'));
	const last = [...history].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
	fs.writeFileSync(path.join(tmp, 'results', 'history.json'), JSON.stringify(history));
	fs.copyFileSync(path.join(evalsDir, 'results', `${last.label}.json`), path.join(tmp, 'results', 'latest.json'));
	const d = buildDashboardData(tmp, new Date(), path.resolve(evalsDir, '..'));
	assert.equal(d.latest.label, last.label);
	assert.equal(d.suites.length, 4);
	fs.rmSync(tmp, { recursive: true, force: true });
});

test('splitForDatabase keeps every document under the artifact database limit and round-trips the rows', async () => {
	const { splitForDatabase, DB_DOC_LIMIT } = await import('../tools/dashboard-data.mjs');
	const d = buildDashboardData(evalsDir);
	const { main, rows } = splitForDatabase(d, 60 * 1024);
	assert.equal(main.components, undefined, 'the main document carries no rows');
	assert.equal(main.rowDocs, rows.length);
	assert.ok(rows.length >= 3, `rows are chunked (${rows.length} documents at a 60 KiB limit)`);
	for (const doc of rows)
		assert.ok(Buffer.byteLength(JSON.stringify(doc)) <= 60 * 1024, 'every row document fits the test limit');
	assert.ok(Buffer.byteLength(JSON.stringify(main)) <= DB_DOC_LIMIT, 'the main document fits the database limit');
	assert.deepEqual(
		rows.flatMap((r) => r.components),
		d.components,
		'the chunks concatenate back to the rows in order'
	);
	assert.equal(rows[0].part, 1);
	assert.equal(rows[0].of, rows.length);
	const real = splitForDatabase(d);
	for (const doc of [real.main, ...real.rows])
		assert.ok(Buffer.byteLength(JSON.stringify(doc)) <= DB_DOC_LIMIT, 'fits the 256 KiB document limit');
	assert.equal(DB_DOC_LIMIT, 256 * 1024);
});
