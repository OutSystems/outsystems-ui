import assert from 'node:assert/strict';
import { test } from 'node:test';

import { includesAny, osuiVarNames, scoreChecks } from '../lib/signals.mjs';
import { checksFor as a11y } from '../metrics/R02-accessibility-contract.mjs';
import { checksFor as keys, requiredKeys } from '../metrics/R03-keyboard-operability.mjs';
import { checksFor as theme, familiesOf, foundationsPresent } from '../metrics/R04-theme-foundations.mjs';
import { checksFor as density } from '../metrics/R05-responsive-density.mjs';
import { checksFor as states } from '../metrics/R06-feedback-states.mjs';

test('signals: substring matching, --osui-* name scanning and check scoring', () => {
	assert.equal(includesAny('a b c', ['x', 'b']), true);
	assert.equal(includesAny('a b c', ['x']), false);
	assert.deepEqual(
		osuiVarNames(
			'.x{padding:var(--osui-card-padding, 1px);color:var(--osui-card-color)} .y{gap:var(--osui-card-padding)}'
		),
		['--osui-card-color', '--osui-card-padding']
	);
	assert.equal(
		scoreChecks({
			a: { applicable: true, pass: true },
			b: { applicable: true, pass: false },
			c: { applicable: false, pass: false },
		}),
		50
	);
	assert.equal(scoreChecks({ c: { applicable: false, pass: false } }), null);
});

test('R02: ARIA, live region and focus checks apply by pattern role; styles apply to every component', () => {
	const ts = 'Helper.A11Y.RoleButton(el); Helper.A11Y.AriaLivePolite(el); this.focusTrap = new FocusTrap()';
	const css = '.x.has-accessible-features:focus{outline:1px} .os-high-contrast .x{border:1px}';
	const c = a11y({ kind: 'pattern', name: 'Notification' }, ts, css);
	assert.deepEqual(Object.fromEntries(Object.entries(c).map(([k, v]) => [k, [v.applicable, v.pass]])), {
		aria: [true, true],
		live: [true, true],
		focus: [true, true],
		features: [true, true],
		contrast: [true, true],
	});
	const cssOnly = a11y({ kind: 'css', name: 'badge' }, '', '.badge{color:red}');
	assert.equal(cssOnly.aria.applicable, false);
	assert.equal(cssOnly.features.pass, false);
	assert.equal(scoreChecks(cssOnly), 0);
	const tabs = a11y({ kind: 'pattern', name: 'Tabs' }, 'A11Y.RoleTab(x)', '');
	assert.equal(tabs.live.applicable, false, 'Tabs give no feedback');
	assert.equal(tabs.focus.applicable, false, 'Tabs are not an overlay');
	assert.equal(
		a11y({ kind: 'pattern', name: 'SwipeEvents' }, '', '').aria.applicable,
		false,
		'gesture helpers render no DOM'
	);
	assert.equal(
		a11y({ kind: 'css', name: 'badge' }, '', '.badge{color:red}', { focusRing: true }).features.pass,
		true,
		'the theme focus ring counts'
	);
	const progress = a11y(
		{ kind: 'pattern', name: 'Progress' },
		'Constants.A11YAttributes.Role.Progressbar; aria-valuenow',
		''
	);
	assert.equal(progress.live.pass, true, 'a progressbar with aria-valuenow announces its value');
});

test('R03: required keys follow the role and providers are credited only when the wrapper handles nothing', () => {
	assert.deepEqual(requiredKeys('Tooltip'), ['activate', 'escape', 'tab']);
	assert.deepEqual(requiredKeys('Tabs'), ['activate', 'arrows', 'tab']);
	assert.deepEqual(requiredKeys('Rating'), ['activate', 'arrows', 'tab']);
	assert.deepEqual(requiredKeys('Search'), ['activate'], 'a native control handles Tab itself');
	const own = keys(
		'Tooltip',
		'if (e.key === GlobalEnum.Keycodes.Escape) close(); Helper.A11Y.TabIndexTrue(el); Keycodes.Enter'
	);
	assert.equal(own.delegated, false);
	assert.equal(own.checks.escape.pass, true);
	assert.equal(own.checks.activate.via, 'pattern');
	const provider = keys('DatePicker', 'no keys here');
	assert.equal(provider.delegated, true);
	assert.equal(provider.checks.arrows.pass, true);
	assert.equal(provider.checks.arrows.via, 'provider');
	const partial = keys('Dropdown', 'Keycodes.Escape');
	assert.equal(partial.checks.escape.via, 'pattern');
	assert.equal(partial.checks.activate.via, 'provider', 'the provider covers the keys the wrapper does not handle');
	assert.equal(partial.delegated, true);
	const shared = keys('TabsHeaderItem', 'no handlers', '', 'case GlobalEnum.Keycodes.ArrowRight: focusNext()');
	assert.equal(shared.checks.arrows.via, 'shared', 'the parent implements the roving focus');
	const escapeViaFeature = keys(
		'OverflowMenu',
		'new Feature.Balloon.Balloon(this)',
		'',
		'const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;'
	);
	assert.equal(escapeViaFeature.checks.escape.via, 'shared');
	const inputInTs = keys('Rating', 'const input = `<input type="radio">`', '');
	assert.equal(inputInTs.checks.activate.via, 'native', 'a native input created in TypeScript activates itself');
	const native = keys('Tabs', 'no handlers', '<button class="osui-tabs__header-item">Tab</button>');
	assert.equal(native.checks.activate.pass, true, 'a native button activates with Enter/Space');
	assert.equal(native.checks.activate.via, 'native');
	assert.equal(native.checks.arrows.pass, false, 'arrow keys still need a handler');
});

