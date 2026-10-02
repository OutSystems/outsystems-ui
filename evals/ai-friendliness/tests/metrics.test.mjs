import assert from 'node:assert/strict';
import { test } from 'node:test';

import { metrics } from '../metrics/index.mjs';
import { scoreComponent as e01 } from '../metrics/E01-context-tokens.mjs';
import { isStringlyTypedEnum, scoreComponent as e02 } from '../metrics/E02-prop-surface.mjs';
import { scoreEval as e03 } from '../metrics/E03-schema-completeness.mjs';
import { scoreGlobal as e04 } from '../metrics/E04-type-strictness.mjs';
import { docScore, facetsOf, scoreGlobal as e05 } from '../metrics/E05-documentation.mjs';
import { scoreComponent as e06 } from '../metrics/E06-api-consistency.mjs';
import { scoreComponent as e07 } from '../metrics/E07-markup-depth.mjs';
import { scoreComponent as e08 } from '../metrics/E08-token-semantics.mjs';
import { scoreComponent as e09 } from '../metrics/E09-selector-complexity.mjs';
import { scoreComponent as e10 } from '../metrics/E10-composition-model.mjs';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.01, `${actual} ≠ ${expected}`);

test('the suite exposes ten uniquely identified metrics with compute()', () => {
	assert.equal(metrics.length, 10);
	assert.deepEqual(
		metrics.map((m) => m.id),
		['E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10']
	);
	for (const m of metrics) {
		assert.equal(typeof m.compute, 'function', m.id);
		assert.ok(m.name && m.criterion && m.formula, `${m.id} must document name, criterion and formula`);
		assert.equal(typeof m.movable, 'boolean', m.id);
	}
});

test('E01 context tokens: 600 → 100, 6000 → 0, linear in between', () => {
	close(e01({ tokens: 600 }), 100);
	close(e01({ tokens: 6000 }), 0);
	close(e01({ tokens: 3300 }), 50);
	close(e01({ tokens: 100 }), 100);
});

test('E02 prop surface: size band after 8 props, typing precision ratio', () => {
	close(e02({ n: 0, precise: 0 }), 100);
	close(e02({ n: 4, precise: 4 }), 100);
	close(e02({ n: 20, precise: 10 }), 30);
	close(e02({ n: 10, precise: 5 }), 63.33);
});

test('E02 flags string props validated in range or defaulted to an enum member as stringly-typed enums', () => {
	const base = {
		name: 'X',
		className: 'C',
		file: 'f',
		typeText: 'string',
		hasDoc: false,
		allowed: [],
		allowedFrom: null,
	};
	assert.equal(isStringlyTypedEnum({ ...base, kind: 'string', validated: 'inRange', defaultText: "'left'" }), true);
	assert.equal(
		isStringlyTypedEnum({ ...base, kind: 'string', validated: 'string', defaultText: 'Enum.IconType.Caret' }),
		true
	);
	assert.equal(
		isStringlyTypedEnum({
			...base,
			kind: 'string',
			validated: 'string',
			defaultText: 'GlobalEnum.Direction.Right',
		}),
		true
	);
	assert.equal(isStringlyTypedEnum({ ...base, kind: 'string', validated: 'string', defaultText: "''" }), false);
	assert.equal(
		isStringlyTypedEnum({ ...base, kind: 'enum', validated: 'inRange', defaultText: 'Enum.Kind.A' }),
		false
	);
});

test('E03 schema completeness: mean facet score scaled by manifest coverage', () => {
	close(e03({ componentScores: [1, 0.5], entries: 2, patterns: 4 }), 37.5);
	close(e03({ componentScores: [], entries: 0, patterns: 4 }), 0);
});

test('E04 type strictness: capped penalties per KLOC', () => {
	close(e04({ implicit: 0, explicit: 0, suppressions: 0, missingReturnRatio: 0, kloc: 40 }), 100);
	close(e04({ implicit: 400, explicit: 40, suppressions: 4, missingReturnRatio: 0.5, kloc: 40 }), 25);
	close(e04({ implicit: 100, explicit: 0, suppressions: 0, missingReturnRatio: 0, kloc: 40 }), 90);
});

test('E05 documentation: weighted JSDoc coverage plus agent docs levels', () => {
	close(e05({ jsdocApi: 1, jsdocProps: 1, agentDocs: 100 }), 100);
	close(e05({ jsdocApi: 0.8, jsdocProps: 0.5, agentDocs: 0 }), 35.5);
});

