import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, createAndInit, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * Accordion (parent) + AccordionItem (children).
 *
 * Runtime contract (from OSFramework/.../Pattern/Accordion + AccordionItem):
 *  • Parent root: `.osui-accordion`, located by `name=<id>`.
 *  • Each item root located by `name=<id>` and must contain:
 *      .osui-accordion-item__title  (with a .osui-accordion-item__icon and a
 *                                    .osui-accordion-item__icon.osui-placeholder-empty)
 *      .osui-accordion-item__content (whose firstChild is the content placeholder)
 *  • Call order: Create parent → Create items → Initialize parent → Initialize items.
 *    Items self-register with the parent via `.closest('.osui-accordion')` during Create.
 */

interface AccordionArgs {
	multipleItems: boolean;
	icon: 'Caret' | 'PlusMinus' | 'Custom';
	iconPosition: 'left' | 'right';
	startsExpanded: boolean;
}

const FAQ: Array<[string, string]> = [
	['What is OutSystems UI?', 'A component library of TypeScript behaviours and CSS used by OutSystems apps.'],
	['How does theming work?', 'Through design tokens — CSS custom properties overridden at <code>:root</code>.'],
	['Is it accessible?', 'Yes. Patterns ship ARIA roles, keyboard support and focus management.'],
];

// Each item is wrapped in its [data-block] container (the real OUI structure):
//   .osui-accordion > div[data-block] > .osui-accordion-item
// The wrapper carries the widgetId (id + data-block); the item carries the
// uniqueId (name) + class. The accordion's divider CSS targets
// `:not(:first-child) > .osui-accordion-item` (border-top between items), so the
// wrapper must be a real element — collapsing it onto the item kills the dividers.
function itemMarkup(id: string, title: string, body: string, customIcon = ''): string {
	return `
		<div id="${id}" data-block="osui">
			<div name="${id}" class="osui-accordion-item">
				<div class="osui-accordion-item__title" id="${id}-title">
					<div class="osui-accordion-item__title__placeholder">${title}</div>
					<div class="osui-accordion-item__icon"></div>
					<div class="osui-accordion-item__icon placeholder-empty">${customIcon}</div>
				</div>
				<div class="osui-accordion-item__content"><div id="${id}-content">${body}</div></div>
			</div>
		</div>`;
}

const meta: Meta<AccordionArgs> = {
	title: 'Patterns/Content/Accordion',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		multipleItems: { control: 'boolean', name: 'Accordion.MultipleItems' },
		icon: { control: 'select', options: ['Caret', 'PlusMinus', 'Custom'], name: 'Item.Icon' },
		iconPosition: { control: 'inline-radio', options: ['left', 'right'], name: 'Item.IconPosition' },
		startsExpanded: { control: 'boolean', name: 'Item.StartsExpanded' },
	},
	args: { multipleItems: false, icon: 'Caret', iconPosition: 'right', startsExpanded: false },
};
export default meta;

type Story = StoryObj<AccordionArgs>;

export const Default: Story = {
	render: (args) => {
		const accId = uid('accordion');
		const itemIds = FAQ.map(() => uid('accordion-item'));
		const template = `
			<div ${osuiRoot(accId)} class="osui-accordion">
				${FAQ.map(([t, b], i) => itemMarkup(itemIds[i], t, b)).join('')}
			</div>`;

		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			// 1. parent, 2. items
			P.AccordionAPI.Create(accId, cfg({ MultipleItems: args.multipleItems }));
			const itemConfig = cfg({
				Icon: args.icon,
				IconPosition: args.iconPosition,
				IsDisabled: false,
				StartsExpanded: args.startsExpanded,
				ToggleWithIcon: false,
			});
			itemIds.forEach((id) => P.AccordionItemAPI.Create(id, itemConfig));
			// 3. initialize parent, 4. initialize items
			P.AccordionAPI.Initialize(accId);
			itemIds.forEach((id) => P.AccordionItemAPI.Initialize(id));
			// teardown: items before parent
			register(() => {
				itemIds.forEach((id) => P.AccordionItemAPI.Dispose?.(id));
				P.AccordionAPI.Dispose?.(accId);
			});
		});
	},
};

export const SingleDisabledItem: Story = {
	args: { startsExpanded: true },
	render: (args) => {
		const id = uid('accordion-item');
		const template = `
			<div class="osui-accordion">
				${itemMarkup(id, 'Standalone item (disabled)', 'AccordionItem also works without a parent Accordion.')}
			</div>`;
		return renderPattern(template, (_root, register) =>
			createAndInit(
				'AccordionItemAPI',
				id,
				{
					Icon: args.icon,
					IconPosition: args.iconPosition,
					IsDisabled: true,
					StartsExpanded: args.startsExpanded,
					ToggleWithIcon: false,
				},
				register
			)
		);
	},
};

const labelStyle = 'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';

function renderItems(entries: Array<{ label: string; icon: string; iconPosition: string; customIcon?: string }>) {
	const board = document.createElement('div');
	board.style.cssText = 'align-items:flex-start;display:flex;flex-direction:column;gap:24px;';
	const pending: Array<(register: (dispose: () => void) => void) => void> = [];
	for (const entry of entries) {
		const accId = uid('accordion');
		const itemId = uid('accordion-item');
		const item = document.createElement('div');
		const label = document.createElement('div');
		label.textContent = entry.label;
		label.style.cssText = labelStyle;
		item.append(label);
		item.insertAdjacentHTML(
			'beforeend',
			`<div ${osuiRoot(accId)} class="osui-accordion" style="width:420px;">${itemMarkup(itemId, 'Section', 'Item content.', entry.customIcon ?? '')}</div>`
		);
		board.append(item);
		pending.push((register) => {
			const P = Patterns();
			P.AccordionAPI.Create(accId, cfg({ MultipleItems: false }));
			P.AccordionItemAPI.Create(
				itemId,
				cfg({
					Icon: entry.icon,
					IconPosition: entry.iconPosition,
					IsDisabled: false,
					StartsExpanded: false,
					ToggleWithIcon: false,
				})
			);
			P.AccordionAPI.Initialize(accId);
			P.AccordionItemAPI.Initialize(itemId);
			register(() => {
				P.AccordionItemAPI.Dispose?.(itemId);
				P.AccordionAPI.Dispose?.(accId);
			});
		});
	}
	return renderPattern(board.outerHTML, (_root, register) => {
		for (const start of pending) start(register);
	});
}

/** Caret, plus/minus, and a developer-supplied icon in the custom placeholder. */
export const Icons: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderItems([
			{ label: 'Caret', icon: 'Caret', iconPosition: 'right' },
			{ label: 'PlusMinus', icon: 'PlusMinus', iconPosition: 'right' },
			{
				label: 'Custom',
				icon: 'Custom',
				iconPosition: 'right',
				customIcon: '<i class="icon ph ph-star" aria-hidden="true"></i>',
			},
		]),
};

/** `right` (the platform default) keeps the icon at the end of the title. `left` reverses the row, placing it at the start. */
export const IconPosition: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderItems([
			{ label: 'Right', icon: 'Caret', iconPosition: 'right' },
			{ label: 'Left', icon: 'Caret', iconPosition: 'left' },
		]),
};
