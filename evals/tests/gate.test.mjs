import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
	evaluateGate,
	evaluateMeasurementRule,
	evaluateRules,
	formatGateReport,
	pickBaseline,
	pickOrigin,
	suiteView,
} from '../tools/gate.mjs';

const history = [
	{ label: 'baseline', date: '2026-09-29T09:00:00Z', sha: 'a', scores: { E01: 64.9, E02: 94.6 }, index: 64.3 },
	{ label: 'loop-1', date: '2026-09-29T10:00:00Z', sha: 'b', scores: { E01: 100, E02: 94.6 }, index: 82.8 },
	{ label: 'loop-3', date: '2026-09-29T11:00:00Z', sha: 'c', scores: { E01: 99.9, E02: 94.6 }, index: 86.9 },
];
const withEnt = [
	...history,
	{
		label: 'loop-6',
		date: '2026-09-29T12:00:00Z',
		sha: 'd',
		scores: { E01: 99.9 },
		index: 88,
		enterprise: { scores: { R01: 68.9 }, index: 50.7 },
	},
];
const devRun = {
	label: 'dev-e1',
	date: '2026-09-29T13:00:00Z',
	sha: 'e',
	branch: 'dev',
	suites: { ai: { scores: { E01: 99.9 }, index: 88 }, enterprise: { scores: { R01: 68.9 }, index: 51 } },
};

test('pickBaseline uses the newest history entry unless a label is given', () => {
	assert.equal(pickBaseline(history).label, 'loop-3');
	assert.equal(pickBaseline(history, 'loop-1').label, 'loop-1');
	assert.throws(() => pickBaseline(history, 'nope'), /no history entry/);
	assert.throws(() => pickBaseline([]), /history is empty/);
});

test('pickBaseline prefers the newest run recorded on dev once one exists', () => {
	const later = { ...history[2], label: 'loop-9', date: '2026-09-29T14:00:00Z', sha: 'f' };
	assert.equal(
		pickBaseline([...withEnt, devRun, later]).label,
		'dev-e1',
		'a newer branch run does not replace the dev baseline'
	);
	assert.equal(pickBaseline([...withEnt, devRun, later], 'loop-9').label, 'loop-9');
});

test('pickOrigin returns the oldest entry carrying the suite, a labelled one, or the newest dev run', () => {
	assert.equal(pickOrigin(history, 'ai').label, 'baseline');
	assert.equal(pickOrigin(history, 'ai', 'loop-1').label, 'loop-1');
	assert.equal(pickOrigin(withEnt, 'enterprise').label, 'loop-6');
	assert.equal(
		pickOrigin(withEnt, 'enterprise', 'baseline').label,
		'loop-6',
		'a labelled entry without the suite falls back'
	);
	assert.throws(() => pickOrigin(history, 'enterprise'), /no entry/);
	assert.equal(
		pickOrigin([...withEnt, devRun], 'ai').label,
		'dev-e1',
		'with dev runs the table compares with the base branch'
	);
});

test('suiteView flattens one suite of a history entry to label, sha, scores and index', () => {
	const v = suiteView(withEnt[3], 'enterprise');
	assert.deepEqual(v, { label: 'loop-6', sha: 'd', scores: { R01: 68.9 }, index: 50.7, unmeasured: undefined });
	assert.equal(suiteView(history[0], 'enterprise'), null);
});

test('evaluateGate passes on equal or higher index and on a drop within the tolerance', () => {
	const base = suiteView(history[2], 'ai');
	assert.equal(evaluateGate(base, { index: 86.9, scores: { E01: 99.9, E02: 94.6 } }).ok, true);
	assert.equal(evaluateGate(base, { index: 90, scores: { E01: 100, E02: 100 } }).ok, true);
	const r = evaluateGate(base, { index: 86.0, scores: { E01: 99, E02: 94.6 } }, { maxDrop: 1 });
	assert.equal(r.ok, true);
	assert.equal(r.delta, -0.9);
});

test('evaluateGate fails when the index drops by more than the tolerance and names the regressed evals', () => {
	const r = evaluateGate(
		suiteView(history[2], 'ai'),
		{ index: 85.5, scores: { E01: 90, E02: 94.6 } },
		{ maxDrop: 1 }
	);
	assert.equal(r.ok, false);
	assert.equal(r.delta, -1.4);
	assert.deepEqual(
		r.regressed.map((x) => x.id),
		['E01']
	);
	assert.match(r.message, /86\.9 → 85\.5/);
	assert.match(r.message, /E01/);
});

test('evaluateGate fails when one eval drops by more than its own tolerance even if the index holds', () => {
	const base = { label: 'b', sha: 'x', index: 90, scores: { E01: 90, E02: 90, E03: 90 } };
	const run = { index: 89.7, scores: { E01: 86, E02: 91.5, E03: 91.6 } };
	const r = evaluateGate(base, run, { maxDrop: 1, maxEvalDrop: 3 });
	assert.equal(r.ok, false);
	assert.match(r.message, /E01 90\.0 → 86\.0 dropped more than 3/);
	assert.equal(evaluateGate(base, run, { maxDrop: 1, maxEvalDrop: 5 }).ok, true);
});

