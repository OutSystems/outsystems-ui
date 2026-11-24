import type { Meta, StoryObj } from '@storybook/html-vite';
import { backgroundClass, cls, lightTextClass } from './_helpers/lowcode';
import { cfg, createAndInit, osuiRoot, Patterns, Register, renderPattern, uid } from './_helpers/osui';

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

// ─── Docs-page demos (ported from the docs stories) ─────────────────────────

type AccordionItem = { title: string; body: string };

const BASIC_FAQ: AccordionItem[] = [
	{
		title: 'How long does delivery take?',
		body: 'Standard shipping arrives in 3–5 business days. Express orders placed before 2&nbsp;p.m. ship the same day and usually arrive within 48&nbsp;hours.',
	},
	{
		title: 'What is your return policy?',
		body: 'You can return unused items within 30&nbsp;days of delivery. Start a return from your order history — a prepaid label is generated automatically and refunds are issued within 5&nbsp;business days of receipt.',
	},
	{
		title: 'Can I change my delivery address?',
		body: 'Yes, while the order is still processing. Open the order detail page and choose <strong>Change address</strong>. Once the parcel ships, contact the carrier directly using the tracking link in your confirmation email.',
	},
];

const DISABLED_ACTIONS: AccordionItem[] = [
	{
		title: 'Download annual statement',
		body: 'PDF export of your yearly billing summary, ready for accounting.',
	},
	{
		title: 'Transfer workspace ownership',
		body: 'Hand off admin rights to another member. Requires two-factor authentication.',
	},
	{
		title: 'Close account',
		body: 'Permanently delete the workspace and all associated data after a 14-day grace period.',
	},
];

type EmployeeRow = {
	initials: string;
	name: string;
	role: string;
	department: string;
	status: 'Active' | 'Inactive';
	avatarColor: string;
	details: string;
};

const EMPLOYEES: EmployeeRow[] = [
	{
		initials: 'CT',
		name: 'Carlton Turner',
		role: 'Data Analyst',
		department: 'Analytics',
		status: 'Inactive',
		avatarColor: 'violet',
		details: `
			<p>carlton.turner@example.com · +351 912 000 101</p>
			<p>Data analyst in the Analytics team. Owns monthly revenue reports and the self-service metrics catalogue.</p>
			<p>On extended leave — please contact the Analytics shared inbox for urgent requests.</p>`,
	},
	{
		initials: 'DR',
		name: 'Diana Rossi',
		role: 'Software Engineer',
		department: 'Development',
		status: 'Active',
		avatarColor: 'indigo',
		details: `
			<p>diana.rossi@example.com · +351 912 000 202</p>
			<p>Software engineer on the Payments team. Works on checkout flows for web and mobile.</p>
			<p>Reports to Sarah Mitchell · Office: San Francisco</p>`,
	},
	{
		initials: 'EC',
		name: 'Evelyn Chen',
		role: 'Project Manager',
		department: 'Management',
		status: 'Active',
		avatarColor: 'lime',
		details: `
			<p>evelyn.chen@example.com · +351 912 000 303</p>
			<p>Project manager for the Product organisation. Coordinates release planning across engineering and design.</p>
			<p>Office: Austin · Best reached before 17:00.</p>`,
	},
];

function statusTag(status: EmployeeRow['status']): string {
	const color = status === 'Active' ? 'green' : 'red';
	return `<span class="${cls('tag', 'border-radius-rounded', backgroundClass(color, true), lightTextClass(color))}">${status}</span>`;
}

function employeeTitleMarkup(employee: EmployeeRow): string {
	const avatarClass = cls('avatar', 'border-radius-circle', `background-${employee.avatarColor}`);
	return `
		<div class="sb-accordion-row">
			<div class="${avatarClass}" role="img" aria-label="user initials, ${employee.initials}">
				<span class="OSFillParent">${employee.initials}</span>
			</div>
			<span class="sb-accordion-row__name">${employee.name}</span>
			<span class="sb-accordion-row__meta">${employee.role}</span>
			<span class="sb-accordion-row__meta">${employee.department}</span>
			${statusTag(employee.status)}
		</div>`;
}

