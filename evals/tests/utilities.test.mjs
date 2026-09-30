import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../lib/context.mjs';
import {
	classifyName,
	docCoverage,
	GRAMMAR_HEADS,
	parseUtilityCss,
	STEPS,
	stepValues,
	templateGroups,
	templateKey,
	utilityFamilies,
} from '../lib/utilities.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const CSS = `/* Usefull - Margin (src/scss/05-useful/_space-margin.scss) */
.margin-none { margin: 0; }
.margin-xs { margin: var(--token-scale-100, 4px); }
.margin-s { margin: var(--token-scale-200, 8px); }
.margin-top-xs { margin-block-start: var(--token-scale-100, 4px); }
.margin-top-s { margin-block-start: var(--token-scale-200, 8px); }
.margin-x-s { margin-inline: var(--token-scale-200, 8px); }
.margin-auto { margin-block: 0; margin-inline: auto; }
.is-rtl .margin-left-s { margin-inline-start: 0; }
.phone .phone-full-width, .tablet .tablet-full-width { width: 100%; }
.hidden { display: none !important; }
.bold:hover { font-weight: 700; }
@media (min-width: 1px) { .gap-l { gap: 1px; } }
@keyframes spin { from { opacity: 0; } }`;

test('parseUtilityCss reads the subject class of every rule with its plain declarations, variants and tokens', () => {
	const classes = parseUtilityCss(CSS);
	const names = classes.map((c) => c.name);
	assert.deepEqual(names, [
		'margin-none',
		'margin-xs',
		'margin-s',
		'margin-top-xs',
		'margin-top-s',
		'margin-x-s',
		'margin-auto',
		'margin-left-s',
		'phone-full-width',
		'tablet-full-width',
		'hidden',
		'bold',
		'gap-l',
	]);
	assert.ok(
		!names.includes('phone') && !names.includes('is-rtl') && !names.includes('scss'),
		'ancestors and comments are not classes'
	);
	const xs = classes.find((c) => c.name === 'margin-xs');
	assert.deepEqual(xs.declarations, [{ prop: 'margin', value: 'var(--token-scale-100, 4px)', important: false }]);
	assert.deepEqual(xs.tokens, ['--token-scale-100']);
	const left = classes.find((c) => c.name === 'margin-left-s');
	assert.deepEqual(left.declarations, [], 'a rule under an ancestor is a variant, not the plain declaration');
	assert.deepEqual(left.variants, [
		{ context: '.is-rtl', declarations: [{ prop: 'margin-inline-start', value: '0', important: false }] },
	]);
	assert.deepEqual(classes.find((c) => c.name === 'phone-full-width').variants[0].context, '.phone');
	assert.deepEqual(classes.find((c) => c.name === 'bold').variants[0].context, ':hover');
	assert.equal(classes.find((c) => c.name === 'hidden').declarations[0].important, true);
	assert.equal(classes.find((c) => c.name === 'gap-l').declarations[0].value, '1px', 'rules inside @media count');
});

test('classifyName follows the grammar <property>[-<side>][-<value>]', () => {
	assert.ok(GRAMMAR_HEADS.includes('margin') && GRAMMAR_HEADS.includes('justify-content'));
	assert.deepEqual(classifyName('margin-top-xs'), {
		conformant: true,
		head: 'margin',
		side: 'top',
		value: 'xs',
		step: 'xs',
	});
	assert.deepEqual(classifyName('margin-x-none'), {
		conformant: true,
		head: 'margin',
		side: 'x',
		value: 'none',
		step: 'none',
	});
	assert.deepEqual(classifyName('display-flex'), {
		conformant: true,
		head: 'display',
		side: null,
		value: 'flex',
		step: null,
	});
	assert.deepEqual(classifyName('justify-content-space-between'), {
		conformant: true,
		head: 'justify-content',
		side: null,
		value: 'space-between',
		step: null,
	});
	assert.deepEqual(classifyName('background-blue-lightest'), {
		conformant: true,
		head: 'background',
		side: null,
		value: 'blue-lightest',
		step: null,
	});
	assert.equal(classifyName('bold').conformant, false);
	assert.equal(classifyName('full-width').conformant, false);
	assert.equal(classifyName('flex1').conformant, false, 'a value glued to the head is outside the grammar');
	assert.equal(classifyName('shape-soft').conformant, true, 'the shape tier is a design property');
	assert.deepEqual(STEPS, ['none', 'xs', 's', 'base', 'm', 'l', 'xl', 'xxl']);
});

test('templateKey and templateGroups collapse a family into a few template rows plus singletons', () => {
	assert.equal(templateKey('margin-top-xs'), 'margin-{side}-{step}');
	assert.equal(templateKey('margin-xs'), 'margin-{step}');
	assert.equal(templateKey('background-blue-lightest'), 'background-{hue}-{shade}');
	assert.equal(templateKey('background-blue'), 'background-{hue}');
	assert.equal(templateKey('background-neutral-10-lightest'), 'background-neutral-{n}-{shade}');
	assert.equal(templateKey('text-neutral-3'), 'text-neutral-{n}');
	assert.equal(templateKey('flex1'), 'flex{n}');
	assert.equal(templateKey('display-flex'), 'display-flex', 'a name without a variable segment is its own key');
	assert.equal(templateKey('border-radius-top-left-soft'), 'border-radius-{side}-{side}-{radius}');
	assert.equal(
		templateKey('border-radius-none'),
		'border-radius-{radius}',
		'radius follows shapes, not the size scale'
	);
	assert.equal(templateKey('justify-content-space-between'), 'justify-content-{align}');
	assert.equal(templateKey('align-items-flex-start'), 'align-items-{align}');
	assert.equal(templateKey('align-self-center'), 'align-self-{align}');
	const groups = templateGroups(parseUtilityCss(CSS));
	const byKey = Object.fromEntries(groups.map((g) => [g.key, g]));
	assert.deepEqual(
		byKey['margin-{step}'].members.map((c) => c.name),
		['margin-none', 'margin-xs', 'margin-s']
	);
	assert.deepEqual(byKey['margin-{step}'].steps, ['none', 'xs', 's']);
	assert.deepEqual(byKey['margin-{step}'].props, ['margin']);
	assert.equal(byKey['margin-{side}-{step}'].members.length, 4, 'a variant-only class is a member too');
	assert.deepEqual(byKey['margin-{side}-{step}'].sides, ['top', 'left', 'x']);
	const coverage = docCoverage(
		'- margin-{step} → margin\n- margin-{side}-{step} → …\n- margin-auto → margin-inline: auto\n',
		parseUtilityCss(CSS)
	);
	assert.equal(coverage.get('margin-xs'), true, 'covered by its template row');
	assert.equal(coverage.get('margin-left-s'), true);
	assert.equal(coverage.get('margin-auto'), true, 'covered by its own row');
	assert.equal(coverage.get('hidden'), false);
	assert.equal(byKey['margin-auto'].members.length, 1, 'a singleton stays a group of one');
	assert.ok(
		groups.every((g) => g.members.length < 3 || g.template),
		'groups of three or more render as a template'
	);
});

test('stepValues reads the value of each step from the plain class of a head', () => {
	const values = stepValues(parseUtilityCss(CSS), 'margin');
	assert.deepEqual(values, {
		none: { value: '0', token: null },
		xs: { value: 'var(--token-scale-100, 4px)', token: '--token-scale-100' },
		s: { value: 'var(--token-scale-200, 8px)', token: '--token-scale-200' },
	});
});

test('utilityFamilies reads the 24 families of 05-useful from their compiled CSS with registry titles', () => {
	const ctx = createContext(root);
	const families = utilityFamilies(ctx);
	assert.equal(families.length, 24);
	const margin = families.find((f) => f.name === 'space-margin');
	assert.equal(margin.title, 'Spacing · margin');
	assert.match(margin.file, /05-useful\/_space-margin\.scss$/);
	assert.ok(margin.classes.some((c) => c.name === 'margin-top-base'));
	const all = families.flatMap((f) => f.classes.map((c) => c.name));
	assert.ok(all.length >= 500, `${all.length} classes`);
	assert.equal(new Set(all).size, all.length, 'a class belongs to one family');
	assert.ok(
		!all.includes('scss') && !all.includes('phone') && !all.includes('tablet'),
		'no comment or ancestor artifacts'
	);
	assert.ok(
		all.includes('phone-full-width') && all.includes('display-flex') && all.includes('background-red-lightest')
	);
	const misc = families.find((f) => f.name === 'miscellaneous');
	assert.ok(misc.classes.find((c) => c.name === 'phone-full-width').variants.some((v) => v.context === '.phone'));
});
