import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const TABS_DOC: PatternDocMeta = {
	name: 'Tabs',
	category: 'Navigation',
	lede: 'Switch between sibling views in place — product details, settings sections, or record sub-pages that share one screen but never need to be seen together.',
	overview:
		'Tabs is a parent block with two placeholders: Header, which holds one TabsHeaderItem per tab, and Content, which holds the matching TabsContentItem panes. Items are paired by order, so the first header controls the first pane. The runtime moves the active indicator, shows one pane at a time, syncs the ARIA tab/tabpanel relationship, and handles arrow-key navigation; on touch devices panes can also be swiped.',
	stylingSelector: '.osui-tabs',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/navigation/tabs/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/tabs/',
	liveStoryId: 'patterns-navigation-tabs--basic-usage',
	cssApiSlug: 'patterns-navigation-tabs',
	whenToUse: [
		'A record or product page whose information splits into a few peer sections (Overview, Specifications, Reviews).',
		'Settings or profile screens where each section is short enough to fit without a separate screen.',
		'Dashboards that offer alternative views of the same data (by day, by week, by month).',
	],
	whenNotToUse: [
		'Content users must compare side by side — put it in Columns or stacked Sections instead.',
		'Top-level app navigation between unrelated screens — use the Layout menu or a Bottom Bar.',
	],
	anatomy: {
		tree: `<section class="osui-tabs osui-tabs--is-horizontal"> <!-- runtime adds: --is-vertical/--is-left/--is-right, --is-justified, --has-auto-height, --has-drag -->
  <header class="osui-tabs__header">
    <div role="tablist"> <!-- Header placeholder: one TabsHeaderItem per tab -->
      <button class="osui-tabs__header-item osui-tabs--is-active" role="tab" data-tab="0" aria-selected="true">
        <!-- Title placeholder -->
      </button>
      <button class="osui-tabs__header-item" role="tab" data-tab="1" aria-selected="false">…</button>
    </div>
    <div class="osui-tabs__header__indicator" aria-hidden="true"></div>
  </header>
  <section class="osui-tabs__content">
    <!-- Content placeholder: one TabsContentItem per tab -->
    <article class="osui-tabs__content-item osui-tabs--is-active" role="tabpanel" data-tab="0">
      <!-- Content placeholder -->
    </article>
    <article class="osui-tabs__content-item" role="tabpanel" data-tab="1" aria-hidden="true">…</article>
  </section>
</section>`,
	},
	properties: [
		{
			title: 'Tabs',
			rows: [
				{
					name: 'TabsOrientation',
					type: 'Orientation',
					defaultValue: 'Horizontal',
					description:
						'Entities.Orientation.Horizontal places the headers above the content; Vertical places them beside it.',
				},
				{
					name: 'StartingTab',
					type: 'Integer',
					defaultValue: '0',
					description:
						'Zero-based index of the tab that is active when the Tabs are built (1 = second tab). Cannot be changed afterwards — use SetActiveTab.',
				},
				{
					name: 'Height',
					type: 'Text',
					defaultValue: '"auto"',
					description:
						'Height of the content area as a CSS length ("400px"). "auto" sizes it to the tallest pane.',
				},
				{
					name: 'TabsVerticalPosition',
					type: 'Direction',
					defaultValue: 'Left',
					description:
						'Side of the content where the headers sit when TabsOrientation is Vertical: Entities.Direction.Left or Right.',
				},
				{
					name: 'OptionalConfigs.ContentAutoHeight',
					type: 'Boolean',
					defaultValue: 'False',
					optional: true,
					description: 'Fit the content area to the active pane instead of the tallest one. Web apps only.',
				},
				{
					name: 'OptionalConfigs.JustifyHeaders',
					type: 'Boolean',
					defaultValue: 'False',
					optional: true,
					description: 'Distribute the header items evenly across the available width.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Tabs root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'TabsHeaderItem',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description: 'Extra CSS classes on the header item. The Title placeholder holds the tab label.',
				},
			],
		},
		{
			title: 'TabsContentItem',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description: 'Extra CSS classes on the content pane. The Content placeholder holds the pane body.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires once the Tabs instance is ready (returns TabsId).' },
		{ name: 'OnTabChange', description: 'Fires when the active tab changes, with the new ActiveTab index.' },
	],
	apiSections: [
		{
			title: 'Tabs API',
			rows: [
				{ name: 'Create', description: 'Register a new Tabs instance (before its header and content items).' },
				{ name: 'Initialize', description: 'Build the Tabs, pair headers with panes and select StartingTab.' },
				{ name: 'SetActiveTab', description: 'Switch to the tab at the given zero-based index.' },
				{ name: 'TabsToggleSwipe', description: 'Enable or disable swiping between panes on touch devices.' },
				{
					name: 'ChangeProperty',
					description:
						'Update TabsOrientation, TabsVerticalPosition, JustifyHeaders, Height or ContentAutoHeight.',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to OnChange (the OnTabChange block event).' },
				{ name: 'GetTabsById / GetAllTabs', description: 'Look up one instance or list every registered id.' },
				{ name: 'Dispose', description: 'Tear down the instance (after its items).' },
			],
		},
		{
			title: 'TabsHeaderItem API',
			rows: [
				{
					name: 'Create / Initialize',
					description: 'Register and build a header item; it joins the closest .osui-tabs parent.',
				},
				{
					name: 'DisableTabItem / EnableTabItem',
					description:
						'Set or clear the disabled state — a disabled header is skipped by keyboard navigation.',
				},
				{
					name: 'UpdateOnRender',
					description: 'Re-measure the active indicator after the platform re-renders the title.',
				},
				{ name: 'Dispose', description: 'Tear down the header item.' },
			],
		},
		{
			title: 'TabsContentItem API',
			rows: [
				{
					name: 'Create / Initialize',
					description: 'Register and build a content pane; it joins the closest .osui-tabs parent.',
				},
				{ name: 'Dispose', description: 'Tear down the content pane.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'With a header focused, ',
			React.createElement(PdKey, null, '←'),
			' / ',
			React.createElement(PdKey, null, '→'),
			' move to the previous or next enabled tab (wrapping at the ends), and ',
			React.createElement(PdKey, null, 'Home'),
			' / ',
			React.createElement(PdKey, null, 'End'),
			' jump to the first or last.'
		),
		'The runtime sets role="tablist" on the header, role="tab" with aria-selected and aria-controls on each header item, and role="tabpanel" with aria-labelledby on each pane; inactive panes are aria-hidden.',
		'Only the active header is in the tab order; focus moves with the selection so arrow keys never land on a hidden pane.',
		'Keep tab labels short, text-based, and unique — an icon-only header needs a visible label or an aria-label on its content.',
	],
	related: [
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
		{ name: 'Section Index', storyId: 'patterns-navigation-sectionindex--docs' },
		{ name: 'Wizard', storyId: 'patterns-navigation-wizard--docs' },
	],
};
