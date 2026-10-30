import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const BOTTOM_SHEET_DOC: PatternDocMeta = {
	name: 'Bottom Sheet',
	category: 'Interaction',
	lede: 'Panel that slides up from the bottom edge for a secondary task — pick an option, review details, confirm — without leaving the screen.',
	overview:
		'The runtime adds an overlay, slides the sheet in with the --is-open modifier and traps focus inside it until it closes. The TopBar placeholder is the fixed header (with the optional drag handler above it); Content scrolls when it is taller than the viewport. On touch devices the header is a drag area, so a downward swipe closes the sheet.',
	stylingSelector: '.osui-bottom-sheet',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/bottom_sheet/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/bottom_sheet/',
	liveStoryId: 'patterns-interaction-bottomsheet--basic-usage',
	cssApiSlug: 'patterns-adaptive-bottomsheet',
	whenToUse: [
		'Option pickers on mobile (delivery slot, sort order, filters) that need more than a plain list of buttons.',
		'Detail or confirmation steps that should keep the underlying screen in view.',
		'Short forms on phone where a full Popup would feel heavy.',
	],
	whenNotToUse: [
		'A handful of mutually exclusive actions on one item — Action Sheet is lighter.',
		'Persistent side panels on desktop — use Sidebar, which anchors to the left or right edge.',
	],
	anatomy: {
		tree: `<div class="osui-bottom-sheet osui-bottom-sheet--has-handler" name="<id>" aria-hidden="true" tabindex="-1">
  <!-- + osui-bottom-sheet--is-open while open; the runtime also appends a sibling .osui-bottom-sheet-overlay -->
  <div class="osui-bottom-sheet__header">
    <div class="osui-bottom-sheet__header__top-bar">
      <!-- TopBar placeholder -->
    </div>
  </div>
  <div class="osui-bottom-sheet__content">
    <!-- Content placeholder -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Bottom Sheet',
			rows: [
				{
					name: 'Shape',
					type: 'Shape',
					defaultValue: 'SoftRounded',
					description:
						'Corner shape of the top edge: SoftRounded (16px, default), Rounded or Sharp. An unknown value falls back to SoftRounded.',
				},
				{
					name: 'ShowHandler',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'Shows the drag handler bar above the header.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Bottom Sheet root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires after the Bottom Sheet instance is ready (BottomSheetId).' },
		{ name: 'OnToggle', description: 'Fires when the sheet opens or closes (BottomSheetId, IsOpen).' },
	],
	apiSections: [
		{
			title: 'Bottom Sheet API',
			rows: [
				{ name: 'Create', description: 'Register a new Bottom Sheet instance with its configs.' },
				{
					name: 'Initialize',
					description: 'Build the sheet: overlay, focus trap, gesture events on touch devices.',
				},
				{ name: 'Open / Close', description: 'Programmatically open or close the sheet.' },
				{ name: 'ChangeProperty', description: 'Update Shape or ShowHandler at runtime.' },
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle.' },
				{ name: 'GetBottomSheetItemById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllBottomSheetItemsMap', description: 'List the ids of every registered Bottom Sheet.' },
				{ name: 'Dispose', description: 'Tear down the instance, its overlay and gesture listeners.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'While open, focus is trapped inside the sheet and the sheet itself receives focus; ',
			React.createElement(PdKey, null, 'Esc'),
			' closes it, ',
			React.createElement(PdKey, { wide: true, children: 'Home' }),
			' / ',
			React.createElement(PdKey, { wide: true, children: 'End' }),
			' jump to the first / last focusable element.'
		),
		'On close, focus returns to the element that opened the sheet; the runtime toggles aria-hidden and tabindex so hidden content is skipped by assistive tech.',
		'Give the TopBar a heading so screen-reader users hear what the sheet is for as soon as focus moves in.',
		'Under .has-accessible-features the sheet gets a visible focus ring; .os-high-contrast adds a solid border to the sheet edge.',
	],
	related: [
		{ name: 'Action Sheet', storyId: 'patterns-interaction-actionsheet--docs' },
		{ name: 'Sidebar', storyId: 'patterns-navigation-sidebar--docs' },
		{ name: 'Notification', storyId: 'patterns-interaction-notification--docs' },
	],
};
