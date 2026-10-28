import type { Meta, StoryObj } from '@storybook/html-vite';
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
		isVertical: {
			control: 'boolean',
			name: 'Wizard.IsVertical',
			description: 'Set the orientation: stacks the steps vertically.',
		},
		stepBehavior: {
			control: 'inline-radio',
			options: ['ProgressOnly', 'Interactive'],
			name: 'Wizard.StepsBehaviour',
			description: 'Interactive makes past steps clickable (role=tablist); ProgressOnly renders a plain list.',
		},
		reverseLabelPosition: {
			control: 'boolean',
			name: 'Item.ReverseLabelPosition',
			description: 'Places the label before the icon (`is-reversed`).',
		},
	},
	args: { isVertical: false, stepBehavior: 'ProgressOnly', reverseLabelPosition: false },
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
		P.WizardAPI.Create(wizId, cfg({ IsVertical: args.isVertical, StepBehavior: args.stepBehavior }));
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

export const Playground: Story = {
	render: (args) => renderWizard(args, STEPS),
};

// ─── Docs examples ───────────────────────────────────────────────────────────

/** Block defaults: horizontal, `StepsBehaviour` = Interactive (past steps clickable), numbered markers. */
export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Default Wizard: horizontal steps with `StepsBehaviour` = Interactive, so the completed (Past) step is clickable and the Active step is announced as selected.',
			},
		},
	},
	render: () => renderWizard({ isVertical: false, stepBehavior: 'Interactive', reverseLabelPosition: false }, STEPS),
};

export const Vertical: Story = {
	tags: ['docs-example'],
	name: 'Vertical',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '`IsVertical` = True stacks the steps top to bottom with the connector running down the markers.',
			},
		},
	},
	args: { isVertical: true },
	render: (args) => renderWizard(args, STEPS),
};

export const MarkerIcon: Story = {
	tags: ['docs-example'],
	name: 'Marker: icon',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'An Icon widget in each Wizard Item Icon placeholder replaces the step number inside the marker.',
			},
		},
	},
	render: (args) => renderWizard(args, ICON_STEPS),
};

export const MarkerEmpty: Story = {
	tags: ['docs-example'],
	name: 'Marker: empty (dot)',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'An empty Icon placeholder collapses the marker to a small dot, keeping only the status colours and the connector.',
			},
		},
	},
	render: (args) => renderWizard(args, EMPTY_STEPS),
};

export const Interactive: Story = {
	args: { stepBehavior: 'Interactive' },
	render: (args) => renderWizard(args, STEPS),
};

/** Label under the marker, then above it (`ReverseLabelPosition`). */
export const ReverseLabel: Story = {
	name: 'Reverse label',
	parameters: { controls: { disable: true } },
	render: () => {
		const rows = [
			{ label: 'Default', reverse: false },
			{ label: 'Reversed', reverse: true },
		] as const;
		const instances = rows.map((row) => ({
			...row,
			wizId: uid('wizard'),
			itemIds: STEPS.map(() => uid('wizard-item')),
		}));
		const board = document.createElement('div');
		board.style.cssText = 'display:flex;flex-direction:column;gap:32px;';
		for (const instance of instances) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = instance.label;
			label.style.cssText =
				'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';
			item.append(label);
			item.insertAdjacentHTML(
				'beforeend',
				`<div ${osuiRoot(instance.wizId)} class="osui-wizard"><div class="list">${instance.itemIds
					.map((id, i) => itemMarkup(id, STEPS[i][1], STEPS[i][2]))
					.join('')}</div></div>`
			);
			board.append(item);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			const P = Patterns();
			for (const instance of instances) {
				P.WizardAPI.Create(instance.wizId, cfg({ IsVertical: false, StepBehavior: 'ProgressOnly' }));
				instance.itemIds.forEach((id, i) =>
					P.WizardItemAPI.Create(id, cfg({ Status: STEPS[i][0], ReverseLabelPosition: instance.reverse }))
				);
				P.WizardAPI.Initialize(instance.wizId);
				instance.itemIds.forEach((id) => P.WizardItemAPI.Initialize(id));
				register(() => {
					instance.itemIds.forEach((id) => P.WizardItemAPI.Dispose?.(id));
					P.WizardAPI.Dispose?.(instance.wizId);
				});
			}
		});
	},
};
