import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildInventory } from '../lib/inventory.mjs';
import { componentsForFiles, formatTouchedReport, readChangedFiles } from '../tools/touched.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const inventory = buildInventory(root);

test('componentsForFiles maps changed files to the pattern or CSS component that owns them', () => {
	const touched = componentsForFiles(inventory, root, [
		'src/scripts/OSFramework/OSUI/Pattern/Accordion/Accordion.ts',
		'src/scss/04-patterns/02-content/accordion-item/_accordion-item.scss',
		'stories/Card.stories.ts',
		'src/scripts/Providers/OSUI/Dropdown/VirtualSelect/VirtualSelect.ts',
		'src/scripts/OutSystems/OSUI/Patterns/TabsAPI.ts',
		'docs-ai/llms.txt',
		'evals/components.json',
	]);
	const names = [...touched.keys()];
	assert.ok(names.includes('Accordion'), 'a class file inside the pattern directory');
	assert.ok(names.includes('AccordionItem'), 'the SCSS partial registered for the child pattern');
	assert.ok(names.includes('card'), 'a CSS component through its story');
	assert.ok(names.includes('Dropdown'), 'a provider wrapper file');
	assert.ok(names.includes('Tabs'), 'the API file');
	// the Card story is shared by the card family, so touching it touches all four
	assert.ok(names.includes('card-item') && names.includes('card-sectioned'));
	assert.equal(names.length, 8, `only components are listed: ${names.join(', ')}`);
	assert.equal(touched.get('Accordion').kind, 'pattern');
	assert.deepEqual(touched.get('card').files, ['stories/Card.stories.ts']);
	assert.equal(componentsForFiles(inventory, root, ['README.md']).size, 0);
});

test('readChangedFiles takes one path per line, normalised, without blanks', () => {
	assert.deepEqual(readChangedFiles('a/b.ts\n\nsrc\\x\\y.scss\r\n  \n'), ['a/b.ts', 'src/x/y.scss']);
});

const before = {
	label: 'dev-1',
	sha: 'aaaaaaaaa',
	suites: {
		ai: {
			results: [
				{
					id: 'E07',
					perComponent: [
						{ name: 'Accordion', kind: 'pattern', depth: 4, elements: 5, classes: 3, score: 80 },
					],
				},
				{
					id: 'E08',
					perComponent: [],
					unmeasured: [{ name: 'Accordion (x.scss)', reason: 'compile error: boom' }],
				},
			],
		},
	},
};
const after = {
	label: 'gate',
	sha: 'bbbbbbbbb',
	suites: {
		ai: {
			results: [
				{
					id: 'E07',
					perComponent: [
						{ name: 'Accordion', kind: 'pattern', depth: 3, elements: 5, classes: 3, score: 100 },
					],
				},
				{
					id: 'E08',
					perComponent: [
						{ name: 'Accordion', total: 10, literal: 2, routed: 5, important: 0, knobs: 5, score: 71 },
					],
				},
			],
		},
	},
};

test('formatTouchedReport shows each touched component with its cells before → after and the hints that matter', () => {
	const touched = new Map([
		['Accordion', { kind: 'pattern', files: ['src/scss/x.scss', 'stories/Accordion.stories.ts'] }],
	]);
	const md = formatTouchedReport(touched, before, after, ['E07', 'E08']);
	assert.match(md, /### 🧩 Components touched by this pull request/);
	assert.match(md, /1 component from 2 changed files; before = `dev-1` @ `aaaaaaaaa`/);
	assert.match(md, /\*\*Accordion\*\* \(pattern\)/);
	assert.match(md, /E07 80\.0 → 100\.0 \(🔼 \+20\.0\)/);
	assert.match(md, /E08 — → 71\.0 \(new\)/, 'an unmeasured cell before reads as new');
	assert.match(md, /E08: 5 of 10 themeable declarations/, 'the hint of a cell below 80 is listed');
	assert.doesNotMatch(md, /E07: Story markup/, 'a cell at 100 that improved needs no hint');
});

test('formatTouchedReport works without a baseline run and says nothing without touched components', () => {
	const touched = new Map([['Accordion', { kind: 'pattern', files: ['a.ts'] }]]);
	const md = formatTouchedReport(touched, null, after, ['E07']);
	assert.match(md, /no baseline run to compare with/);
	assert.match(md, /E07 100\.0/);
	assert.equal(formatTouchedReport(new Map(), before, after, ['E07']), '');
});
