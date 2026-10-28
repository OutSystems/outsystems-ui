import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const SIDEBAR_DOC: PatternDocMeta = {
	name: 'Sidebar',
	category: 'Navigation',
	lede: 'Off-canvas panel that slides in from the left or right edge — for filters, record details, or secondary navigation that should not push the main content around.',
	overview:
		'The Sidebar is a fixed-position panel with a Header and a Content placeholder. It is built closed (unless StartsOpen is True) and is driven from client actions through the Open, Close and Toggle APIs; while open, focus is trapped inside it and Esc closes it. With HasOverlay the page behind is dimmed and a click on the backdrop closes the panel.',
	stylingSelector: '.osui-sidebar',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/sidebar/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/sidebar/',
	liveStoryId: 'patterns-navigation-sidebar--basic-usage',
	cssApiSlug: 'patterns-navigation-sidebar',
	whenToUse: [
		'Filter or settings panels that users open, adjust, and dismiss without leaving the list behind them.',
		'Quick detail views (an order, a ticket, a profile) opened from a row or card so the context stays visible.',
		'Secondary navigation on mobile, opened from a menu button and closed by swiping or tapping the overlay.',
	],
	whenNotToUse: [
		'Short confirmations or alerts — use a Popup or a Bottom Sheet instead of a full-height panel.',
		'Persistent side navigation that should always be visible on desktop — use the Layout side menu.',
	],
	anatomy: {
		tree: `<aside class="osui-sidebar osui-sidebar--is-right" role="complementary" aria-haspopup="true" tabindex="-1">
  <!-- runtime adds: osui-sidebar--is-left | --is-right, --has-overlay, --is-open -->
  <div class="osui-sidebar__header">
    <!-- Header placeholder -->
  </div>
  <div class="osui-sidebar__content">
    <!-- Content placeholder -->
  </div>
</aside>`,
	},
	properties: [
		{
			title: 'Sidebar',
			rows: [
				{
					name: 'StartsOpen',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, the Sidebar is displayed open as soon as it is built.',
				},
				{
					name: 'Direction',
					type: 'Direction',
					defaultValue: 'Right',
					description:
						'Edge of the screen the Sidebar slides in from: Entities.Direction.Right (default) or Entities.Direction.Left.',
				},
				{
					name: 'HasOverlay',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'When True, an overlay dims the page while the Sidebar is open; clicking the overlay closes it.',
				},
				{
					name: 'Width',
					type: 'Text',
					defaultValue: '"500px"',
					description: 'Width of the panel. Accepts any CSS unit (px, %, vw), for example "30%".',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Sidebar root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires once the Sidebar instance is ready (returns SidebarId).' },
		{
			name: 'OnToggle',
			description: 'Fires every time the Sidebar opens or closes, with the new IsOpen value.',
		},
	],
	apiSections: [
		{
			title: 'Sidebar API',
			rows: [
				{ name: 'Create', description: 'Register a new Sidebar instance.' },
				{ name: 'Initialize', description: 'Build the Sidebar, its focus trap and gesture handlers.' },
				{ name: 'Open / Close', description: 'Slide the panel in or out programmatically.' },
				{ name: 'ClickOutsideToClose', description: 'Toggle whether a click outside the panel closes it.' },
				{
					name: 'ToggleGestures',
					description: 'Enable or disable the swipe-to-close gesture on touch devices.',
				},
				{
					name: 'ChangeProperty',
					description: 'Update Direction, Width, HasOverlay or StartsOpen at runtime.',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle.' },
				{
					name: 'GetSidebarById / GetAllSidebars',
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
			'While open, focus is trapped inside the panel and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes it; focus returns to the element that opened it.'
		),
		'The root carries role="complementary" and aria-haspopup="true"; the header and content get aria-hidden="true" while the panel is closed, so their links are skipped by assistive tech.',
		'Focusable elements inside the panel are taken out of the tab order while closed (tabindex="-1") and restored when it opens.',
		'Put a visible close control in the Header placeholder — on touch devices without HasOverlay, the swipe gesture is the only other way out.',
	],
	related: [
		{ name: 'Bottom Sheet', storyId: 'patterns-interaction-bottomsheet--docs' },
		{ name: 'Action Sheet', storyId: 'patterns-interaction-actionsheet--docs' },
		{ name: 'Bottom Bar', storyId: 'patterns-navigation-bottombar--docs' },
	],
};
