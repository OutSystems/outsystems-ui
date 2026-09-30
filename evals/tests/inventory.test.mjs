import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildInventory, matchStory } from '../lib/inventory.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const inv = buildInventory(root);
const byName = Object.fromEntries(inv.patterns.map((p) => [p.name, p]));
const rel = (p) => (p ? path.relative(root, p).split(path.sep).join('/') : p);

test('discovers every public *API.ts pattern, sorted by name', () => {
	assert.equal(inv.patterns.length, 33);
	assert.deepEqual(
		inv.patterns.map((p) => p.name),
		[...inv.patterns.map((p) => p.name)].sort()
	);
	assert.ok(byName.Accordion);
	assert.ok(byName.TouchEvents);
});

test('Accordion resolves its framework files, SCSS partial and story', () => {
	const a = byName.Accordion;
	assert.equal(rel(a.apiFile), 'src/scripts/OutSystems/OSUI/Patterns/AccordionAPI.ts');
	assert.equal(rel(a.patternDir), 'src/scripts/OSFramework/OSUI/Pattern/Accordion');
	assert.ok(a.configFiles.map(rel).includes('src/scripts/OSFramework/OSUI/Pattern/Accordion/AccordionConfig.ts'));
	assert.ok(a.enumFiles.map(rel).includes('src/scripts/OSFramework/OSUI/Pattern/Accordion/Enum.ts'));
	assert.ok(a.interfaceFiles.map(rel).includes('src/scripts/OSFramework/OSUI/Pattern/Accordion/IAccordion.ts'));
	assert.ok(a.classFiles.map(rel).includes('src/scripts/OSFramework/OSUI/Pattern/Accordion/Accordion.ts'));
	assert.equal(rel(a.scssFile), 'src/scss/04-patterns/02-content/accordion/_accordion.scss');
	assert.equal(rel(a.storyFile), 'stories/Accordion.stories.ts');
});

test('provider-based patterns include provider directories and their config files', () => {
	const d = byName.Dropdown;
	assert.ok(d.providerDirs.map(rel).includes('src/scripts/Providers/OSUI/Dropdown'));
	assert.ok(
		d.configFiles
			.map(rel)
			.includes('src/scripts/Providers/OSUI/Dropdown/VirtualSelect/AbstractVirtualSelectConfig.ts')
	);
	assert.ok(d.factoryFiles.map(rel).includes('src/scripts/OSFramework/OSUI/Pattern/Dropdown/DropdownFactory.ts'));
	// nested pattern sub-directories are walked
	assert.ok(
		d.classFiles.map(rel).includes('src/scripts/OSFramework/OSUI/Pattern/Dropdown/ServerSide/DropdownServerSide.ts')
	);
	// case-insensitive provider directory match (Datepicker vs DatePicker)
	assert.ok(byName.DatePicker.providerDirs.map(rel).includes('src/scripts/Providers/OSUI/Datepicker'));
});

test('child patterns fall back to the parent story by longest prefix', () => {
	assert.equal(rel(byName.AccordionItem.storyFile), 'stories/Accordion.stories.ts');
	assert.equal(rel(byName.TabsHeaderItem.storyFile), 'stories/Tabs.stories.ts');
	assert.equal(rel(byName.DropdownServerSideItem.storyFile), 'stories/DropdownServerSide.stories.ts');
});

test('contractFiles is the union of api, class, config, enum, interface and factory files', () => {
	const a = byName.Accordion;
	const expected = new Set(
		[a.apiFile, ...a.classFiles, ...a.configFiles, ...a.enumFiles, ...a.interfaceFiles, ...a.factoryFiles].map(rel)
	);
	assert.deepEqual(new Set(a.contractFiles.map(rel)), expected);
});

test('CSS-only components exclude vendor baselines, previews and pattern-owned partials', () => {
	const names = inv.cssComponents.map((c) => c.name);
	assert.ok(names.includes('card'));
	assert.ok(names.includes('btn'));
	assert.ok(!names.some((n) => n.includes('_lib')));
	assert.ok(!names.some((n) => n.includes('ss_preview')));
	const patternScss = new Set(inv.patterns.map((p) => p.scssFile).filter(Boolean));
	assert.ok(inv.cssComponents.every((c) => !patternScss.has(c.scssFile)));
	const card = inv.cssComponents.find((c) => c.name === 'card');
	assert.equal(rel(card.scssFile), 'src/scss/04-patterns/02-content/_card.scss');
	assert.equal(rel(card.storyFile), 'stories/Card.stories.ts');
});

test('matchStory resolves the widget-story aliases of btn and radio-button', () => {
	const stories = new Map([
		['button', '/s/widgets/Button.stories.ts'],
		['radiogroup', '/s/widgets/RadioGroup.stories.ts'],
	]);
	assert.equal(matchStory('btn', stories), '/s/widgets/Button.stories.ts');
	assert.equal(matchStory('radio-button', stories), '/s/widgets/RadioGroup.stories.ts');
	assert.equal(matchStory('badge', stories), null);
});

test('every CSS component carries its directory tier, its registry kind and its source group', () => {
	const css = Object.fromEntries(inv.cssComponents.map((c) => [c.name, c]));
	assert.deepEqual([css.card.tier, css.card.kind, css.card.source], ['component', 'component', 'patterns']);
	assert.deepEqual([css.btn.tier, css.btn.kind, css.btn.source], ['component', 'component', 'widgets']);
	assert.deepEqual([css.header.tier, css.header.kind, css.header.source], ['layout', 'layout', 'layout']);
	assert.deepEqual([css.separator.tier, css.separator.kind], ['utility', 'utility']);
	assert.deepEqual(
		[css.animate.tier, css.animate.kind],
		['component', 'utility'],
		'the registry overrides the directory'
	);
	assert.deepEqual([css.section.tier, css.section.kind, css.section.source], ['component', 'component', 'patterns']);
	assert.deepEqual(
		[css['layout-section'].tier, css['layout-section'].kind, rel(css['layout-section'].scssFile)],
		['layout', 'layout', 'src/scss/02-layout/_section.scss'],
		'a partial sharing its file name with a pattern partial is named after its directory group'
	);
	assert.equal(new Set(inv.cssComponents.map((c) => c.name)).size, inv.cssComponents.length, 'names are unique');
	assert.deepEqual([css['pull-to-refresh'].tier, css['pull-to-refresh'].kind], ['utility', 'layout']);
	const families = inv.cssComponents.filter((c) => c.source === 'useful');
	assert.equal(families.length, 24, 'the 05-useful partials are utility families');
	assert.ok(families.every((c) => c.kind === 'utility' && c.storyFile === null && c.host === null));
	assert.equal(rel(css['space-margin'].scssFile), 'src/scss/05-useful/_space-margin.scss');
	assert.equal(inv.cssComponents.filter((c) => c.kind === 'utility').length, 30);
});

test('host-styled CSS components carry their host; components with a contract of their own do not', () => {
	const css = Object.fromEntries(inv.cssComponents.map((c) => [c.name, c]));
	assert.match(css.layout.host.host, /Layout blocks/);
	assert.match(css.login.host.host, /Login common screen/);
	assert.equal(css.badge.host, null);
	assert.equal(css['bulk-actions'].host, null, 'bulk actions have a markup contract of their own');
});
