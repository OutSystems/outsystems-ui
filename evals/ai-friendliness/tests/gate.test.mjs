import assert from 'node:assert/strict';
import { test } from 'node:test';

import { evaluateGate, formatGateReport, pickBaseline } from '../tools/gate.mjs';

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
