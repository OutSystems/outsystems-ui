import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildDashboardData, cellFor, DASHBOARD_FILE } from '../tools/dashboard-data.mjs';

const evalsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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
	const na = cellFor('E02', null, { kind: 'css' });
	assert.equal(na.s, null);
	assert.equal(na.w, 'na');
	assert.match(na.h, /CSS-only/);
	const un = cellFor('E07', null, { kind: 'css', reason: 'no story' });
	assert.equal(un.w, 'unmeasured');
	assert.match(un.h, /no story/);
	assert.match(un.h, /Storybook story/);
	const host = cellFor('E07', null, {
		kind: 'css',
		notApplicable: { reason: 'host-styled: markup emitted by X', hint: 'Style it through its knobs.' },
	});
	assert.equal(host.w, 'na');
	assert.match(host.h, /host-styled/);
	assert.match(host.h, /knobs/);
});

test('buildDashboardData assembles the history, one block per suite and components with one cell per heatmap eval', () => {
	const d = buildDashboardData(evalsDir);
	assert.equal(d.v, 3);
	assert.deepEqual(
		d.suites.map((s) => s.id),
		['ai', 'enterprise']
	);
	const [ai, ent] = d.suites;
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
	const css = d.components.find((c) => c.k === 'css');
	assert.equal(css.cells.E02.w, 'na');
	assert.equal(css.cells.R03.w, 'na', 'keyboard checks need a script');
	assert.ok(JSON.stringify(d).length < 240 * 1024, 'fits the 256 KiB document limit of the artifact database');
});

test('the committed dashboard.json is fresh', () => {
	const committed = fs.readFileSync(path.join(evalsDir, DASHBOARD_FILE), 'utf8').replace(/\r\n/g, '\n');
	const fresh = JSON.parse(committed);
	const built = buildDashboardData(evalsDir);
	built.generated = fresh.generated; // the generation date is the only field allowed to differ
	assert.deepEqual(fresh, built, 'run `npm run evals:dashboard` and commit results/dashboard.json');
});
