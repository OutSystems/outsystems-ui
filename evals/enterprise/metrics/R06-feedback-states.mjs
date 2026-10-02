// @ts-check
/**
 * R06 · Feedback and State Behaviours.
 *
 * The states "UI Enterprise apps requirements" §2.2 lists, each checked in the component's compiled
 * CSS (and TypeScript for scripted states) where it applies: hover, focus-visible, press/active,
 * disabled, loading, invalid, and guarded motion.
 */
import { mean, round1 } from '../../lib/score.mjs';
import {
	componentCss,
	componentUniverse,
	describeChecks,
	includesAny,
	INTERACTIVE_CSS,
	LOADING_COMPONENTS,
	NON_INTERACTIVE_PATTERNS,
	patternText,
	VALIDATING_COMPONENTS,
	scoreChecks,
	themeGuards,
} from '../lib/signals.mjs';
import { checksCell } from '../../lib/present.mjs';

const HOVER = [':hover'];
const FOCUS = [':focus-visible', ':focus', '.is-focus-in'];
const ACTIVE = [':active', '.is-active', '.is--active', '.is-pressed', '.is--open', '.is-open', 'aria-expanded'];
const DISABLED = ['[disabled]', ':disabled', '.is-disabled', 'aria-disabled', 'AriaDisabled'];
const LOADING = ['is-loading', 'loading', 'spinner', 'skeleton', 'progress', 'aria-busy', 'AriaBusy'];
const INVALID = ['not-valid', 'has-error', 'is-invalid', 'feedback-message', 'aria-invalid'];
const MOTION = ['transition:', 'transition-', 'animation:', 'animation-'];

export const LABELS = {
	hover: 'hover state',
	focus: 'focus-visible state',
	active: 'press / open state',
	disabled: 'disabled state',
	loading: 'loading state',
	invalid: 'invalid / validation state',
	motion: 'motion guarded by prefers-reduced-motion',
};

/**
 * @param {{ name: string, kind: 'pattern'|'css' }} c
 * @param {string} css compiled CSS
 * @param {string} ts pattern TypeScript, '' for CSS-only
 * @param {{ reducedMotion?: boolean }} [guards] theme-level guards every component inherits
 */
export function checksFor(c, css, ts, guards = {}) {
	const interactive = c.kind === 'pattern' ? !NON_INTERACTIVE_PATTERNS.has(c.name) : INTERACTIVE_CSS.has(c.name);
	const both = `${css}\n${ts}`;
	return {
		hover: { applicable: interactive, pass: includesAny(css, HOVER) },
		focus: { applicable: interactive, pass: includesAny(css, FOCUS) },
		active: { applicable: interactive, pass: includesAny(both, ACTIVE) },
		disabled: { applicable: interactive, pass: includesAny(both, DISABLED) },
		loading: { applicable: LOADING_COMPONENTS.has(c.name), pass: includesAny(both, LOADING) },
		invalid: { applicable: VALIDATING_COMPONENTS.has(c.name), pass: includesAny(both, INVALID) },
		// the foundations reset guards every animation and transition under prefers-reduced-motion
		motion: {
			applicable: includesAny(css, MOTION),
			pass: css.includes('prefers-reduced-motion') || Boolean(guards.reducedMotion),
		},
	};
}

/** The kinds this eval measures (lib/kinds.mjs). */
const APPLIES_TO = ['pattern', 'component', 'layout'];

export default {
	id: 'R06',
	name: 'Feedback and State Behaviours',
	criterion: 'Enterprise requirements §2.2 behaviours: feedback, state change, system status',
	formula:
		'per component: 100 · passed / applicable for: hover, focus-visible, press/open, disabled (interactive components), loading (loading components), invalid (input components), motion guarded by prefers-reduced-motion (animating components); mean over components',
	movable: true,
	cls: 'movable',
	present: {
		scope: 'Per component: hover, focus-visible, press/open and disabled states where interactive; loading, invalid and guarded motion where they apply.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the state checks can run.',
		/** @param {any} row */
		cell(row) {
			return checksCell(row);
		},
		/** @param {any} m */
		advice(m) {
			return [
				m.summary,
				'State styles and prefers-reduced-motion guards are additive; a skeleton-loading component is R01 roadmap work.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		/** @type {{ name: string, reason: string, hint: string }[]} */
		const notApplicable = [];
		const guards = themeGuards(ctx);
		for (const c of componentUniverse(ctx, APPLIES_TO)) {
			const compiled = componentCss(ctx, c);
			if (compiled.css === null && !c.pattern) {
				unmeasured.push({ name: c.name, reason: compiled.error ?? 'no CSS' });
				continue;
			}
			// a pattern without a partial keeps its scripted-state checks
			const css = compiled.css ?? '';
			const ts = c.pattern ? patternText(ctx, c.pattern) : '';
			const checks = checksFor(c, css, ts, guards);
			const score = scoreChecks(checks);
			if (score === null) {
				notApplicable.push({
					name: c.name,
					reason: 'no interactive, loading, input or motion behaviour to check',
					hint: 'State checks apply once the component is interactive, loads, validates or animates.',
				});
				continue;
			}
			const { failed } = describeChecks(checks, LABELS);
			perComponent.push({ name: c.name, kind: c.kind, checks, failed, score });
		}
		const count = (/** @type {string} */ k) => ({
			pass: perComponent.filter((r) => r.checks[k].applicable && r.checks[k].pass).length,
			all: perComponent.filter((r) => r.checks[k].applicable).length,
		});
		const loading = count('loading');
		const invalid = count('invalid');
		const motion = count('motion');
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary: `loading state in ${loading.pass}/${loading.all} loading components, invalid state in ${invalid.pass}/${invalid.all} input components, motion guarded in ${motion.pass}/${motion.all} animating components`,
			raw: Object.fromEntries(Object.keys(LABELS).map((k) => [k, count(k)])),
			perComponent: [...perComponent].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)),
			unmeasured,
			notApplicable,
		};
	},
};