test('R04: foundation families, tokened reads and the variant checks', () => {
	const css =
		'.c{color:var(--color-text-primary);padding:var(--token-space-m);border-radius:4px;transition:all .2s;margin-left:2px}';
	const f = familiesOf(css);
	assert.equal(f.colours.tokened, true);
	assert.equal(f.spacing.tokened, true);
	assert.equal(f.shape.declared, true);
	assert.equal(f.shape.tokened, false, 'a literal radius is not tokened');
	const r = theme(css);
	assert.deepEqual(r.declared.sort(), ['colours', 'shape', 'spacing']);
	assert.equal(r.checks.tokens.pass, false);
	assert.equal(r.checks.dark.applicable, true);
	assert.equal(r.checks.dark.pass, true, 'tokened colours follow the dark token set by construction');
	assert.equal(theme('.c{color:#333}').checks.dark.pass, false, 'a literal colour is not dark-ready');
	assert.equal(r.checks.rtl.applicable, true);
	assert.equal(r.checks.motion.applicable, true);
	assert.equal(r.checks.motion.pass, false);
	assert.equal(
		theme(css, { reducedMotion: true }).checks.motion.pass,
		true,
		'the theme-level guard covers every component'
	);
	const guarded = theme(
		'.c{color:var(--color-x);transition:opacity .2s} @media (prefers-reduced-motion: reduce){.c{transition:none}} .os-dark .c{color:#fff}'
	);
	assert.equal(guarded.checks.motion.pass, true);
	assert.equal(guarded.checks.dark.pass, true);
	const present = foundationsPresent(
		'--token-icon-x --token-bg-x --token-font-x --token-shape-x --token-space-x --token-shadow-x --token-scale-x',
		[
			css,
			'.i{font-family: "osui-icons";color:var(--token-icon-a)}',
			'.g{display: flex;width:var(--token-scale-1)}',
			'.e{box-shadow:var(--token-shadow-1)}',
			'.t{font-size:var(--token-font-s)}',
			'.s{border-radius:var(--token-shape-m)}',
			'.r{width:1px}.phone .r{width:2px}',
		]
	);
	assert.deepEqual(Object.values(present).every(Boolean), true, JSON.stringify(present));
});

test('R05: breakpoints where laying out, density where expected, RTL where directional', () => {
	const table = density(
		'table',
		'.table{width:100%;padding:var(--osui-table-cell-padding)} .phone .table{display:block}'
	);
	assert.equal(table.breakpoints.pass, true);
	assert.equal(table.density.applicable, true);
	assert.equal(table.density.pass, true);
	assert.deepEqual(table.density.knobs, ['--osui-table-cell-padding']);
	assert.equal(table.rtl.applicable, false);
	const badge = density('badge', '.badge{padding:2px;margin-left:4px}');
	assert.equal(badge.density.applicable, false);
	assert.equal(badge.rtl.applicable, true);
	assert.equal(badge.rtl.pass, false);
	assert.equal(badge.breakpoints.pass, false);
});

test('R06: states apply by interactivity, loading and validation membership, motion by animation', () => {
	const btn = states(
		{ name: 'btn', kind: 'css' },
		'.btn:hover{}.btn:focus-visible{}.btn:active{}.btn[disabled]{} .btn.is-loading{} .btn{transition:all .2s}',
		''
	);
	assert.equal(btn.hover.pass && btn.focus.pass && btn.active.pass && btn.disabled.pass && btn.loading.pass, true);
	assert.equal(
		states({ name: 'btn', kind: 'css' }, '.btn{transition:all .2s}', '', { reducedMotion: true }).motion.pass,
		true
	);
	assert.equal(btn.invalid.applicable, false);
	assert.equal(btn.motion.applicable, true);
	assert.equal(btn.motion.pass, false);
	const sep = states({ name: 'separator', kind: 'css' }, '.separator{height:1px}', '');
	assert.equal(scoreChecks(sep), null, 'nothing to check on a separator');
	const dd = states(
		{ name: 'Dropdown', kind: 'pattern' },
		'.osui-dropdown.not-valid{}',
		'Helper.A11Y.AriaDisabledTrue(el)'
	);
	assert.equal(dd.invalid.pass, true);
	assert.equal(dd.disabled.pass, true, 'a scripted disabled state counts');
});
