import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * Wizard (parent) + WizardItem (children) — the TS pattern that replaced the old
 * CSS-only `.wizard` block (ROU-125682).
 *
 * Runtime contract (from OSFramework/.../Pattern/Wizard + WizardItem):
 *  • Parent root: `.osui-wizard`, located by `name=<id>`. The pattern itself adds
 *    `is-horizontal`/`is-vertical` (IsVertical) and `is-interactive`/`is-progress-only`
 *    (StepBehavior), plus role list/tablist + aria-orientation.
 *  • Each item lives inside a `[data-block*='WizardItem']` wrapper (the SCSS flex
 *    column and the a11y roles/click target land on that wrapper — WizardItem reads
 *    it as `selfElement.parentElement`, so the wrapper must be a distinct element).
 *  • Item root: `.osui-wizard-item` (name=<id>), containing
 *      .osui-wizard-item-icon-wrapper > .osui-wizard-item-icon  (connector + circle)
 *      .osui-wizard-item-label                                   (required — read for aria-label)
 *    The pattern adds `is-past`/`is-active`/`is-next` (Status) and `is-reversed`
 *    (ReverseLabelPosition).
 *  • Call order: Create parent → Create items → Initialize parent → Initialize items.
 *    Items self-register with the parent via `.closest('.osui-wizard')` during build.
 *
 * Stays `ui-pending`: new pattern + restyle, needs UI sign-off.
 */

type WizardItemStatus = 'past' | 'active' | 'next';

interface WizardArgs {
	isVertical: boolean;
	stepBehavior: 'ProgressOnly' | 'Interactive';
	reverseLabelPosition: boolean;
	extendedClass: string;
}

const STEPS: Array<[WizardItemStatus, string, string]> = [
	['past', '1', 'Account'],
	['active', '2', 'Profile'],
	['next', '3', 'Address'],
	['next', '4', 'Confirm'],
];

// The step marker is whatever fills `.osui-wizard-item-icon`: the step number
// (above), an icon glyph, or nothing at all.
const ICON_STEPS: Array<[WizardItemStatus, string, string]> = [
	['past', '<i class="icon ph ph-user"></i>', 'Account'],
	['active', '<i class="icon ph ph-identification-card"></i>', 'Profile'],
	['next', '<i class="icon ph ph-map-pin"></i>', 'Address'],
	['next', '<i class="icon ph ph-check"></i>', 'Confirm'],
];

// An unfilled marker collapses the 40px circle to an 8px dot via
// `.osui-wizard-item-icon:empty`.
const EMPTY_STEPS: Array<[WizardItemStatus, string, string]> = STEPS.map(
	([status, , label]) => [status, '', label] as [WizardItemStatus, string, string]
);

// Wrapper carries the widgetId (id + data-block); the item carries the uniqueId
// (name) + class. The SCSS flex-item rules target `[data-block*='WizardItem']`,
// and WizardItem applies roles/click handling to that wrapper element.
function itemMarkup(id: string, glyph: string, label: string): string {
	return `
		<div id="${id}" data-block="WizardItem.WizardItem">
			<div name="${id}" class="osui-wizard-item">
				<div class="osui-wizard-item-icon-wrapper">
					<div class="osui-wizard-item-icon">${glyph}</div>
				</div>
				<div class="osui-wizard-item-label">${label}</div>
			</div>
		</div>`;
}

const meta: Meta<WizardArgs> = {
	title: 'Patterns/Navigation/Wizard',
	argTypes: {
		isVertical: { control: 'boolean', name: 'Wizard.IsVertical' },
		stepBehavior: {
			control: 'inline-radio',
			options: ['ProgressOnly', 'Interactive'],
			name: 'Wizard.StepBehavior',
			description: 'Interactive makes past steps clickable (role=tablist); ProgressOnly renders a plain list.',
		},
		reverseLabelPosition: {
			control: 'boolean',
			name: 'Item.ReverseLabelPosition',
			description: 'Places the label before the icon (`is-reversed`).',
		},
		extendedClass: extendedClassArgType,
	},
	args: { isVertical: false, stepBehavior: 'ProgressOnly', reverseLabelPosition: false, extendedClass: '' },
};
export default meta;

type Story = StoryObj<WizardArgs>;

function renderWizard(args: WizardArgs, statuses: Array<[WizardItemStatus, string, string]>): HTMLElement {
	const wizId = uid('wizard');
	const itemIds = statuses.map(() => uid('wizard-item'));
	const template = `
		<div ${osuiRoot(wizId)} class="osui-wizard">
			<div class="list">
				${statuses.map(([, glyph, label], i) => itemMarkup(itemIds[i], glyph, label)).join('')}
			</div>
		</div>`;

	return renderPattern(template, (_root, register) => {
		const P = Patterns();
		// 1. parent, 2. items
		P.WizardAPI.Create(
			wizId,
			cfg({ IsVertical: args.isVertical, StepBehavior: args.stepBehavior, ExtendedClass: args.extendedClass })
		);
		itemIds.forEach((id, i) =>
			P.WizardItemAPI.Create(id, cfg({ Status: statuses[i][0], ReverseLabelPosition: args.reverseLabelPosition }))
		);
		// 3. initialize parent, 4. initialize items
		P.WizardAPI.Initialize(wizId);
		itemIds.forEach((id) => P.WizardItemAPI.Initialize(id));
		// teardown: items before parent
		register(() => {
			itemIds.forEach((id) => P.WizardItemAPI.Dispose?.(id));
			P.WizardAPI.Dispose?.(wizId);
		});
	});
}

export const WizardStory: Story = {
	name: 'Wizard',
	render: (args) => renderWizard(args, STEPS),
};

export const Vertical: Story = {
	args: { isVertical: true },
	render: (args) => renderWizard(args, STEPS),
};

export const Interactive: Story = {
	args: { stepBehavior: 'Interactive' },
	render: (args) => renderWizard(args, STEPS),
};

export const MarkerIcon: Story = {
	name: 'Marker: icon',
	render: (args) => renderWizard(args, ICON_STEPS),
};

export const MarkerEmpty: Story = {
	name: 'Marker: empty (dot)',
	render: (args) => renderWizard(args, EMPTY_STEPS),
};