function renderItemsDoc(items: AccordionItem[], itemIds: string[], htmlTitle = false): string {
	return items
		.map((item, i) =>
			htmlTitle
				? itemMarkupHtmlTitle(itemIds[i], item.title, item.body)
				: itemMarkupDoc(itemIds[i], item.title, item.body)
		)
		.join('');
}

// Docs variant: the title text sits inside `.osui-accordion-item__title__placeholder`.
function itemMarkupDoc(id: string, title: string, body: string): string {
	return `
		<div id="${id}" data-block="osui">
			<div name="${id}" class="osui-accordion-item">
				<div class="osui-accordion-item__title" id="${id}-title">
					<div class="osui-accordion-item__icon"></div>
					<div class="osui-accordion-item__icon placeholder-empty"></div>
					<div class="osui-accordion-item__title__placeholder">
						<span>${title}</span>
					</div>
				</div>
				<div class="osui-accordion-item__content"><div id="${id}-content">${body}</div></div>
			</div>
		</div>`;
}

function itemMarkupHtmlTitle(id: string, titleHtml: string, body: string): string {
	return `
		<div id="${id}" data-block="osui">
			<div name="${id}" class="osui-accordion-item">
				<div class="osui-accordion-item__title" id="${id}-title">
					<div class="osui-accordion-item__icon"></div>
					<div class="osui-accordion-item__icon placeholder-empty"></div>
					<div class="osui-accordion-item__title__placeholder">${titleHtml}</div>
				</div>
				<div class="osui-accordion-item__content"><div id="${id}-content">${body}</div></div>
			</div>
		</div>`;
}

type ItemInitOptions = {
	icon?: 'Caret' | 'PlusMinus' | 'Custom';
	iconPosition?: 'left' | 'right';
	isDisabled?: boolean;
	startsExpanded?: boolean;
};

function itemConfig(item: ItemInitOptions): string {
	const config: Record<string, unknown> = {
		Icon: item.icon ?? 'Caret',
		IsDisabled: item.isDisabled ?? false,
		StartsExpanded: item.startsExpanded ?? false,
		ToggleWithIcon: false,
	};
	// Omit IconPosition to match Studio default (caret on the right).
	if (item.iconPosition !== undefined) {
		config.IconPosition = item.iconPosition;
	}
	return cfg(config);
}

function initAccordion(
	accId: string,
	itemIds: string[],
	register: Register,
	options: { multipleItems?: boolean; items?: ItemInitOptions[] } = {}
): void {
	const P = Patterns();
	const itemDefaults: ItemInitOptions = {
		icon: 'Caret',
		isDisabled: false,
		startsExpanded: false,
	};

	P.AccordionAPI.Create(accId, cfg({ MultipleItems: options.multipleItems ?? false }));
	itemIds.forEach((id, index) => {
		const item = { ...itemDefaults, ...options.items?.[index] };
		P.AccordionItemAPI.Create(id, itemConfig(item));
	});
	P.AccordionAPI.Initialize(accId);
	itemIds.forEach((id) => P.AccordionItemAPI.Initialize(id));
	register(() => {
		itemIds.forEach((id) => P.AccordionItemAPI.Dispose?.(id));
		P.AccordionAPI.Dispose?.(accId);
	});
}

const meta: Meta<AccordionArgs> = {
	title: 'Patterns/Content/Accordion',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		multipleItems: {
			control: 'boolean',
			name: 'Accordion.MultipleItems',
			description: 'Set to True to allow multiple Accordion items to be expanded simultaneously.',
		},
		icon: {
			control: 'select',
			options: ['Caret', 'PlusMinus', 'Custom'],
			name: 'Item.Icon',
			description:
				'Indicator icon: Caret, PlusMinus or Custom (a developer-supplied icon in the CustomIcon placeholder).',
		},
		iconPosition: {
			control: 'inline-radio',
			options: ['left', 'right'],
			name: 'Item.IconPosition',
			description: 'Side of the title where the indicator icon is rendered.',
		},
		startsExpanded: {
			control: 'boolean',
			name: 'Item.StartsExpanded',
			description: 'Renders the item already expanded when it is built.',
		},
	},
	args: { multipleItems: false, icon: 'Caret', iconPosition: 'right', startsExpanded: false },
};
export default meta;