test('evaluateRules enforces no-decrease on the evals that declare it and is empty without a baseline for them', () => {
	const metrics = [{ id: 'R01', rules: [{ kind: 'no-decrease', why: 'coverage may not shrink' }] }, { id: 'R02' }];
	const base = { label: 'b', sha: 'x', index: 50, scores: { R01: 68.9, R02: 31 } };
	assert.deepEqual(
		evaluateRules(metrics, base, { scores: { R01: 68.9 } }).map((r) => r.ok),
		[true]
	);
	assert.equal(evaluateRules(metrics, base, { scores: { R01: 70.2 } })[0].ok, true);
	const drop = evaluateRules(metrics, base, { scores: { R01: 68.3 } })[0];
	assert.equal(drop.ok, false);
	assert.match(drop.message, /R01 68\.9 → 68\.3: coverage may not shrink/);
	assert.deepEqual(evaluateRules(metrics, { ...base, scores: {} }, { scores: { R01: 1 } }), []);
});

test('evaluateMeasurementRule fails when an eval leaves more components unmeasured than the baseline did', () => {
	const base = { label: 'b', sha: 'x', index: 50, scores: { E07: 70 }, unmeasured: { E07: 3, E08: 0 } };
	const run = {
		scores: { E07: 70 },
		results: [
			{ id: 'E07', unmeasured: [1, 2, 3] },
			{ id: 'E08', unmeasured: [] },
		],
	};
	assert.equal(evaluateMeasurementRule(base, run).ok, true);
	const worse = {
		...run,
		results: [
			{ id: 'E07', unmeasured: [1, 2, 3, 4] },
			{ id: 'E08', unmeasured: [1] },
		],
	};
	const r = evaluateMeasurementRule(base, worse);
	assert.equal(r.ok, false);
	assert.match(r.message, /E07 3 → 4/);
	assert.match(r.message, /E08 0 → 1/);
	assert.equal(
		evaluateMeasurementRule({ ...base, unmeasured: undefined }, run),
		null,
		'older baselines carry no counts'
	);
});

test('formatGateReport compares with the origin and names the regression gate separately', () => {
	const origin = { label: 'baseline', sha: 'o', index: 64.3, scores: { E01: 64.9, E02: 94.6 } };
	const newest = { label: 'loop-8', sha: 'n', index: 87.9, scores: { E01: 99.9, E02: 94.7 } };
	const run = {
		label: 'gate',
		sha: 'h',
		index: 87.9,
		scores: { E01: 99.9, E02: 94.7 },
		results: [{ id: 'E01', name: 'Context Token Cost', movable: true }],
	};
	const md = formatGateReport(origin, run, evaluateGate(newest, run), { gate: newest });
	assert.ok(md.includes('Since the branch baseline `baseline` @ `o`: 64.3 → **87.9** (+23.6)'), md);
	assert.ok(
		md.includes('Regression gate against the newest recorded run `loop-8` @ `n`: 87.9 → 87.9 (0.0), tolerance −1.'),
		md
	);
	assert.ok(md.includes('| E01 | Context Token Cost | 64.9 | 99.9 | 🔼 +35.0 |'), md);
	assert.ok(md.includes('| — | **Index** | **64.3** | **87.9** | **+23.6** |'), md);
});

test('formatGateReport renders a before → after table with the verdict and marks drops and gains', () => {
	const base = suiteView(history[2], 'ai');
	const run = {
		label: 'gate',
		sha: 'd',
		index: 87.4,
		scores: { E01: 100, E02: 93.6 },
		results: [
			{ id: 'E01', name: 'Context Token Cost', movable: true, summary: 'mean 438 tok' },
			{ id: 'E02', name: 'Prop Surface', movable: false },
		],
	};
	const md = formatGateReport(base, run, evaluateGate(base, run), { maxDrop: 1 });
	assert.match(md, /Index: ✅ \*\*Passed\*\*/);
	assert.match(md, /86\.9 → \*\*87\.4\*\* \(\+0\.5\)/);
	assert.match(md, /\| E01 \| Context Token Cost \| 99\.9 \| 100\.0 \| 🔼 \+0\.1 \| mean 438 tok \|/);
	assert.match(md, /\| E02 \| Prop Surface _\(structural\)_ \| 94\.6 \| 93\.6 \| 🔻 -1\.0 \| {2}\|/);
	assert.match(md, /\| — \| \*\*Index\*\* \| \*\*86\.9\*\* \| \*\*87\.4\*\* \| \*\*\+0\.5\*\* \|/);
});

test('formatGateReport reports a failed gate, a title and extra rule lines', () => {
	const base = { label: 'b', sha: 'x', index: 50, scores: { R01: 68.9 } };
	const run = {
		label: 'gate',
		sha: 'y',
		index: 51,
		scores: { R01: 68.9 },
		results: [{ id: 'R01', name: 'Coverage', movable: false, cls: 'roadmap' }],
	};
	const md = formatGateReport(base, run, evaluateGate(base, run), {
		title: 'Enterprise Readiness Index',
		extra: ['Coverage rule: ok.', 'Measurement rule: ok.'],
	});
	assert.match(md, /### 📊 Enterprise Readiness Index: ✅/);
	assert.match(md, /\nCoverage rule: ok\.\nMeasurement rule: ok\.\n/);
	assert.match(md, /_\(roadmap\)_/);
	const failed = { label: 'gate', index: 85, scores: { E01: 90, E02: 94.6 }, results: [] };
	assert.match(
		formatGateReport(suiteView(history[2], 'ai'), failed, evaluateGate(suiteView(history[2], 'ai'), failed)),
		/❌ \*\*Failed\*\*/
	);
});
