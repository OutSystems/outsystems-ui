import assert from 'node:assert/strict';
import { test } from 'node:test';

import { KINDS } from '../lib/kinds.mjs';
import { allMetrics, CLASSES, metricById, SUITES, suiteOf } from '../suites.mjs';

test('the registry lists every suite with an id, an index name, a prefix, metrics and gate tolerances', () => {
	assert.deepEqual(
		SUITES.map((s) => s.id),
		['ai', 'enterprise', 'utilities', 'model']
	);
	for (const s of SUITES) {
		assert.ok(s.name && s.indexName && s.describe, `${s.id} documents itself`);
		assert.match(s.idPrefix, /^[A-Z]$/, `${s.id} has a one-letter eval prefix`);
		assert.ok(Array.isArray(s.metrics) && s.metrics.length > 0, `${s.id} has metrics`);
		assert.equal(typeof s.maxDrop, 'number');
		assert.equal(typeof s.maxEvalDrop, 'number');
		assert.equal(typeof s.tone, 'number', 'the dashboard colours a suite by its tone index');
	}
	assert.equal(suiteOf('enterprise').indexName, 'Enterprise Readiness Index');
	assert.throws(() => suiteOf('nope'), /unknown suite/);
});

test('every metric of every suite honours the metric contract', () => {
	const ids = allMetrics().map((m) => m.id);
	assert.equal(new Set(ids).size, ids.length, 'eval ids are unique across suites');
	for (const s of SUITES) {
		for (const m of s.metrics) {
			assert.match(m.id, new RegExp(`^${s.idPrefix}\\d{2}$`), `${m.id} carries the prefix of ${s.id}`);
			assert.equal(typeof m.compute, 'function', m.id);
			assert.ok(m.name && m.criterion && m.formula, `${m.id} documents name, criterion and formula`);
			assert.equal(typeof m.movable, 'boolean', m.id);
			if (m.cls !== undefined) assert.ok(CLASSES.includes(m.cls), `${m.id} class ${m.cls}`);
			assert.ok(m.present, `${m.id} describes how it is presented`);
			assert.ok(m.present.scope.length > 20, `${m.id} explains its per-component cell`);
			assert.equal(typeof m.present.heatmap, 'boolean', m.id);
			assert.ok(
				Array.isArray(m.present.appliesTo) && m.present.appliesTo.length > 0,
				`${m.id} lists the kinds it applies to`
			);
			for (const t of m.present.appliesTo) assert.ok(KINDS.includes(t), `${m.id} applies to a known kind (${t})`);
			for (const fn of ['cell', 'advice', 'extra']) {
				if (m.present[fn] !== undefined)
					assert.equal(typeof m.present[fn], 'function', `${m.id}.present.${fn}`);
			}
			for (const rule of m.rules ?? []) {
				assert.equal(rule.kind, 'no-decrease', `${m.id} rule kind`);
				assert.ok(rule.why, `${m.id} rule explains itself`);
			}
		}
	}
	assert.equal(metricById('R01').suite.id, 'enterprise');
	assert.equal(metricById('E07').metric.present.heatmap, true);
	assert.equal(metricById('E04').metric.present.heatmap, false, 'E04 reports files, not components');
	assert.deepEqual(metricById('E02').metric.present.appliesTo, ['pattern']);
	assert.deepEqual(metricById('E07').metric.present.appliesTo, ['pattern', 'component']);
	assert.deepEqual(metricById('R04').metric.present.appliesTo, ['pattern', 'component', 'layout']);
	for (const s of SUITES.filter((x) => x.id === 'ai' || x.id === 'enterprise')) {
		for (const m of s.metrics)
			assert.ok(
				!m.present.appliesTo.includes('utility'),
				`${m.id} leaves utility classes to the utilities suite`
			);
	}
	assert.equal(metricById('M01').suite.id, 'model');
	for (const id of ['M01', 'M02', 'M03', 'M04']) {
		assert.equal(metricById(id).metric.present.heatmap, true, `${id} has heatmap cells`);
	}
	for (const id of ['M01', 'M03', 'M04']) {
		assert.deepEqual(metricById(id).metric.present.appliesTo, ['block'], `${id} measures every block row`);
	}
	for (const id of ['M05', 'M06']) {
		assert.equal(metricById(id).metric.present.heatmap, false, `${id} is a whole-repository eval`);
	}
	assert.deepEqual(
		suiteOf('model').metrics.map((m) => m.id),
		['M01', 'M02', 'M03', 'M04', 'M05', 'M06']
	);
	assert.equal(metricById('nope'), null);
});
