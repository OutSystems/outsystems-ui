import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * Tabs — parent with TabsHeaderItem + TabsContentItem children.
 * Header items live in `.osui-tabs__header` (a tablist wrapper + an
 * `.osui-tabs__header__indicator`); content items in `.osui-tabs__content`.
 * Each header/content item is itself a pattern (own id/name/data-block) and
 * carries `data-tab="<index>"`.
 */

interface TabsArgs {
	startingTab: number;
	justifyHeaders: boolean;
	orientation: 'horizontal' | 'vertical';
	verticalPosition: 'left' | 'right';
	disabledTab: number;
}

/** Index of the header item disabled by default — exercises `[disabled]` styling. */
const DEFAULT_DISABLED_TAB = 3;

const TABS = [
	['Overview', 'The Tabs pattern switches between sibling content panes.'],
	['Details', 'Each header item maps to a content item by <code>data-tab</code> index.'],
	['Activity', 'Set the starting tab and orientation via the controls.'],
	['Settings', 'Header items wrap or scroll when there are more than fit the row.'],
	['Members', 'Each pane is a separate <code>osui-tabs__content-item</code>.'],
	['Billing', 'The active indicator animates between the selected headers.'],
];

const meta: Meta<TabsArgs> = {
	title: 'Patterns/Navigation/Tabs',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		startingTab: {
			control: { type: 'number', min: 0, max: 5 },
			name: 'StartingTab',
			description: 'Zero-based index of the tab active when built.',
		},
		justifyHeaders: {
			control: 'boolean',
			name: 'OptionalConfigs.JustifyHeaders',
			description: 'Stretches the header items to fill the available width.',
		},
		orientation: {
			control: 'inline-radio',
			options: ['horizontal', 'vertical'],
			name: 'TabsOrientation',
			description: 'Horizontal (headers above the content) or Vertical (headers beside it).',
		},
		verticalPosition: {
			control: 'inline-radio',
			options: ['left', 'right'],
			name: 'TabsVerticalPosition',
			description: 'Side of the content where vertical headers sit.',
		},
		disabledTab: {
			control: { type: 'number', min: -1, max: 5 },
			name: 'DisabledTab (story-only, -1 = none)',
			description: 'Story-only: index of the TabsHeaderItem rendered disabled; -1 disables none.',
		},
	},
	args: {
		startingTab: 0,
		justifyHeaders: false,
		orientation: 'horizontal',
		verticalPosition: 'left',
		disabledTab: DEFAULT_DISABLED_TAB,
	},
};
export default meta;

type Story = StoryObj<TabsArgs>;

export const Playground: Story = {
	tags: ['docs-example'],
	render: (args) => {
		const tabsId = uid('tabs');
		const headerIds = TABS.map(() => uid('tabs-header'));
		const contentIds = TABS.map(() => uid('tabs-content'));

		// Real OUI structure: each header/content item is its own pattern wrapped in a
		// [data-block] div; the items sit in a `.display-contents` placeholder so the
		// buttons participate directly in the header's flex row (a plain block wrapper
		// breaks the layout). Header items are <button>, content items are <article>.
		const headers = TABS.map(
			(t, i) =>
				`<div id="${headerIds[i]}" data-block="osui"><button name="${headerIds[i]}" class="osui-tabs__header-item" data-tab="${i}" role="tab" type="button">${t[0]}</button></div>`
		).join('');
		const contents = TABS.map(
			(t, i) =>
				`<div id="${contentIds[i]}" data-block="osui"><article name="${contentIds[i]}" class="osui-tabs__content-item" data-tab="${i}"><div style="padding:16px;">${t[1]}</div></article></div>`
		).join('');

		const template = `
			<section ${osuiRoot(tabsId)} class="osui-tabs">
				<header class="osui-tabs__header">
					<div class="display-contents placeholder-empty">${headers}</div>
					<div class="osui-tabs__header__indicator"></div>
				</header>
				<section class="osui-tabs__content">
					<div class="display-contents placeholder-empty">${contents}</div>
				</section>
			</section>`;

		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.TabsAPI.Create(
				tabsId,
				cfg({
					StartingTab: args.startingTab,
					JustifyHeaders: args.justifyHeaders,
					TabsOrientation: args.orientation,
					TabsVerticalPosition: args.verticalPosition,
					Height: 'auto',
				})
			);
			headerIds.forEach((id) => P.TabsHeaderItemAPI.Create(id, cfg()));
			contentIds.forEach((id) => P.TabsContentItemAPI.Create(id, cfg()));
			P.TabsAPI.Initialize(tabsId);
			headerIds.forEach((id) => P.TabsHeaderItemAPI.Initialize(id));
			contentIds.forEach((id) => P.TabsContentItemAPI.Initialize(id));

			// Disabled header item — `DisableTabItem` sets the `disabled` attribute the
			// pattern styles against, and drops the item out of keyboard navigation.
			// Must run after Initialize so the child is already registered on the parent.
			if (args.disabledTab >= 0 && args.disabledTab < headerIds.length) {
				P.TabsHeaderItemAPI.DisableTabItem(headerIds[args.disabledTab]);
			}
			register(() => {
				headerIds.forEach((id) => P.TabsHeaderItemAPI.Dispose?.(id));
				contentIds.forEach((id) => P.TabsContentItemAPI.Dispose?.(id));
				P.TabsAPI.Dispose?.(tabsId);
			});
		});
	},
};