type Story = StoryObj<AccordionArgs>;

export const Playground: Story = {
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

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Default behaviour — <code>MultipleItems</code> is False, so only one section stays open at a time.',
			},
		},
	},
	render: () => {
		const accId = uid('accordion');
		const itemIds = BASIC_FAQ.map(() => uid('accordion-item'));
		const template = `
			<div ${osuiRoot(accId)} class="osui-accordion">
				${renderItemsDoc(BASIC_FAQ, itemIds)}
			</div>`;

		return renderPattern(template, (_root, register) => {
			initAccordion(accId, itemIds, register, { multipleItems: false });
		});
	},
};

export const PlusMinusIcon: Story = {
	tags: ['docs-example'],
	name: 'Plus/minus icon',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>Icon</code> is PlusMinus — plus when collapsed, minus when expanded. <code>IconPosition</code> is <code>right</code> so the control sits on the left of the title row.',
			},
		},
	},
	render: () => {
		const accId = uid('accordion');
		const itemIds = BASIC_FAQ.map(() => uid('accordion-item'));
		const template = `
			<div ${osuiRoot(accId)} class="osui-accordion">
				${renderItemsDoc(BASIC_FAQ, itemIds)}
			</div>`;

		return renderPattern(template, (_root, register) => {
			initAccordion(accId, itemIds, register, {
				items: itemIds.map(() => ({ icon: 'PlusMinus', iconPosition: 'right' })),
			});
		});
	},
};

export const MultipleExpand: Story = {
	tags: ['docs-example'],
	name: 'Multiple expand',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>MultipleItems</code> is True — expanding one section does not collapse the others.',
			},
		},
	},
	render: () => {
		const accId = uid('accordion');
		const itemIds = BASIC_FAQ.map(() => uid('accordion-item'));
		const template = `
			<div ${osuiRoot(accId)} class="osui-accordion">
				${renderItemsDoc(BASIC_FAQ, itemIds)}
			</div>`;

		return renderPattern(template, (_root, register) => {
			initAccordion(accId, itemIds, register, {
				multipleItems: true,
				items: [{ startsExpanded: true }, { startsExpanded: true }],
			});
		});
	},
};

export const DisabledItems: Story = {
	tags: ['docs-example'],
	name: 'Disabled items',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>IsDisabled</code> is True on every item — the title row is shown but cannot be toggled.',
			},
		},
	},
	render: () => {
		const accId = uid('accordion');
		const itemIds = DISABLED_ACTIONS.map(() => uid('accordion-item'));
		const template = `
			<div ${osuiRoot(accId)} class="osui-accordion">
				${renderItemsDoc(DISABLED_ACTIONS, itemIds)}
			</div>`;

		return renderPattern(template, (_root, register) => {
			initAccordion(accId, itemIds, register, {
				items: itemIds.map(() => ({ isDisabled: true })),
			});
		});
	},
};

export const CustomTitleMarkup: Story = {
	tags: ['docs-example'],
	name: 'Custom title markup',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Custom markup in the title placeholder — compose richer header rows while content still expands below.',
			},
		},
	},
	render: () => {
		const accId = uid('accordion');
		const itemIds = EMPLOYEES.map(() => uid('accordion-item'));
		const template = `
			<div ${osuiRoot(accId)} class="osui-accordion" style="max-width: 960px;">
				${EMPLOYEES.map((employee, i) => itemMarkupHtmlTitle(itemIds[i], employeeTitleMarkup(employee), employee.details)).join(
					''
				)}
			</div>`;

		return renderPattern(template, (_root, register) => {
			initAccordion(accId, itemIds, register);
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
