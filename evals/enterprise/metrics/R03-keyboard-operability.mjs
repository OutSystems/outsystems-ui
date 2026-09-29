// @ts-check
/**
 * R03 · Keyboard Operability.
 *
 * For every interactive pattern, the keys its role needs and whether its TypeScript handles them
 * (`GlobalEnum.Keycodes.*` or key literals). Provider-backed patterns whose wrapper handles no key
 * are credited to the provider library and marked as such, since the library ships the handlers.
 */
import { mean, round1 } from '../../ai-friendliness/lib/score.mjs';
import {
	COMPOSITE_PATTERNS,
	includesAny,
	NON_INTERACTIVE_PATTERNS,
	OVERLAY_PATTERNS,
	patternText,
	PROVIDER_PATTERNS,
} from '../lib/signals.mjs';

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

/** Markup that activates with Enter and Space natively. */
export const NATIVE_ACTIVATION = ['<button', 'role="button"', '<a href', '<input', '<select', '<summary'];

/**
 * @param {string} name
 * @param {string} ts pattern TypeScript
 * @param {string} [story] the pattern's story markup; native buttons handle Enter/Space themselves
 */
export function checksFor(name, ts, story = '') {
	const required = requiredKeys(name);
	/** @type {Record<string, { applicable: boolean, pass: boolean, via: 'pattern'|'provider'|null }>} */
	const checks = {};
	const handlesAny = Object.values(KEY_NEEDLES).some((needles) => includesAny(ts, needles));
	const delegated = PROVIDER_PATTERNS.has(name) && !handlesAny;
	for (const key of Object.keys(KEY_NEEDLES)) {
		const applicable = required.includes(/** @type {any} */ (key));
		const own = includesAny(ts, KEY_NEEDLES[/** @type {keyof typeof KEY_NEEDLES} */ (key)]);
		const native = key === 'activate' && includesAny(story, NATIVE_ACTIVATION);
		let via = null;
		if (own) via = 'pattern';
		else if (native) via = 'native';
		else if (delegated) via = 'provider';
		checks[key] = { applicable, pass: own || native || delegated, via };
	}
	return { checks, delegated };
}

export default {
	id: 'R03',
	name: 'Keyboard Operability',
	criterion: 'Enterprise requirements §1 keyboard navigation',
	formula:
		'per interactive pattern: 100 · handled / required keys; required = Enter/Space for all (a native button, link or input in the story markup counts), Escape and tab order for overlays, Arrow keys and tab order for composite widgets; a provider-backed pattern with no handler of its own is credited to the provider and flagged; mean over patterns',
	movable: true,
	cls: 'movable',
	/** @param {import('../../ai-friendliness/lib/context.mjs').EvalContext} ctx */
	compute(ctx) {
		const perComponent = ctx.inventory.patterns
			.filter((p) => !NON_INTERACTIVE_PATTERNS.has(p.name))
			.map((p) => {
				const story = p.storyFile ? ctx.readText(p.storyFile) : '';
				const { checks, delegated } = checksFor(p.name, patternText(ctx, p), story);
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
			summary: `${own}/${perComponent.length} interactive patterns handle every required key themselves, ${viaProvider} rely on their provider, ${perComponent.filter((r) => r.score < 100 && !r.delegated).length} miss keys`,
			raw: {
				interactive: perComponent.length,
				complete: own,
				viaProvider,
				missing: perComponent.filter((r) => r.score < 100).map((r) => `${r.name}: ${r.failed.join(', ')}`),
			},
			perComponent: [...perComponent].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name)),
			unmeasured: ctx.inventory.patterns
				.filter((p) => NON_INTERACTIVE_PATTERNS.has(p.name))
				.map((p) => ({ name: p.name, reason: 'not interactive' })),
		};
	},
};
