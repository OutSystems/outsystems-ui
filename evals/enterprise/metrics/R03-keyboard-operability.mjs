// @ts-check
/**
 * R03 · Keyboard Operability.
 *
 * For every interactive pattern, the keys its role needs and whether its TypeScript handles them
 * (`GlobalEnum.Keycodes.*` or key literals). A key handled by a family member (Tabs for its header
 * items) or by a shared feature the pattern uses (Balloon for Escape) counts; a native control in the
 * story or created in TypeScript activates on Enter/Space by itself; a provider-backed pattern is
 * credited to its library for the keys the wrapper does not handle, and flagged.
 */
import { mean, round1 } from '../../lib/score.mjs';
import {
	COMPOSITE_PATTERNS,
	includesAny,
	NON_INTERACTIVE_PATTERNS,
	OVERLAY_PATTERNS,
	patternText,
	PROVIDER_PATTERNS,
	sharedText,
} from '../lib/signals.mjs';
import { checksCell, list } from '../../lib/present.mjs';

/** Key → needles that show the key is handled. */
export const KEY_NEEDLES = {
	activate: ['Keycodes.Enter', 'Keycodes.Space', "'Enter'", "' '"],
	escape: ['Keycodes.Escape', "'Escape'"],
	arrows: ['Keycodes.ArrowDown', 'Keycodes.ArrowUp', 'Keycodes.ArrowLeft', 'Keycodes.ArrowRight', "'Arrow"],
	tab: ['Keycodes.Tab', 'Keycodes.ShiftTab', "'Tab'", 'SetElementsTabIndex', 'TabIndexTrue', 'tabindex'],
};
export const LABELS = {
	activate: 'Enter / Space activate',
	escape: 'Escape dismisses',
	arrows: 'Arrow keys move within the widget',
	tab: 'tab order managed',
};

/**
 * Keys a pattern must handle, from its role.
 * @param {string} name
 * @returns {(keyof typeof KEY_NEEDLES)[]}
 */
export function requiredKeys(name) {
	/** @type {(keyof typeof KEY_NEEDLES)[]} */
	// native controls handle Tab themselves; overlays (focus trap) and composite widgets (roving focus) must manage it
	const keys = ['activate'];
	if (OVERLAY_PATTERNS.has(name)) keys.push('escape', 'tab');
	if (COMPOSITE_PATTERNS.has(name)) keys.push('arrows', 'tab');
	return keys;
}

/** Markup that activates with Enter and Space natively (story markup or elements created in TypeScript). */
export const NATIVE_ACTIVATION = [
	'<button',
	'role="button"',
	'<a href',
	'<input',
	'<select',
	'<summary',
	"createElement('button'",
	"createElement('input'",
];

/**
 * @param {string} name
 * @param {string} ts pattern TypeScript
 * @param {string} [story] the pattern's story markup
 * @param {string} [shared] TypeScript of family members and shared features the pattern relies on
 */
export function checksFor(name, ts, story = '', shared = '') {
	const required = requiredKeys(name);
	/** @type {Record<string, { applicable: boolean, pass: boolean, via: 'pattern'|'shared'|'native'|'provider'|null }>} */
	const checks = {};
	let delegated = false;
	for (const key of Object.keys(KEY_NEEDLES)) {
		const needles = KEY_NEEDLES[/** @type {keyof typeof KEY_NEEDLES} */ (key)];
		const applicable = required.includes(/** @type {any} */ (key));
		const via = viaFor(name, key, {
			own: includesAny(ts, needles),
			shared: includesAny(shared, needles),
			native: key === 'activate' && includesAny(`${story}\n${ts}`, NATIVE_ACTIVATION),
		});
		if (via === 'provider' && applicable) delegated = true;
		checks[key] = { applicable, pass: via !== null, via };
	}
	return { checks, delegated };
}

/**
 * Who handles a key, in order of preference.
 * @param {string} name
 * @param {string} key
 * @param {{ own: boolean, shared: boolean, native: boolean }} found
 * @returns {'pattern'|'shared'|'native'|'provider'|null}
 */
function viaFor(name, key, found) {
	if (found.own) return 'pattern';
	if (found.shared) return 'shared';
	if (found.native) return 'native';
	if (PROVIDER_PATTERNS.has(name) && key !== 'tab') return 'provider';
	return null;
}

export default {
	id: 'R03',
	name: 'Keyboard Operability',
	criterion: 'Enterprise requirements §1 keyboard navigation',
	formula:
		'per interactive pattern: 100 · handled / required keys; required = Enter/Space for all (a native button, link or input in the story markup or created in TypeScript counts), Escape and tab order for overlays, Arrow keys and tab order for composite widgets; a key handled by a family member or a shared feature counts; a provider-backed pattern is credited to its library for the keys its wrapper does not handle, and flagged; mean over patterns',
	movable: true,
	cls: 'movable',
	present: {
		scope: 'Per interactive pattern: the keys its role needs (Enter/Space; Escape and tab order for overlays; Arrow keys and tab order for composite widgets). CSS-only components have no script.',
		heatmap: true,
		appliesTo: 'pattern',
		/** @param {any} row */
		cell(row) {
			return checksCell(row, row.delegated ? ['keys handled by the provider library, not the wrapper'] : []);
		},
		/** @param {any} m */
		advice(m) {
			return [
				m.summary,
				`Missing keys: ${list(m.raw?.missing ?? [], 8)}.`,
				'Key handlers are additive; overlays need Escape and a managed tab order, composite widgets need Arrow keys.',
			];
		},
	},
	/** @param {import('../../lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const perComponent = ctx.inventory.patterns
			.filter((p) => !NON_INTERACTIVE_PATTERNS.has(p.name))
			.map((p) => {
				const story = p.storyFile ? ctx.readText(p.storyFile) : '';
				const own = patternText(ctx, p);
				const { checks, delegated } = checksFor(p.name, own, story, sharedText(ctx, p, own));
				const applicable = Object.entries(checks).filter(([, c]) => c.applicable);
				const passed = applicable.filter(([, c]) => c.pass).length;
				const failed = applicable
					.filter(([, c]) => !c.pass)
					.map(([k]) => LABELS[/** @type {keyof typeof LABELS} */ (k)]);
				return {
					name: p.name,
					kind: 'pattern',
					required: applicable.map(([k]) => k),
					failed,
					delegated,
					score: round1((100 * passed) / applicable.length),
				};
			});
		const own = perComponent.filter((r) => !r.delegated && r.score === 100).length;
		const viaProvider = perComponent.filter((r) => r.delegated).length;
		return {
			score: round1(mean(perComponent.map((r) => r.score)) ?? 0),
			summary: `${own}/${perComponent.length} interactive patterns handle every required key in their own or shared code, ${viaProvider} rely on their provider for some keys, ${perComponent.filter((r) => r.score < 100).length} miss keys`,
			raw: {
				interactive: perComponent.length,
				complete: own,
				viaProvider,
				missing: perComponent.filter((r) => r.score < 100).map((r) => `${r.name}: ${r.failed.join(', ')}`),
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)),
			unmeasured: [],
			notApplicable: ctx.inventory.patterns
				.filter((p) => NON_INTERACTIVE_PATTERNS.has(p.name))
				.map((p) => ({
					name: p.name,
					reason: 'not interactive',
					hint: 'Keyboard checks apply once the pattern renders an interactive control of its own.',
				})),
		};
	},
};