const labelStyle = 'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';

interface TabsCell {
	labels: string[];
	bodies: string[];
	startingTab?: number;
	justifyHeaders?: boolean;
	orientation?: 'horizontal' | 'vertical';
	verticalPosition?: 'left' | 'right';
	disabledTab?: number;
	hoverTab?: number;
	width?: string;
}

function tabsMarkup(tabsId: string, headerIds: string[], contentIds: string[], cell: TabsCell): string {
	const headers = cell.labels
		.map((label, i) => {
			const pseudo = cell.hoverTab === i ? ' data-pseudo="tabs-hover"' : '';
			return `<div id="${headerIds[i]}" data-block="osui"><button name="${headerIds[i]}" class="osui-tabs__header-item" data-tab="${i}" role="tab" type="button"${pseudo}>${label}</button></div>`;
		})
		.join('');
	const contents = cell.bodies
		.map(
			(body, i) =>
				`<div id="${contentIds[i]}" data-block="osui"><article name="${contentIds[i]}" class="osui-tabs__content-item" data-tab="${i}"><div style="padding:16px;">${body}</div></article></div>`
		)
		.join('');
	const width = cell.width ? ` style="width:${cell.width};"` : '';
	return `
		<section ${osuiRoot(tabsId)} class="osui-tabs"${width}>
			<header class="osui-tabs__header">
				<div class="display-contents placeholder-empty">${headers}</div>
				<div class="osui-tabs__header__indicator"></div>
			</header>
			<section class="osui-tabs__content">
				<div class="display-contents placeholder-empty">${contents}</div>
			</section>
		</section>`;
}

function initTabs(
	tabsId: string,
	headerIds: string[],
	contentIds: string[],
	cell: TabsCell,
	register: (dispose: () => void) => void
): void {
	const P = Patterns();
	P.TabsAPI.Create(
		tabsId,
		cfg({
			StartingTab: cell.startingTab ?? 0,
			JustifyHeaders: cell.justifyHeaders ?? false,
			TabsOrientation: cell.orientation ?? 'horizontal',
			TabsVerticalPosition: cell.verticalPosition ?? 'left',
			Height: 'auto',
		})
	);
	headerIds.forEach((id) => P.TabsHeaderItemAPI.Create(id, cfg()));
	contentIds.forEach((id) => P.TabsContentItemAPI.Create(id, cfg()));
	// Children register during their own build. The parent picks StartingTab in that
	// same build, so the children have to be initialized first or the index falls back to 0.
	headerIds.forEach((id) => P.TabsHeaderItemAPI.Initialize(id));
	contentIds.forEach((id) => P.TabsContentItemAPI.Initialize(id));
	P.TabsAPI.Initialize(tabsId);
	// Justify and vertical position are deferred with a timeout. Set them now so the
	// gallery does not paint the unset values.
	P.TabsAPI.ChangeProperty(tabsId, 'JustifyHeaders', cell.justifyHeaders ?? false);
	P.TabsAPI.ChangeProperty(tabsId, 'TabsVerticalPosition', cell.verticalPosition ?? 'left');
	P.TabsHeaderItemAPI.UpdateOnRender(headerIds[cell.startingTab ?? 0]);
	if (cell.disabledTab !== undefined && cell.disabledTab >= 0 && cell.disabledTab < headerIds.length) {
		P.TabsHeaderItemAPI.DisableTabItem(headerIds[cell.disabledTab]);
	}
	register(() => {
		headerIds.forEach((id) => P.TabsHeaderItemAPI.Dispose?.(id));
		contentIds.forEach((id) => P.TabsContentItemAPI.Dispose?.(id));
		P.TabsAPI.Dispose?.(tabsId);
	});
}

