// @ts-check
/**
 * R04 · Theme Foundations (token theme).
 *
 * Part A (40 %): the eight foundation rows of "UI Enterprise apps requirements" §2.3 exist in the
 * token theme and at least one component consumes them. Part B (60 %): per component, the share of
 * the foundation families it declares that it reads through tokens or knobs, plus the dark-theme,
 * RTL and reduced-motion variants where the component needs them.
 */
import { mean, round1 } from '../../ai-friendliness/lib/score.mjs';
import {
	componentCss,
	componentUniverse,
	describeChecks,
	includesAny,
	scoreChecks,
	themeGuards,
} from '../lib/signals.mjs';

/**
 * Foundation rows → the CSS properties that declare them and the token families that carry them.
 * Compiled SCSS keeps `var(--token-…)` / `var(--color-…)` / `var(--osui-…)` reads.
 */
export const FOUNDATIONS = {
	iconography: {
		props: ['font-family: "osui-icons', String.raw`content: "\e`, 'mask-image', '.icon'],
		tokens: ['--token-icon'],
	},
	colours: {
		props: ['color:', 'background:', 'background-color:', 'border-color:', 'fill:', 'stroke:'],
		tokens: [
			'--token-bg',
			'--token-text',
			'--token-border',
			'--token-icon',
			'--token-semantics',
			'--color-',
			'--token-primitives',
		],
	},
	typography: { props: ['font-size:', 'font-weight:', 'line-height:', 'font-family:'], tokens: ['--token-font'] },
	shape: { props: ['border-radius:'], tokens: ['--token-shape'] },
	spacing: { props: ['padding:', 'padding-', 'margin:', 'margin-', 'gap:'], tokens: ['--token-space'] },
	elevation: { props: ['box-shadow:'], tokens: ['--token-shadow', '--token-elevation'] },
	grid: {
		props: ['display: grid', 'display: flex', 'grid-template', 'width:', 'max-width:'],
		tokens: ['--token-scale', '--token-space'],
	},
	responsive: {
		props: ['.phone', '.tablet', '.desktop', '@media', '.landscape', '.portrait'],
		tokens: ['.phone', '.tablet', '.desktop', '@media'],
	},
};

export const VARIANT_LABELS = {
	dark: 'dark-ready where colours are set (tokened colours or .os-dark rules)',
	rtl: 'RTL rules (.is-rtl) where direction matters',
	motion: 'prefers-reduced-motion guard where it animates (own rule or the theme-level guard)',
};

const DIRECTIONAL = [
	'left:',
	'right:',
	'margin-left',
	'margin-right',
	'padding-left',
	'padding-right',
	'border-left',
	'border-right',
	'text-align: left',
	'text-align: right',
	'translateX',
];
const MOTION = ['transition:', 'transition-', 'animation:', 'animation-'];

/**
 * A declaration-level view of a compiled CSS text: which foundation families it declares and which
 * of those it reads through tokens or knobs.
 * @param {string} css
 */
export function familiesOf(css) {
	/** @type {Record<string, { declared: boolean, tokened: boolean }>} */
	const out = {};
	for (const [name, f] of Object.entries(FOUNDATIONS)) {
		const declared = includesAny(css, f.props);
		const tokened =
			declared &&
			(includesAny(
				css,
				f.tokens.map((t) => (t.startsWith('--') ? `var(${t}` : t))
			) ||
				css.includes('var(--osui-'));
		out[name] = { declared, tokened };
	}
	return out;
}

/**
 * @param {string} css compiled CSS of one component
 * @param {{ reducedMotion?: boolean }} [guards] theme-level guards every component inherits
 */
