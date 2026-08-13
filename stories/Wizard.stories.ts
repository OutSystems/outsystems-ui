import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Wizard family. Controls mirror the low-code input parameters of the
 * `Wizard` and `WizardItem` blocks (extracted from the library OML).
 *
 * Class mappings from src/scss/04-patterns/04-navigation/_wizard.scss:
 *
 * Wizard block:
 *   IsVertical           → `wizard-vertical` added to `.wizard-wrapper` (changes layout to
 *                           column, connectors become vertical lines)
 *   ReverseLabelPosition → `label-top` instead of `label-bottom` on every
 *                           `.wizard-wrapper-item`. Flips the label to the other side of the
 *                           marker: above it when horizontal (`flex-direction: column-reverse`),
 *                           before it when vertical (`row-reverse`, label right-aligned).
 *
 * WizardItem block:
 *   Status:
 *     Active → `active`  on `.wizard-wrapper-item` (primary border + halo, bold label)
 *     Next   → `next`    on `.wizard-wrapper-item` (neutral connector, disabled icon colour)
 *     Past   → `past`    on `.wizard-wrapper-item` (filled primary icon + connector)
 *     (none) → no status class (default upcoming state: neutral border, no fill)
 *
 * The step marker is whatever fills `.wizard-item-icon`: a number, an icon, or
 * nothing — see the `Icon and Empty (dot)` story.
 */
const meta: Meta = { title: 'Patterns/Navigation/Wizard', tags: ['!ui-pending', 'ui-reviewed'] };
export default meta;

// ─── Shared markup ────────────────────────────────────────────────────────────

/**
 * What fills `.wizard-item-icon`:
 *   number → the step index (the platform default)
 *   icon   → an `<i class="icon ph …">` glyph, sized by `--osui-wizard-icon-glyph-size`
 *   empty  → nothing, so `.wizard-item-icon:empty` collapses the 40px circle to an
 *            8px dot and `:has(.wizard-item-icon:empty)` retightens the connector
 */
type WizardMarker = 'number' | 'icon' | 'empty';

const STEPS: Array<{ status: string; label: string; icon: string }> = [
	{ status: 'past', label: 'Account', icon: 'ph-user' },
	{ status: 'active', label: 'Profile', icon: 'ph-identification-card' },
	{ status: '', label: 'Confirm', icon: 'ph-check' },
];

function markerContent(marker: WizardMarker, step: (typeof STEPS)[number], index: number): string {
	switch (marker) {
		case 'icon':
			return `<i class="icon ph ${step.icon}"></i>`;
		case 'empty':
			return '';
		default:
			return String(index + 1);
	}
}

function renderWizard(
	marker: WizardMarker,
	isVertical: boolean,
	reverseLabelPosition = false,
	extendedClass = ''
): string {
	const orientation = isVertical ? 'column' : 'row';
	const ariaOrientation = isVertical ? 'vertical' : 'horizontal';
	const labelClass = reverseLabelPosition ? 'label-top' : 'label-bottom';

	const steps = STEPS.map(
		(step, i) => `
			<div data-block="Navigation.WizardItem" style="${isVertical ? 'display:flex;flex:1;flex-direction:column;align-items:center;position:relative;width:100%;' : ''}">
				<div class="${cls('wizard-wrapper-item', step.status, labelClass, 'OSInline')}" role="tab" tabindex="0" aria-label="${step.label}">
					<div class="wizard-item-icon-wrapper OSInline"><div class="wizard-item-icon">${markerContent(marker, step, i)}</div></div>
					<div class="wizard-item-label">${step.label}</div>
				</div>
			</div>`
	).join('');

	return `
		<div class="${cls('wizard-wrapper', 'display-flex', `flex-direction-${orientation}`, isVertical && 'wizard-vertical', extendedClass)} OSInline" role="tablist" aria-orientation="${ariaOrientation}">
			<div class="list ${isVertical ? '' : 'display-flex'}">${steps}</div>
		</div>`;
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

type WizardArgs = {
	isVertical: boolean;
	reverseLabelPosition: boolean;
	extendedClass: string;
};

const isVerticalArgType = {
	name: 'IsVertical',
	control: 'boolean' as const,
	description: 'When true, sets a vertical orientation. Adds `wizard-vertical` to `.wizard-wrapper`.',
};

const reverseLabelPositionArgType = {
	name: 'ReverseLabelPosition',
	control: 'boolean' as const,
	description:
		'When true, puts the label on the other side of the marker — above it when horizontal, ' +
		'before it (right-aligned) when vertical. Swaps `label-bottom` for `label-top` on every ' +
		'`.wizard-wrapper-item`.',
};

const wizardArgs: WizardArgs = {
	isVertical: false,
	reverseLabelPosition: false,
	extendedClass: '',
};

const wizardArgTypes = {
	isVertical: isVerticalArgType,
	reverseLabelPosition: reverseLabelPositionArgType,
	extendedClass: extendedClassArgType,
};

export const WizardStory: StoryObj<WizardArgs> = {
	name: 'Wizard',
	args: wizardArgs,
	argTypes: wizardArgTypes,
	render: ({ isVertical, reverseLabelPosition, extendedClass }) =>
		renderStatic(renderWizard('number', isVertical, reverseLabelPosition, extendedClass)),
};

// ─── Marker variants ──────────────────────────────────────────────────────────

/**
 * The two non-numeric step markers, side by side.
 *
 * `Icon` fills `.wizard-item-icon` with a glyph — the 40px circle is unchanged,
 * the glyph renders at `--osui-wizard-icon-glyph-size` (20px).
 *
 * `Empty (dot)` leaves the placeholder unfilled, so `.wizard-item-icon:empty`
 * collapses the circle to an 8px dot. The connector needs no adjustment for it —
 * it runs marker-centre to marker-centre at any marker size — apart from the
 * vertical `height`, since an 8px marker no longer sets the row height.
 *
 * Both keep the Past / Active / default statuses so the connector fills stay visible.
 */
export const MarkerVariants: StoryObj<WizardArgs> = {
	name: 'Icon and Empty (dot)',
	args: wizardArgs,
	argTypes: wizardArgTypes,
	render: ({ isVertical, reverseLabelPosition, extendedClass }) => {
		const variant = (caption: string, marker: WizardMarker) => `
			<div style="flex:1;min-width:320px;">
				<div style="font-size:12px;font-weight:600;letter-spacing:0.04em;margin-bottom:16px;text-transform:uppercase;">${caption}</div>
				${renderWizard(marker, isVertical, reverseLabelPosition, extendedClass)}
			</div>`;

		return renderStatic(`
			<div style="display:flex;flex-direction:column;gap:48px;max-width:520px;">
				${variant('Icon', 'icon')}
				${variant('Empty (dot)', 'empty')}
			</div>`);
	},
};
