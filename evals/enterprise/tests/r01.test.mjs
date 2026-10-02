import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../../lib/context.mjs';
import R01, {
	evidenceIndex,
	loadRequirements,
	resolveRequirement,
	scoreCoverage,
} from '../metrics/R01-component-coverage.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const fakeIndex = { matches: (e) => e.match.startsWith('yes') };

test('resolveRequirement: auto status follows the evidence, hand-set status is kept', () => {
	const all = {
		id: 'a',
		group: 'g',
		requirement: 'A',
		owner: 'osui',
		status: 'auto',
		evidence: [
			{ kind: 'css', match: 'yes-1' },
			{ kind: 'pattern', match: 'yes-2' },
		],
	};
	assert.equal(resolveRequirement(all, fakeIndex).status, 'offered');
	const some = {
		...all,
		evidence: [
			{ kind: 'css', match: 'yes-1' },
			{ kind: 'pattern', match: 'no' },
		],
	};
	assert.equal(resolveRequirement(some, fakeIndex).status, 'partial');
	const none = { ...all, evidence: [{ kind: 'css', match: 'no' }] };
	assert.equal(resolveRequirement(none, fakeIndex).status, 'missing');
	assert.equal(resolveRequirement({ ...all, evidence: [] }, fakeIndex).status, 'missing');
	assert.equal(resolveRequirement({ ...none, status: 'partial' }, fakeIndex).status, 'partial');
});

test('scoreCoverage weights groups and ignores delegated requirements', () => {
	const rows = [
		{ group: 'components', owner: 'osui', status: 'offered' },
		{ group: 'components', owner: 'osui', status: 'missing' },
		{ group: 'components', owner: 'datagrid', status: 'missing' },
		{ group: 'forms', owner: 'osui', status: 'partial' },
	];
	// components 0.5 → 0.5 coverage, forms 0.5 → 0.5 coverage → 50
	assert.equal(scoreCoverage(rows, { components: 0.5, forms: 0.5 }), 50);
	// a group with no owned rows drops out of the weighting
	assert.equal(scoreCoverage(rows, { components: 0.5, forms: 0.5, navigation: 0.5 }), 50);
});

test('every evidence rule of an auto or offered requirement matches the repository today', () => {
	const ctx = createContext(root);
	const index = evidenceIndex(ctx);
	const map = loadRequirements();
	const stale = [];
	for (const r of map.requirements) {
		if (r.status === 'missing') continue;
		for (const e of r.evidence) if (!index.matches(e)) stale.push(`${r.id}: ${e.kind}:${e.match}`);
	}
	assert.deepEqual(stale, [], 'evidence rules that no longer match anything');
	const ids = new Set(map.requirements.map((r) => r.id));
	for (const f of map.flows)
		for (const id of f.elements) assert.ok(ids.has(id), `flow "${f.flow}" references unknown requirement ${id}`);
	assert.equal(Math.round(Object.values(map.groups).reduce((s, w) => s + w, 0) * 100), 100, 'group weights sum to 1');
});

test('R01 computes a coverage score with delegated rows excluded and flows derived', () => {
	const ctx = createContext(root);
	const r = R01.compute(ctx);
	assert.ok(r.score > 40 && r.score < 95, `score ${r.score}`);
	assert.ok(r.perComponent.some((x) => x.delegated && x.score === null));
	assert.ok(r.perComponent.find((x) => x.id === 'accordion').status === 'offered');
	assert.ok(r.perComponent.find((x) => x.id === 'skeleton').status === 'missing');
	assert.equal(r.raw.flows.length, 9);
	assert.match(r.summary, /flows kit-complete/);
});