export function checksFor(css, guards = {}) {
	const families = familiesOf(css);
	const declared = Object.entries(families).filter(([, f]) => f.declared);
	const tokened = declared.filter(([, f]) => f.tokened).length;
	const setsColour = families.colours.declared;
	const checks = {
		tokens: { applicable: declared.length > 0, pass: declared.length > 0 && tokened === declared.length },
		// the token theme swaps tokens in _theme-dark.scss, so tokened colours are dark-ready by construction
		dark: { applicable: setsColour, pass: families.colours.tokened || css.includes('os-dark') },
		rtl: { applicable: includesAny(css, DIRECTIONAL), pass: css.includes('is-rtl') },
		// the foundations reset guards every animation and transition under prefers-reduced-motion
		motion: {
			applicable: includesAny(css, MOTION),
			pass: css.includes('prefers-reduced-motion') || Boolean(guards.reducedMotion),
		},
	};
	return { families, declared: declared.map(([k]) => k), tokened, checks };
}

/**
 * Part A over the whole theme: every foundation row present and consumed by at least one component.
 * @param {string} tokensText raw text of src/scss/tokens
 * @param {string[]} componentCssTexts
 */
export function foundationsPresent(tokensText, componentCssTexts) {
	/** @type {Record<string, boolean>} */
	const out = {};
	for (const [name, f] of Object.entries(FOUNDATIONS)) {
		const defined = includesAny(tokensText, f.tokens) || name === 'responsive';
		const consumed = componentCssTexts.some((css) => familiesOf(css)[name].tokened);
		out[name] = defined && consumed;
	}
	return out;
}

export default {
	id: 'R04',
	name: 'Theme Foundations',
	criterion: 'Enterprise requirements §2.3 styling: up-to-date theme foundations',
	formula:
		'40 · (foundation rows defined in the token theme and consumed by a component)/8 + 60 · mean over components of passed/applicable for: every declared family read via tokens or knobs, .os-dark rules when colours are set, .is-rtl rules when direction matters, prefers-reduced-motion guard when it animates',
	movable: true,
	cls: 'movable',
	/** @param {import('../../ai-friendliness/lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		/** @type {any[]} */
		const perComponent = [];
		/** @type {{ name: string, reason: string }[]} */
		const unmeasured = [];
		/** @type {string[]} */
		const cssTexts = [];
		const guards = themeGuards(ctx);
		for (const c of componentUniverse(ctx)) {
			const { css, error } = componentCss(ctx, c);
			if (css === null) {
				unmeasured.push({ name: c.name, reason: error ?? 'no CSS' });
				continue;
			}
			cssTexts.push(css);
			const r = checksFor(css, guards);
			const score = scoreChecks(r.checks);
			if (score === null) {
				unmeasured.push({ name: c.name, reason: 'no foundation declarations' });
				continue;
			}
			const { failed } = describeChecks(r.checks, {
				tokens: 'declared families read via tokens',
				...VARIANT_LABELS,
			});
			const untokened = r.declared.filter((k) => !r.families[k].tokened);
			perComponent.push({
				name: c.name,
				kind: c.kind,
				declared: r.declared,
				untokened,
				checks: r.checks,
				failed,
				score,
			});
		}
		const tokensDir = ctx.inventory.root;
		const tokensText = ['_variables.scss', '_theme-dark.scss', '_utilities.scss']
			.map((f) => ctx.readText(`${tokensDir}/src/scss/tokens/${f}`))
			.join('\n');
		const present = foundationsPresent(tokensText, cssTexts);
		const presentCount = Object.values(present).filter(Boolean).length;
		const partB = mean(perComponent.map((r) => r.score)) ?? 0;
		const score = round1(40 * (presentCount / 8) + 0.6 * partB);
		const dark = perComponent.filter((r) => r.checks.dark.applicable);
		const motion = perComponent.filter((r) => r.checks.motion.applicable);
		return {
			score,
			summary: `${presentCount}/8 foundations defined and consumed; dark rules in ${dark.filter((r) => r.checks.dark.pass).length}/${dark.length} colour-setting components, reduced-motion guard in ${motion.filter((r) => r.checks.motion.pass).length}/${motion.length} animating components`,
			raw: {
				foundations: present,
				presentCount,
				componentMean: round1(partB),
				darkStyled: dark.filter((r) => r.checks.dark.pass).length,
				darkApplicable: dark.length,
				motionGuarded: motion.filter((r) => r.checks.motion.pass).length,
				motionApplicable: motion.length,
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)),
			unmeasured,
		};
	},
};