function renderGallery(entries: Array<{ label: string; cell: TabsCell }>) {
	const instances = entries.map((entry) => ({
		...entry,
		tabsId: uid('tabs'),
		headerIds: entry.cell.labels.map(() => uid('tabs-header')),
		contentIds: entry.cell.labels.map(() => uid('tabs-content')),
	}));
	const board = document.createElement('div');
	board.style.cssText = 'align-items:flex-start;display:flex;flex-direction:column;gap:32px;';
	for (const instance of instances) {
		const item = document.createElement('div');
		const label = document.createElement('div');
		label.textContent = instance.label;
		label.style.cssText = labelStyle;
		item.append(label);
		item.insertAdjacentHTML(
			'beforeend',
			tabsMarkup(instance.tabsId, instance.headerIds, instance.contentIds, instance.cell)
		);
		board.append(item);
	}
	return renderPattern(board.outerHTML, (_root, register) => {
		for (const instance of instances) {
			initTabs(instance.tabsId, instance.headerIds, instance.contentIds, instance.cell, register);
		}
	});
}

const SAMPLE = {
	labels: ['Overview', 'Details', 'Activity'],
	bodies: ['Overview pane.', 'Details pane.', 'Activity pane.'],
	width: '520px',
};

/** Headers packed to the start, then stretched to fill the row. */
export const JustifyHeaders: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderGallery([
			{ label: 'Off', cell: { ...SAMPLE, justifyHeaders: false } },
			{ label: 'Justified', cell: { ...SAMPLE, justifyHeaders: true } },
		]),
};

/** Headers above the content, then beside it. */
export const Orientation: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderGallery([
			{ label: 'Horizontal', cell: { ...SAMPLE, orientation: 'horizontal' } },
			{ label: 'Vertical', cell: { ...SAMPLE, orientation: 'vertical', verticalPosition: 'left' } },
		]),
};

/** Vertical headers on the left of the content, then on the right. */
export const VerticalPosition: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderGallery([
			{ label: 'Left', cell: { ...SAMPLE, orientation: 'vertical', verticalPosition: 'left' } },
			{ label: 'Right', cell: { ...SAMPLE, orientation: 'vertical', verticalPosition: 'right' } },
		]),
};

/**
 * Resting, hovered, selected, and disabled header items on one tab list.
 * Hover is forced: a static gallery cannot hold a pointer.
 */
export const States: Story = {
	parameters: {
		controls: { disable: true },
		pseudo: { hover: ['[data-pseudo="tabs-hover"]'] },
	},
	render: () => {
		const style = document.createElement('style');
		style.textContent = `
			.osui-tabs [data-pseudo="tabs-hover"] {
				background-color: var(--osui-tabs-header-item-hover-background);
				color: var(--osui-tabs-header-item-color-hover);
			}`;
		const gallery = renderGallery([
			{
				label: 'Header states',
				cell: {
					labels: ['Default', 'Hover', 'Active', 'Disabled'],
					bodies: ['Resting tab.', 'Hovered tab.', 'Selected tab.', 'Disabled tab.'],
					startingTab: 2,
					hoverTab: 1,
					disabledTab: 3,
					width: '520px',
				},
			},
		]);
		gallery.prepend(style);
		return gallery;
	},
};
