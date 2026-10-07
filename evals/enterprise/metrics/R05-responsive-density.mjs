// @ts-check
/**
 * R05 · Responsiveness and Density.
 *
 * Per component: breakpoint rules where it lays content out, a size or density axis where the
 * document asks for one (tables, lists, forms, inputs, dropdowns, tabs, cards, pagination, bulk
 * actions), and RTL handling where direction matters.
 */
import { mean, round1 } from '../../lib/score.mjs';
import {
	componentCss,
	componentUniverse,
	DENSITY_COMPONENTS,
	describeChecks,
	includesAny,
	NO_PARTIAL,
	NO_PARTIAL_HINT,
	osuiVarNames,
	scoreChecks,
} from '../lib/signals.mjs';
import { checksCell, list } from '../../lib/present.mjs';

const LAYOUT = [
	'display: flex',
	'display: grid',
	'width:',
	'max-width:',
	'min-width:',
	'height:',
	'padding:',
	'padding-',
];
const BREAKPOINTS = ['.phone', '.tablet', '.desktop', '@media', '.landscape', '.portrait'];
const SIZE_CLASSES = [
	'.is-small',
	'.is-large',
	'.is-compact',
	'.is-dense',
	'.is-relaxed',
	'-small',
	'-large',
	'-compact',
];
const KNOB_AXES = ['padding', 'height', 'size', 'gap', 'spacing', 'density'];
const DIRECTIONAL = [
	'left:',
	'right:',
	'margin-left',
	'margin-right',
	'padding-left',
	'padding-right',
	'border-left',
	'border-right',
	'translateX',
];

export const LABELS = {
	breakpoints: 'breakpoint rules (.phone/.tablet/.desktop or @media)',
	density: 'size or density axis (variant class or --osui-*-padding/height/size knob)',
	rtl: 'RTL rules (.is-rtl)',
};

/**
 * @param {string} name
 * @param {string} css compiled CSS
 */
export function checksFor(name, css) {
	const knobs = osuiVarNames(css);
	const densityKnobs = knobs.filter((k) => includesAny(k, KNOB_AXES));
	return {
		breakpoints: { applicable: includesAny(css, LAYOUT), pass: includesAny(css, BREAKPOINTS) },
		density: {
			applicable: DENSITY_COMPONENTS.has(name),
			pass: includesAny(css, SIZE_CLASSES) || densityKnobs.length > 0,
			knobs: densityKnobs,
		},
		rtl: { applicable: includesAny(css, DIRECTIONAL), pass: css.includes('is-rtl') },
	};
}

/** The kinds this eval measures (lib/kinds.mjs). */
const APPLIES_TO = ['pattern', 'component', 'layout'];

export default {
	id: 'R05',
	name: 'Responsiveness and Density',
	criterion: 'Enterprise requirements §2.1 density, §2.3 responsive layout',
	formula:
		'per component: 100 · passed / applicable for: breakpoint rules where it lays out, a size or density axis where the document expects one (variant classes or --osui-* padding/height/size knobs), .is-rtl rules where direction matters; mean over components',
	movable: true,
	cls: 'movable',
	present: {
		scope: 'Per component CSS: breakpoint rules where it lays out, a size or density axis where the document expects one, RTL rules where direction matters.',
		heatmap: true,
		appliesTo: APPLIES_TO,
		unmeasuredHint: 'Fix the SCSS compile error so the partial can be scored.',
		/** @param {any} row */
		cell(row) {
			const knobs = row.checks?.density?.knobs ?? [];
			return checksCell(row, knobs.length ? [`density knobs: ${knobs.join(', ')}`] : []);
		},
		/** @param {any} m */
		advice(m) {
			return [
				m.summary,
				`No density axis yet: ${list(m.raw?.densityMissing ?? [], 10)}. Knobs with defaults equal to today are additive; variant classes that change defaults are structural.`,
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
		for (const c of componentUniverse(ctx, APPLIES_TO)) {
			const { css, error } = componentCss(ctx, c);
			if (css === null) {
				if (error === NO_PARTIAL) notApplicable.push({ name: c.name, reason: error, hint: NO_PARTIAL_HINT });
				else unmeasured.push({ name: c.name, reason: error ?? 'no CSS' });
				continue;
			}
			const checks = checksFor(c.name, css);
			const score = scoreChecks(checks);
			if (score === null) {
				notApplicable.push({
					name: c.name,
					reason: 'no layout, density or directional declarations',
					hint: 'Nothing to change: the compiled CSS lays nothing out and sets no direction.',
				});
				continue;
			}
			const { failed } = describeChecks(checks, LABELS);
			perComponent.push({ name: c.name, kind: c.kind, checks, failed, score });
		}
		const density = perComponent.filter((r) => r.checks.density.applicable);
		const bp = perComponent.filter((r) => r.checks.breakpoints.applicable);
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary: `breakpoint rules in ${bp.filter((r) => r.checks.breakpoints.pass).length}/${bp.length} laying-out components; density axis in ${density.filter((r) => r.checks.density.pass).length}/${density.length} expected components`,
			raw: {
				breakpointStyled: bp.filter((r) => r.checks.breakpoints.pass).length,
				breakpointApplicable: bp.length,
				densityOffered: density.filter((r) => r.checks.density.pass).length,
				densityExpected: density.length,
				densityMissing: density.filter((r) => !r.checks.density.pass).map((r) => r.name),
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)),
			unmeasured,
			notApplicable,
		};
	},
};
