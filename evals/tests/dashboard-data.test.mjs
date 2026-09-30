import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildDashboardData, cellFor, DASHBOARD_FILE } from '../tools/dashboard-data.mjs';

const suiteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('cellFor turns each metric row into a score, a state and a concrete hint', () => {
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

	const e08 = cellFor('E08', {
		name: 'checkbox',
		total: 29,
		literal: 0,
		routed: 9,
		tokened: 20,
		important: 0,
		knobs: 9,
		score: 63,
	});
	assert.match(e08.h, /9 of 29 .*--osui-\*/);

	const e10 = cellFor('E10', {
		name: 'DatePicker',
		depth: 4,
		files: 21,
		configShape: 1,
		eventModel: 1,
		moduleFormat: 0,
		chain: 'A → B → C → D → E',
		score: 0,
	});
	assert.match(e10.h, /inheritance depth 4/);
	assert.match(e10.h, /21 contract files/);
	assert.match(e10.h, /global namespace/);

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
});

test('cellFor explains a cell with no measurement', () => {
	const na = cellFor('E02', null, { kind: 'css' });
	assert.equal(na.s, null);
	assert.equal(na.w, 'na');
	assert.match(na.h, /CSS-only/);
	const un = cellFor('E07', null, { kind: 'css', reason: 'no story' });
	assert.equal(un.w, 'unmeasured');
	assert.match(un.h, /no story/);
	assert.match(un.h, /story/i);
});

test('buildDashboardData assembles history, evals with advice and components with one cell per heatmap eval', () => {
	const d = buildDashboardData(suiteDir);
	assert.equal(d.v, 2);
	assert.ok(d.enterprise, 'the enterprise suite is present once a run carries it');
	assert.equal(d.enterprise.evals.length, 6);
	assert.deepEqual(d.enterprise.heatmapEvals, ['R02', 'R03', 'R04', 'R05', 'R06']);
	assert.ok(d.enterprise.requirements.length > 80);
	assert.equal(d.enterprise.flows.length, 9);
	assert.equal(d.components.find((c) => c.n === 'Accordion').cells.R02.w, 'ok');
	assert.equal(d.components.find((c) => c.k === 'css').cells.R03.w, 'na', 'keyboard checks need a script');
	assert.ok(d.history.length >= 2);
	assert.equal(d.evals.length, 10);
	assert.equal(d.latest.label, d.history.sort((a, b) => a.date.localeCompare(b.date)).at(-1).label);
	const e02 = d.evals.find((e) => e.id === 'E02');
	assert.ok(e02.advice.length > 0, 'every eval carries at least one next step');
	assert.ok(e02.scope.length > 10, 'every eval says what its per-component cells mean');
	assert.ok(!d.heatmapEvals.includes('E04'), 'E04 is measured per file, so it is not a heatmap column');
	const accordion = d.components.find((c) => c.n === 'Accordion');
	assert.ok(accordion);
	for (const id of d.heatmapEvals) assert.ok(accordion.cells[id], `Accordion has an ${id} cell`);
	const css = d.components.find((c) => c.k === 'css');
	assert.equal(css.cells.E02.w, 'na');
	assert.ok(JSON.stringify(d).length < 240 * 1024, 'fits the 256 KiB document limit of the artifact database');
});

test('the committed dashboard.json is fresh', () => {
	const committed = fs.readFileSync(path.join(suiteDir, DASHBOARD_FILE), 'utf8').replace(/\r\n/g, '\n');
	const fresh = JSON.parse(committed);
	const built = buildDashboardData(suiteDir);
	built.generated = fresh.generated; // the generation date is the only field allowed to differ
	assert.deepEqual(fresh, built, 'run `npm run evals:dashboard` and commit results/dashboard.json');
});
