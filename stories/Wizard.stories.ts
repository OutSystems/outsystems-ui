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
 *   IsVertical   → `wizard-vertical` added to `.wizard-wrapper` (changes layout to column,
 *                   connectors become vertical lines)
 *
 * WizardItem block:
 *   Status:
 *     Active → `active`  on `.wizard-wrapper-item` (primary-coloured border + label bold)
 *     Next   → `next`    on `.wizard-wrapper-item` (neutral connector, disabled icon colour)
 *     Past   → `past`    on `.wizard-wrapper-item` (filled primary icon + connector)
 *     (none) → no status class (default upcoming state: neutral border, no fill)
 *   UseTopLabel → `label-top`    on `.wizard-wrapper-item` when true
 *                 `label-bottom` on `.wizard-wrapper-item` when false
 */
const meta: Meta = { title: 'Patterns/Navigation/Wizard', tags: ['!ui-pending', 'ui-reviewed'] };
export default meta;

// ─── WizardItem status type ───────────────────────────────────────────────────

type WizardItemStatus = 'none' | 'Active' | 'Next' | 'Past';
const WIZARD_STATUS_OPTIONS: WizardItemStatus[] = ['none', 'Active', 'Next', 'Past'];

function statusClass(status: WizardItemStatus): string {
	switch (status) {
		case 'Active':
			return 'active';
		case 'Next':
			return 'next';
		case 'Past':
			return 'past';
		default:
			return '';
	}
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

type WizardArgs = {
	isVertical: boolean;
	extendedClass: string;
};

export const WizardStory: StoryObj<WizardArgs> = {
	name: 'Wizard',
	args: {
		isVertical: false,
		extendedClass: '',
	},
	argTypes: {
		isVertical: {
			name: 'IsVertical',
			control: 'boolean',
			description: 'When true, sets a vertical orientation. Adds `wizard-vertical` to `.wizard-wrapper`.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ isVertical, extendedClass }) => {
		const orientation = isVertical ? 'column' : 'row';
		const ariaOrientation = isVertical ? 'vertical' : 'horizontal';

		const step = (state: string, n: string, label: string) => `
			<div data-block="Navigation.WizardItem" style="${isVertical ? 'display:flex;flex:1;flex-direction:column;align-items:center;position:relative;width:100%;' : ''}">
				<div class="${cls('wizard-wrapper-item', state, 'label-bottom', 'OSInline')}" role="tab" tabindex="0" aria-label="${label}">
					<div class="wizard-item-icon-wrapper OSInline"><div class="wizard-item-icon">${n}</div></div>
					<div class="wizard-item-label">${label}</div>
				</div>
			</div>`;

		return renderStatic(`
			<div class="${cls('wizard-wrapper', 'display-flex', `flex-direction-${orientation}`, isVertical && 'wizard-vertical', extendedClass)} OSInline" role="tablist" aria-orientation="${ariaOrientation}">
				<div class="list ${isVertical ? '' : 'display-flex'}">
					${step('past', '1', 'Account')}
					${step('active', '2', 'Profile')}
					${step('', '3', 'Confirm')}
				</div>
			</div>`);
	},
};

// ─── WizardItem ───────────────────────────────────────────────────────────────

type WizardItemArgs = {
	status: WizardItemStatus;
	useTopLabel: boolean;
	extendedClass: string;
};

export const WizardItemStory: StoryObj<WizardItemArgs> = {
	name: 'WizardItem',
	args: {
		status: 'Active',
		useTopLabel: false,
		extendedClass: '',
	},
	argTypes: {
		status: {
			name: 'Status',
			control: 'select',
			options: WIZARD_STATUS_OPTIONS,
			description:
				'Visual state of the wizard step. ' +
				'Active → `.active` (primary border + bold label); ' +
				'Next → `.next` (neutral connector); ' +
				'Past → `.past` (filled primary icon + connector); ' +
				'none → default upcoming appearance.',
		},
		useTopLabel: {
			name: 'UseTopLabel',
			control: 'boolean',
			description:
				'When true, places the label above the icon (`label-top`). When false, label goes below (`label-bottom`).',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ status, useTopLabel, extendedClass }) => {
		const labelClass = useTopLabel ? 'label-top' : 'label-bottom';

		return renderStatic(`
			<div class="wizard-wrapper display-flex flex-direction-row OSInline" role="tablist" aria-orientation="horizontal" style="max-width:480px;">
				<div class="list display-flex">
					<div data-block="Navigation.WizardItem" style="display:flex;flex:1;flex-direction:column;align-items:center;position:relative;width:100%;">
						<div class="wizard-wrapper-item past ${labelClass} OSInline" role="tab" tabindex="0" aria-label="Account">
							<div class="wizard-item-icon-wrapper OSInline"><div class="wizard-item-icon">1</div></div>
							<div class="wizard-item-label">Account</div>
						</div>
					</div>
					<div data-block="Navigation.WizardItem" style="display:flex;flex:1;flex-direction:column;align-items:center;position:relative;width:100%;">
						<div class="${cls('wizard-wrapper-item', statusClass(status), labelClass, 'OSInline', extendedClass)}" role="tab" tabindex="0" aria-label="Profile">
							<div class="wizard-item-icon-wrapper OSInline"><div class="wizard-item-icon">2</div></div>
							<div class="wizard-item-label">Profile</div>
						</div>
					</div>
					<div data-block="Navigation.WizardItem" style="display:flex;flex:1;flex-direction:column;align-items:center;position:relative;width:100%;">
						<div class="${cls('wizard-wrapper-item', labelClass, 'OSInline')}" role="tab" tabindex="0" aria-label="Confirm">
							<div class="wizard-item-icon-wrapper OSInline"><div class="wizard-item-icon">3</div></div>
							<div class="wizard-item-label">Confirm</div>
						</div>
					</div>
				</div>
			</div>`);
	},
};