test('E05 facets: description, a text per parameter and a returns text when the function returns a value', () => {
	const fn = (jsDoc, returnType = 'string') => ({
		name: 'F',
		params: [{ name: 'a' }, { name: 'b' }],
		returnType,
		jsDoc,
	});
	const full = fn({ description: 'Does it.', paramDescriptions: { a: 'A', b: 'B' }, returns: 'the envelope' });
	assert.deepEqual(facetsOf(full), { description: true, params: true, returns: true });
	assert.equal(docScore(full), 1);
	const noReturns = fn({ description: 'Does it.', paramDescriptions: { a: 'A', b: 'B' }, returns: '' });
	assert.deepEqual(facetsOf(noReturns), { description: true, params: true, returns: false });
	close(docScore(noReturns), 2 / 3);
	const voidFn = fn({ description: 'Does it.', paramDescriptions: { a: 'A', b: '' }, returns: null }, 'void');
	assert.deepEqual(
		facetsOf(voidFn),
		{ description: true, params: false, returns: null },
		'void needs no returns text'
	);
	assert.equal(docScore(voidFn), 0.5);
	assert.equal(docScore(fn(null)), 0, 'no comment, no facet');
});

test('E06 API consistency: presence, envelope, param naming and error-code hygiene', () => {
	close(e06({ presence: 1, envelope: 1, params: 1, codes: 1 }), 100);
	close(e06({ presence: 5 / 7, envelope: 0.5, params: 0.9, codes: 0 }), 61.57);
});

test('E07 markup depth: free up to depth 3 and 6 elements', () => {
	close(e07({ depth: 3, elements: 6 }), 100);
	close(e07({ depth: 5, elements: 10 }), 44);
	close(e07({ depth: 9, elements: 30 }), 0);
});

test('E08 token semantics: literal ratio, routed ratio and !important density', () => {
	close(e08({ total: 100, literal: 0, routed: 100, important: 0 }), 100);
	close(e08({ total: 100, literal: 50, routed: 20, important: 2 }), 33.5);
	assert.equal(e08({ total: 0, literal: 0, routed: 0, important: 0 }), null);
});

test('E09 selector complexity: combinator depth and p90 class specificity', () => {
	close(e09({ avgDepth: 1, p90b: 2 }), 100);
	close(e09({ avgDepth: 2.5, p90b: 4 }), 50);
	close(e09({ avgDepth: 4, p90b: 6 }), 0);
});

test('E10 composition model: inheritance depth, file count and standards flags', () => {
	close(e10({ depth: 1, files: 4, configShape: 1, eventModel: 1, moduleFormat: 1 }), 100);
	close(e10({ depth: 4, files: 8, configShape: 0, eventModel: 0, moduleFormat: 0 }), 4);
	close(e10({ depth: 2, files: 5, configShape: 0, eventModel: 0, moduleFormat: 0 }), 43);
});

test('E09 reports a partial that compiles to no rules as not applicable, not as unmeasured', async () => {
	const { createContext } = await import('../../lib/context.mjs');
	const path = await import('node:path');
	const { fileURLToPath } = await import('node:url');
	const E09 = (await import('../metrics/E09-selector-complexity.mjs')).default;
	const ctx = createContext(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..'));
	const r = E09.compute(ctx);
	assert.ok(r.notApplicable.length >= 1, 'at least one partial has no rules today');
	assert.match(r.notApplicable[0].reason, /no rules/);
	assert.ok(r.notApplicable[0].hint, 'the row says there is nothing to change');
	assert.ok(!r.unmeasured.some((u) => u.reason === 'no rules'));
});

test('E07 marks host-styled components not applicable with a hint about the host and the knobs', async () => {
	const { createContext } = await import('../../lib/context.mjs');
	const path = await import('node:path');
	const { fileURLToPath } = await import('node:url');
	const E07 = (await import('../metrics/E07-markup-depth.mjs')).default;
	const ctx = createContext(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..'));
	const r = E07.compute(ctx);
	const balloon = r.notApplicable.find((n) => n.name === 'balloon');
	assert.ok(balloon, 'a layer another pattern creates is host-styled');
	assert.match(balloon.hint, /knobs/);
	const names = new Set(Object.values(r.perComponent).map((c) => c.name));
	assert.ok(
		!names.has('layout') && !r.notApplicable.some((n) => n.name === 'layout'),
		'layout partials are outside E07'
	);
	assert.ok(!names.has('separator'), 'helper classes are outside E07');
	assert.ok(names.has('card') && names.has('Accordion'));
});
