import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { createContext } from '../lib/context.mjs';
import { loadRegistry } from '../lib/registry.mjs';
import { applyFixes, diagnose, renderDoctor, suggestEntry } from '../tools/doctor.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('suggestEntry derives a pattern entry from its code signals', () => {
	const overlay = suggestEntry({
		kind: 'pattern',
		name: 'Popover',
		providerDirs: [],
		text: 'this.focusTrap = new FocusTrap(); if (e.key === GlobalEnum.Keycodes.Escape) this.close(); Helper.A11Y.AriaLivePolite(x)',
		css: '',
	});
	assert.deepEqual(overlay, { kind: 'pattern', roles: ['overlay', 'feedback'], derived: true });
	const provider = suggestEntry({
		kind: 'pattern',
		name: 'ColorPicker',
		providerDirs: ['/x/providers/colorpicker'],
		text: 'switch (e.key) { case GlobalEnum.Keycodes.ArrowLeft: }',
		css: '',
	});
	assert.deepEqual(provider.roles, ['provider', 'composite']);
	const inert = suggestEntry({
		kind: 'pattern',
		name: 'Ticker',
		providerDirs: [],
		text: 'setInterval(() => this.tick(), 100)',
		css: '',
	});
	assert.deepEqual(inert.roles, ['non-interactive']);
	const events = suggestEntry({
		kind: 'pattern',
		name: 'HoverEvents',
		providerDirs: [],
		text: 'this.selfElement.addEventListener("click", cb)',
		css: '',
	});
	assert.deepEqual(events.roles, ['no-dom']);
});

test('suggestEntry derives a CSS component entry from its compiled CSS and keeps the discovered tier', () => {
	const chip = suggestEntry({
		kind: 'component',
		name: 'chip',
		text: '',
		css: '.chip:hover{} .chip.is-loading{} .chip.not-valid{}',
	});
	assert.deepEqual(chip, { kind: 'component', interactive: true, loading: true, validating: true, derived: true });
	assert.deepEqual(suggestEntry({ kind: 'component', name: 'rule', text: '', css: '.rule{height:1px}' }), {
		kind: 'component',
		derived: true,
	});
	assert.deepEqual(suggestEntry({ kind: 'layout', name: 'footer', text: '', css: '.footer:hover{}' }), {
		kind: 'layout',
		interactive: true,
		derived: true,
	});
	assert.deepEqual(
		suggestEntry({ kind: 'utility', name: 'space-gap', text: '', css: '.gap-s:hover{}' }),
		{ kind: 'utility', derived: true },
		'a utility family is classified by its tier alone'
	);
});

test('diagnose lists unknown and stale components with suggestions, and components without a story', () => {
	const ctx = createContext(root);
	const registry = loadRegistry();
	const clean = diagnose(ctx, registry);
	assert.deepEqual(clean.unknown, []);
	assert.deepEqual(clean.stale, []);
	assert.ok(Array.isArray(clean.noStory));
	const broken = {
		components: Object.fromEntries(
			Object.entries(registry.components).filter(([n]) => n !== 'Accordion' && n !== 'badge')
		),
	};
	broken.components.Ghost = { kind: 'css' };
	const r = diagnose(ctx, broken);
	assert.deepEqual(
		r.unknown.map((u) => [u.name, u.kind, u.suggested.derived]),
		[
			['Accordion', 'pattern', true],
			['badge', 'component', true],
		]
	);
	assert.deepEqual(r.badKinds, []);
	assert.ok(Array.isArray(r.tierOverride), 'tier overrides are reported, not failed');
	assert.deepEqual(r.stale, ['Ghost']);
	const md = renderDoctor(r);
	assert.match(md, /Accordion/);
	assert.match(md, /Ghost/);
	assert.match(md, /--fix/);
	assert.equal(renderDoctor(clean), '', 'nothing to say when the registry and the tree agree');
	const fixed = applyFixes(broken, r);
	assert.equal(fixed.components.Accordion.derived, true);
	assert.equal(fixed.components.badge.kind, 'component');
	assert.equal('Ghost' in fixed.components, false, 'stale entries are dropped');
	assert.deepEqual(
		Object.keys(fixed.components),
		[...Object.keys(fixed.components)].sort((a, b) => a.localeCompare(b)),
		'entries stay sorted'
	);
});
