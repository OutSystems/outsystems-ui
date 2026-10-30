import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const SUBMENU_DOC: PatternDocMeta = {
	name: 'Submenu',
	category: 'Navigation',
	lede: 'A menu entry that expands into a panel of child links — the way to group related screens under one item of the app menu without crowding the header.',
	overview:
		'The Submenu has two placeholders: Menu (the header the user clicks) and Items (the links that drop down). The runtime toggles the panel open and closed, traps keyboard focus inside the open list, and closes it on an outside click or Esc. When a link inside points to the current screen, the platform marks both the link and the Submenu root with .active.',
	stylingSelector: '.osui-submenu',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/navigation/submenu/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/submenu/',
	liveStoryId: 'patterns-navigation-submenu--basic-usage',
	cssApiSlug: 'patterns-navigation-submenu',
	whenToUse: [
		'Grouping several related screens (Products → Analytics, Automation, Integrations) under one entry of the Layout menu.',
		'A header menu with more items than fit in one row, where second-level links can stay hidden until needed.',
		'Side-menu layouts where a section should expand in place to reveal its screens.',
	],
	whenNotToUse: [
		'A flat menu of five or fewer screens — plain Link widgets in the Menu block are simpler.',
		'Contextual actions on a record (edit, delete, share) — use an Overflow Menu or a Dropdown instead.',
	],
	anatomy: {
		tree: `<div class="osui-submenu"> <!-- runtime adds: osui-submenu--is-open, --is-hover, --is-dropdown, active -->
  <div class="osui-submenu__header" role="menuitem" aria-haspopup="true" aria-expanded="false" tabindex="0">
    <div class="osui-submenu__header__item">
      <!-- Menu placeholder -->
    </div>
    <span class="osui-submenu__header__icon"></span>
  </div>
  <div class="osui-submenu__items">
    <!-- Items placeholder: Link widgets, role="menuitem" added by the runtime -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Submenu',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Submenu root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'Runtime configs (not exposed as block parameters)',
			rows: [
				{
					name: 'OpenOnHover',
					type: 'Boolean',
					defaultValue: 'False',
					optional: true,
					description:
						'Opens the panel on pointer hover instead of click; ignored on touch devices. Set from a JavaScript node with SubmenuAPI.SubmenuOpenOnHover(SubmenuId) or ChangeProperty.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires once the Submenu instance is ready (returns SubmenuId).' },
		{ name: 'OnToggle', description: 'Fires each time the panel opens or closes, with the new IsOpened value.' },
	],
	apiSections: [
		{
			title: 'Submenu API',
			rows: [
				{ name: 'Create', description: 'Register a new Submenu instance.' },
				{ name: 'Initialize', description: 'Build the Submenu and its focus trap.' },
				{
					name: 'UpdateOnRender',
					description: 'Re-wire the header and item listeners after the platform re-renders the block.',
				},
				{ name: 'Open / Close', description: 'Expand or collapse the items panel programmatically.' },
				{ name: 'SubmenuOpenOnHover', description: 'Switch the instance to hover-to-open (ignored on touch).' },
				{ name: 'ClickOutsideToClose', description: 'Toggle whether a click outside the panel closes it.' },
				{ name: 'ChangeProperty', description: 'Update a runtime property such as OpenOnHover.' },
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle.' },
				{
					name: 'GetSubmenuById / GetAllSubmenus',
					description: 'Look up one instance or list every registered id.',
				},
				{ name: 'Dispose', description: 'Tear down the instance and release handlers.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'The header is focusable (tabindex="0") and keyboard operable: ',
			React.createElement(PdKey, null, 'Enter'),
			' toggles the panel, ',
			React.createElement(PdKey, null, '↓'),
			' / ',
			React.createElement(PdKey, null, '↑'),
			' open it and move focus to the first or last link, and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes it and returns focus to the header.'
		),
		'The runtime sets role="menuitem", aria-haspopup="true", aria-controls and aria-expanded on the header, and role="menuitem" on every link inside the Items placeholder.',
		'Links are removed from the tab order (tabindex="-1") while the panel is closed and restored when it opens, so collapsed items are never reached by Tab.',
		'A link with the CSS-only .is-disabled state keeps its tabindex — pair it with aria-disabled="true" so assistive tech reports it as unavailable.',
	],
	related: [
		{ name: 'Overflow Menu', storyId: 'patterns-navigation-overflowmenu--docs' },
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
		{ name: 'Bottom Bar', storyId: 'patterns-navigation-bottombar--docs' },
	],
};
