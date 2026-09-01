import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
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
	extendedClass: string;
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
		startingTab: { control: { type: 'number', min: 0, max: 5 }, name: 'StartingTab' },
		justifyHeaders: { control: 'boolean', name: 'JustifyHeaders' },
		orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'], name: 'TabsOrientation' },
		verticalPosition: { control: 'inline-radio', options: ['left', 'right'], name: 'TabsVerticalPosition' },
		disabledTab: {
			control: { type: 'number', min: -1, max: 5 },
			name: 'DisabledTab (story-only, -1 = none)',
		},
		extendedClass: extendedClassArgType,
	},
	args: {
		startingTab: 0,
		justifyHeaders: false,
		orientation: 'horizontal',
		verticalPosition: 'left',
		disabledTab: DEFAULT_DISABLED_TAB,
		extendedClass: '',
	},
};
export default meta;

type Story = StoryObj<TabsArgs>;

export const Default: Story = {
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
					ExtendedClass: args.extendedClass,
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
