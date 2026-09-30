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
	assert.match(cellFor('E02', null, { kind: 'css' }).h, /CSS-only/, 'the previous css kind still reads as component');
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

test('buildDashboardData assembles the history, one block per suite and components with one cell per heatmap eval', () => {
	const d = buildDashboardData(evalsDir);
	assert.equal(d.v, 4);
	assert.deepEqual(
		d.suites.map((s) => s.id),
		['ai', 'enterprise', 'utilities']
	);
	const [ai, ent, util] = d.suites;
	assert.equal(util.evals.length, 6);
	assert.deepEqual(util.heatmapEvals, ['U01', 'U02', 'U03', 'U04', 'U05', 'U06']);
	assert.deepEqual(Object.keys(util.tiers), ['utility']);
	assert.equal(
		d.components.filter((c) => c.k === 'utility').length,
		24,
		'the utility families are the rows of the utilities suite'
	);
	const margin = d.components.find((c) => c.n === 'space-margin');
	assert.equal(margin.cells.U01.w, 'ok');
	assert.equal(margin.cells.E07, undefined, 'the AI evals do not apply to a utility family');
	assert.deepEqual(util.evals[0].appliesTo, ['utility']);
	assert.equal(ai.indexName, 'AI-Friendliness Index');
	assert.equal(ai.evals.length, 10);
	assert.ok(!ai.heatmapEvals.includes('E04'), 'E04 is measured per file, so it is not a heatmap column');
	assert.equal(ent.evals.length, 6);
	assert.deepEqual(ent.heatmapEvals, ['R02', 'R03', 'R04', 'R05', 'R06']);
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
	const accordion = d.components.find((c) => c.n === 'Accordion');
	assert.ok(accordion);
	for (const id of [...ai.heatmapEvals, ...ent.heatmapEvals])
		assert.ok(accordion.cells[id], `Accordion has an ${id} cell`);
	assert.equal(accordion.cells.R02.w, 'ok');
	// a cell an eval does not apply to by tier is omitted: the page composes it from the eval's appliesTo
	const css = d.components.find((c) => c.k === 'component');
	assert.equal(css.cells.E02, undefined, 'E02 measures patterns only');
	assert.equal(css.cells.R03, undefined, 'keyboard checks need a script');
	assert.deepEqual(e02.appliesTo, ['pattern'], 'every eval carries the tiers it applies to');
	const layout = d.components.find((c) => c.n === 'header');
	assert.equal(layout.k, 'layout');
	assert.equal(layout.cells.E07, undefined, 'a layout partial has no markup contract to measure');
	assert.equal(layout.cells.E08.w, 'ok');
	const balloon = d.components.find((c) => c.n === 'balloon');
	assert.equal(balloon.cells.E07.w, 'na', 'a host-styled component keeps the cell the metric declared');
	assert.match(balloon.cells.E07.h, /host-styled/);
	assert.equal(d.components.filter((c) => c.k === 'pattern').length, 33);
	for (const s of d.suites.filter((x) => x.id !== 'utilities')) {
		assert.ok(s.tiers, `${s.id} carries per-tier indices`);
		assert.equal(typeof s.tiers.pattern.index, 'number');
		assert.ok(!('utility' in s.tiers), 'the AI and enterprise suites have no utility tier');
	}
	assert.ok(JSON.stringify(d).length < 240 * 1024, 'fits the 256 KiB document limit of the artifact database');
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
	const d = buildDashboardData(tmp);
	assert.equal(d.latest.label, last.label);
	assert.equal(d.suites.length, 3);
	fs.rmSync(tmp, { recursive: true, force: true });
});
