// @ts-check
/**
 * R02 · Accessibility Contract (static proxies).
 *
 * Detects that a component addresses the accessibility contract, not WCAG conformance: ARIA roles
 * and states set from TypeScript (the `Helper.A11Y` helper or literal attributes), live-region
 * announcements where the pattern gives feedback, focus management where it opens a layer, and
 * the `.has-accessible-features` / `.os-high-contrast` styles in its compiled CSS.
 */
import { mean, round1 } from '../../lib/score.mjs';
import {
	componentCss,
	componentUniverse,
	describeChecks,
	FEEDBACK_PATTERNS,
	includesAny,
	NO_DOM_PATTERNS,
	OVERLAY_PATTERNS,
	patternText,
	scoreChecks,
	themeGuards,
} from '../lib/signals.mjs';
import { checksCell, list } from '../../lib/present.mjs';

export const ARIA_NEEDLES = ['A11Y.', 'aria-', "'role'", '"role"'];
export const LIVE_NEEDLES = [
	'Role.Progressbar',
	'aria-valuenow',
	'Aria.ValueMin',
	'AriaLivePolite',
	'AriaLiveAssertive',
	'aria-live',
	'AriaBusyTrue',
	'aria-busy',
	'RoleAlert',
	'RoleStatus',
	'role="alert"',
	'role="status"',
];
export const FOCUS_NEEDLES = [
	'.focus(',
	'FocusTrap',
	'focusTrap',
	'FocusManager',
	'SetElementsTabIndex',
	'TabIndexTrue',
	'tabindex',
];
export const LABELS = {
	aria: 'ARIA roles/states set',
	live: 'feedback announced (aria-live / role alert|status)',
	focus: 'focus managed on open/close',
	features: '.has-accessible-features styles',
	contrast: '.os-high-contrast styles',
};

/**
 * @param {{ kind: 'pattern'|'css', name: string }} c
 * @param {string} ts pattern TypeScript (empty for CSS-only components)
 * @param {string} css compiled CSS
 * @param {{ focusRing?: boolean }} [guards] theme-level guards every component inherits
 */
export function checksFor(c, ts, css, guards = {}) {
	const isPattern = c.kind === 'pattern';
	return {
		aria: { applicable: isPattern && !NO_DOM_PATTERNS.has(c.name), pass: includesAny(ts, ARIA_NEEDLES) },
		live: { applicable: isPattern && FEEDBACK_PATTERNS.has(c.name), pass: includesAny(ts, LIVE_NEEDLES) },
		focus: { applicable: isPattern && OVERLAY_PATTERNS.has(c.name), pass: includesAny(ts, FOCUS_NEEDLES) },
		// the theme's global focus ring (.has-accessible-features :focus) covers every component
		features: { applicable: true, pass: css.includes('has-accessible-features') || Boolean(guards.focusRing) },
		contrast: { applicable: true, pass: css.includes('os-high-contrast') },
	};
}

/** The tiers this eval measures (lib/tiers.mjs). */
const APPLIES_TO = ['pattern', 'component', 'layout'];

export default {
	id: 'R02',
	name: 'Accessibility Contract',
	criterion: 'Enterprise requirements §1 accessibility compliance, §3 WCAG 2.1',
	formula:
		'per component: 100 · passed / applicable over five checks — ARIA set (patterns that render DOM), feedback announced (feedback patterns), focus managed (overlay patterns), visible focus (.has-accessible-features rules, or the theme-level focus ring), .os-high-contrast styles; mean over components. A static proxy: detects the contract being addressed, not conformance',
	movable: true,
	cls: 'movable',
	present: {
		scope: 'Per component: ARIA set and, where the role needs it, feedback announced and focus managed (patterns); .has-accessible-features and .os-high-contrast styles (every component with CSS).',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the style checks can run.',
		/** @param {any} row */
		cell(row) {
			return checksCell(row);
		},
		/** @param {any} m */
		advice(m) {
			const noAria = m.raw?.patternsWithoutAria ?? [];
			return [
				m.summary,
				noAria.length
					? `Patterns setting no ARIA from TypeScript: ${list(noAria, 8)} (provider-rendered pickers rely on their library).`
					: 'Every pattern sets ARIA.',
				'Adding .has-accessible-features and .os-high-contrast rules per component is additive; a dynamic axe pass over Storybook is the next step for real violations.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		const guards = themeGuards(ctx);
		for (const c of componentUniverse(ctx, APPLIES_TO)) {
			const compiled = componentCss(ctx, c);
			if (compiled.css === null && !c.pattern) {
				unmeasured.push({ name: c.name, reason: compiled.error ?? 'no CSS' });
				continue;
			}
			// a pattern without a partial keeps its TypeScript checks; the style checks do not apply
			const css = compiled.css ?? '';
			const ts = c.pattern ? patternText(ctx, c.pattern) : '';
			const checks = checksFor(c, ts, css, guards);
			if (compiled.css === null) {
				checks.features.applicable = false;
				checks.contrast.applicable = false;
			}
			const { failed, passed } = describeChecks(checks, LABELS);
			perComponent.push({
				name: c.name,
				kind: c.kind,
				checks,
				failed,
				passed,
				score: scoreChecks(checks) ?? 100,
			});
		}
		const patterns = perComponent.filter((r) => r.kind === 'pattern');
		const noAria = patterns.filter((r) => !r.checks.aria.pass).map((r) => r.name);
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary: `${patterns.length - noAria.length}/${patterns.length} patterns set ARIA; ${perComponent.filter((r) => r.checks.features.pass).length}/${perComponent.length} components style .has-accessible-features, ${perComponent.filter((r) => r.checks.contrast.pass).length} .os-high-contrast`,
			raw: {
				components: perComponent.length,
				patternsWithAria: patterns.length - noAria.length,
				patternsWithoutAria: noAria,
				featuresStyled: perComponent.filter((r) => r.checks.features.pass).length,
				contrastStyled: perComponent.filter((r) => r.checks.contrast.pass).length,
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)),
			unmeasured,
		};
	},
};
