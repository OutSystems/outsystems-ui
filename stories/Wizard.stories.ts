import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Wizard family. Controls mirror the low-code input parameters of the
 * `Wizard` and `WizardItem` blocks (extracted from the library OML).
 *
 * Class mappings from src/scss/04-patterns/02-content/wizard/_wizard.scss and
 * .../wizard-item/_wizard-item.scss (merged from dev's Wizard redesign):
 *
 * Wizard block:
 *   IsVertical → `is-vertical`/`is-horizontal` on `.osui-wizard` (layout direction;
 *                connectors become vertical lines when vertical)
 *   StepBehavior → `is-interactive` on `.osui-wizard` when `Interactive` (past steps
 *                  become clickable)
 *
 * WizardItem block:
 *   Status:
 *     Active → `is-active` on `.osui-wizard-item` (primary-coloured icon + bold label)
 *     Next   → `is-next`   on `.osui-wizard-item` (neutral connector, disabled icon colour)
 *     Past   → `is-past`   on `.osui-wizard-item` (filled primary icon + connector)
 *     (none) → no status class (default upcoming state: neutral border, no fill)
 *   ReverseLabelPosition → `is-reversed` on `.osui-wizard-item` when true
 */
const meta: Meta = { title: 'Patterns/Content/Wizard', tags: ['!ui-pending', 'ui-reviewed'] };
export default meta;

// ─── WizardItem status type ───────────────────────────────────────────────────

type WizardItemStatus = 'none' | 'Active' | 'Next' | 'Past';
const WIZARD_STATUS_OPTIONS: WizardItemStatus[] = ['none', 'Active', 'Next', 'Past'];

function statusClass(status: WizardItemStatus): string {
	switch (status) {
		case 'Active':
			return 'is-active';
		case 'Next':
			return 'is-next';
		case 'Past':
			return 'is-past';
		default:
			return '';
	}
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

type WizardArgs = {
	isVertical: boolean;
	isInteractive: boolean;
	extendedClass: string;
};

export const WizardStory: StoryObj<WizardArgs> = {
	name: 'Wizard',
	args: {
		isVertical: false,
		isInteractive: false,
		extendedClass: '',
	},
	argTypes: {
		isVertical: {
			name: 'IsVertical',
			control: 'boolean',
			description: 'When true, sets a vertical orientation. Adds `is-vertical` to `.osui-wizard`.',
		},
		isInteractive: {
			name: 'StepBehavior',
			control: 'boolean',
			description: 'When true (Interactive), adds `is-interactive` to `.osui-wizard` - past steps become clickable.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ isVertical, isInteractive, extendedClass }) => {
		const orientation = isVertical ? 'is-vertical' : 'is-horizontal';

		const step = (state: string, n: string, label: string) => `
			<div data-block="Content.WizardItem">
				<div class="${cls('osui-wizard-item', state, 'OSInline')}" role="tab" tabindex="0" aria-label="${label}">
					<div class="osui-wizard-item-icon-wrapper OSInline"><div class="osui-wizard-item-icon">${n}</div></div>
					<div class="osui-wizard-item-label">${label}</div>
				</div>
			</div>`;

		return renderStatic(`
			<div class="${cls('osui-wizard', orientation, isInteractive && 'is-interactive', extendedClass)} OSInline" role="tablist">
				<div class="list">
					${step('is-past', '1', 'Account')}
					${step('is-active', '2', 'Profile')}
					${step('', '3', 'Confirm')}
				</div>
			</div>`);
	},
};

// ─── WizardItem ───────────────────────────────────────────────────────────────

type WizardItemArgs = {
	status: WizardItemStatus;
	reverseLabelPosition: boolean;
	extendedClass: string;
};

export const WizardItemStory: StoryObj<WizardItemArgs> = {
	name: 'WizardItem',
	args: {
		status: 'Active',
		reverseLabelPosition: false,
		extendedClass: '',
	},
	argTypes: {
		status: {
			name: 'Status',
			control: 'select',
			options: WIZARD_STATUS_OPTIONS,
			description:
				'Visual state of the wizard step. ' +
				'Active → `.is-active` (primary icon + bold label); ' +
				'Next → `.is-next` (neutral connector); ' +
				'Past → `.is-past` (filled primary icon + connector); ' +
				'none → default upcoming appearance.',
		},
		reverseLabelPosition: {
			name: 'ReverseLabelPosition',
			control: 'boolean',
			description: 'When true, adds `is-reversed` to `.osui-wizard-item` (reverses label/icon order).',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ status, reverseLabelPosition, extendedClass }) => {
		const reversedClass = reverseLabelPosition ? 'is-reversed' : '';

		return renderStatic(`
			<div class="osui-wizard is-vertical OSInline" role="tablist" style="max-width:320px;">
				<div class="list">
					<div data-block="Content.WizardItem">
						<div class="osui-wizard-item is-past ${reversedClass} OSInline" role="tab" tabindex="0" aria-label="Account">
							<div class="osui-wizard-item-icon-wrapper OSInline"><div class="osui-wizard-item-icon">1</div></div>
							<div class="osui-wizard-item-label">Account</div>
						</div>
					</div>
					<div data-block="Content.WizardItem">
						<div class="${cls('osui-wizard-item', statusClass(status), reversedClass, 'OSInline', extendedClass)}" role="tab" tabindex="0" aria-label="Profile">
							<div class="osui-wizard-item-icon-wrapper OSInline"><div class="osui-wizard-item-icon">2</div></div>
							<div class="osui-wizard-item-label">Profile</div>
						</div>
					</div>
					<div data-block="Content.WizardItem">
						<div class="osui-wizard-item ${reversedClass} OSInline" role="tab" tabindex="0" aria-label="Confirm">
							<div class="osui-wizard-item-icon-wrapper OSInline"><div class="osui-wizard-item-icon">3</div></div>
							<div class="osui-wizard-item-label">Confirm</div>
						</div>
					</div>
				</div>
			</div>`);
	},
};
