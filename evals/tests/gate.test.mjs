import assert from 'node:assert/strict';
import { test } from 'node:test';

import { evaluateCoverageRule, evaluateGate, formatGateReport, pickBaseline, pickOrigin } from '../tools/gate.mjs';

const history = [
	{ label: 'baseline', date: '2026-09-29T09:00:00Z', sha: 'a', scores: { E01: 64.9, E02: 94.6 }, index: 64.3 },
	{ label: 'loop-1', date: '2026-09-29T10:00:00Z', sha: 'b', scores: { E01: 100, E02: 94.6 }, index: 82.8 },
	{ label: 'loop-3', date: '2026-09-29T11:00:00Z', sha: 'c', scores: { E01: 99.9, E02: 94.6 }, index: 86.9 },
];

test('pickBaseline uses the newest history entry unless a label is given', () => {
	assert.equal(pickBaseline(history).label, 'loop-3');
	assert.equal(pickBaseline(history, 'loop-1').label, 'loop-1');
	assert.throws(() => pickBaseline(history, 'nope'), /no history entry/);
	assert.throws(() => pickBaseline([]), /history is empty/);
});

test('pickOrigin returns the oldest entry, a labelled one, or the oldest with the enterprise suite', () => {
	assert.equal(pickOrigin(history).label, 'baseline');
	assert.equal(pickOrigin(history, 'loop-1').label, 'loop-1');
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
	assert.equal(pickOrigin(withEnt, undefined, true).label, 'loop-6');
	assert.equal(
		pickOrigin(withEnt, 'baseline', true).label,
		'loop-6',
		'a labelled entry without the suite falls back'
	);
	assert.throws(() => pickOrigin(history, undefined, true), /no entry/);
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

test('evaluateGate passes on equal or higher index and on a drop within the tolerance', () => {
	const base = history[2];
	assert.equal(evaluateGate(base, { index: 86.9, scores: { E01: 99.9, E02: 94.6 } }).ok, true);
	assert.equal(evaluateGate(base, { index: 90, scores: { E01: 100, E02: 100 } }).ok, true);
	const r = evaluateGate(base, { index: 86.0, scores: { E01: 99, E02: 94.6 } }, { maxDrop: 1 });
	assert.equal(r.ok, true);
	assert.equal(r.delta, -0.9);
});

test('evaluateGate fails when the index drops by more than the tolerance and names the regressed evals', () => {
	const r = evaluateGate(history[2], { index: 85.5, scores: { E01: 90, E02: 94.6 } }, { maxDrop: 1 });
	assert.equal(r.ok, false);
	assert.equal(r.delta, -1.4);
	assert.deepEqual(
		r.regressed.map((x) => x.id),
		['E01']
	);
	assert.match(r.message, /86\.9 → 85\.5/);
	assert.match(r.message, /E01/);
});

test('formatGateReport renders a before → after table with the verdict and marks drops and gains', () => {
	const base = history[2];
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
	assert.match(md, /AI-Friendliness Index: ✅ \*\*Passed\*\*/);
	assert.match(md, /86\.9 → \*\*87\.4\*\* \(\+0\.5\)/);
	assert.match(md, /\| E01 \| Context Token Cost \| 99\.9 \| 100\.0 \| 🔼 \+0\.1 \| mean 438 tok \|/);
	assert.match(md, /\| E02 \| Prop Surface _\(structural\)_ \| 94\.6 \| 93\.6 \| 🔻 -1\.0 \| {2}\|/);
	assert.match(md, /\| — \| \*\*Index\*\* \| \*\*86\.9\*\* \| \*\*87\.4\*\* \| \*\*\+0\.5\*\* \|/);
});

test('formatGateReport reports a failed gate', () => {
	const base = history[2];
	const run = { label: 'gate', index: 85, scores: { E01: 90, E02: 94.6 }, results: [] };
	assert.match(formatGateReport(base, run, evaluateGate(base, run)), /❌ \*\*Failed\*\*/);
});

test('evaluateCoverageRule fails when enterprise component coverage decreases and is null without the suite', () => {
	const base = { ...history[2], enterprise: { scores: { R01: 68.9, R02: 31 }, index: 50 } };
	assert.equal(evaluateCoverageRule(base, { enterprise: { scores: { R01: 68.9 } } }).ok, true);
	assert.equal(evaluateCoverageRule(base, { enterprise: { scores: { R01: 70.2 } } }).ok, true);
	const drop = evaluateCoverageRule(base, { enterprise: { scores: { R01: 68.3 } } });
	assert.equal(drop.ok, false);
	assert.match(drop.message, /may not decrease/);
	assert.equal(evaluateCoverageRule(history[2], { enterprise: { scores: { R01: 1 } } }), null);
	assert.equal(evaluateCoverageRule(base, {}), null);
});

test('formatGateReport takes a title and an extra line for the second index', () => {
	const base = { label: 'b', sha: 'x', index: 50, scores: { R01: 68.9 } };
	const run = {
		label: 'gate',
		sha: 'y',
		index: 51,
		scores: { R01: 68.9 },
		results: [{ id: 'R01', name: 'Coverage', movable: false }],
	};
	const md = formatGateReport(base, run, evaluateGate(base, run), {
		title: 'Enterprise Readiness Index',
		extra: 'Coverage rule: ok.',
	});
	assert.match(md, /### 📊 Enterprise Readiness Index: ✅/);
	assert.match(md, /\nCoverage rule: ok\.\n/);
});

test('evaluateCoverageRule fails when enterprise component coverage decreases and is null without the suite', () => {
	const base = { ...history[2], enterprise: { scores: { R01: 68.9, R02: 31 }, index: 50 } };
	assert.equal(evaluateCoverageRule(base, { enterprise: { scores: { R01: 68.9 } } }).ok, true);
	assert.equal(evaluateCoverageRule(base, { enterprise: { scores: { R01: 70.2 } } }).ok, true);
	const drop = evaluateCoverageRule(base, { enterprise: { scores: { R01: 68.3 } } });
	assert.equal(drop.ok, false);
	assert.match(drop.message, /may not decrease/);
	assert.equal(evaluateCoverageRule(history[2], { enterprise: { scores: { R01: 1 } } }), null);
	assert.equal(evaluateCoverageRule(base, {}), null);
});

test('formatGateReport takes a title and an extra line for the second index', () => {
	const base = { label: 'b', sha: 'x', index: 50, scores: { R01: 68.9 } };
	const run = {
		label: 'gate',
		sha: 'y',
		index: 51,
		scores: { R01: 68.9 },
		results: [{ id: 'R01', name: 'Coverage', movable: false }],
	};
	const md = formatGateReport(base, run, evaluateGate(base, run), {
		title: 'Enterprise Readiness Index',
		extra: 'Coverage rule: ok.',
	});
	assert.match(md, /### 📊 Enterprise Readiness Index: ✅/);
	assert.match(md, /\nCoverage rule: ok\.\n/);
});
