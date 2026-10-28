import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const OVERFLOW_MENU_DOC: PatternDocMeta = {
	name: 'Overflow Menu',
	category: 'Navigation',
	lede: 'Compact trigger (usually a three-dots icon) that opens a floating menu of secondary actions — keeps rows, cards and toolbars tidy when there is no room for every button.',
	overview:
		'The block renders a trigger button from its TriggerContent placeholder and a balloon from its Menu placeholder. The runtime wires the click and keyboard handlers, positions the balloon with Floating UI according to BalloonPosition, applies BalloonShape to its corners, closes it on outside click or Esc, and raises OnMenuToggle with the new state. Open, Close, Enable and Disable are also available through the client actions.',
	stylingSelector: '.osui-overflow-menu',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/overflow_menu/',
	liveStoryId: 'patterns-navigation-overflowmenu--basic-usage',
	cssApiSlug: 'patterns-interaction-overflowmenu',
	whenToUse: [
		'Row or card actions (edit, duplicate, delete) that would clutter a list if shown as buttons.',
		'Toolbars and headers with a long tail of rarely used options behind the two or three primary ones.',
		'Context menus that must open near their trigger and flip to stay on screen.',
	],
	whenNotToUse: [
		'Selecting a value from a list — use a Dropdown instead.',
		'The main action set of a mobile screen — use an Action Sheet or Floating Actions, which are easier to reach with the thumb.',
	],
	anatomy: {
		tree: `<div class="osui-overflow-menu"> <!-- adds .osui-overflow-menu--is-open while open -->
  <button class="osui-overflow-menu__trigger btn" type="button"
          aria-haspopup="menu" aria-expanded="false" aria-controls="<id>-balloon">
    <!-- TriggerContent placeholder (an Icon widget; pointer-events: none) -->
  </button>
  <div class="osui-overflow-menu__balloon osui-balloon" id="<id>-balloon" role="menu" aria-hidden="true">
    <!-- Menu placeholder: Link / Button widgets, optional Separator -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Overflow Menu',
			rows: [
				{
					name: 'BalloonShape',
					type: 'Shape Identifier',
					defaultValue: 'Entities.Shape.SoftRounded',
					description:
						'Corner shape of the menu: SoftRounded (default), Rounded or Sharp. The runtime writes it as --osui-overflow-menu-shape on the root.',
				},
				{
					name: 'BalloonPosition',
					type: 'FloatingPosition Identifier',
					defaultValue: 'NullIdentifier() (Auto)',
					description:
						'Preferred placement of the menu relative to its trigger — Auto, Bottom, BottomStart, BottomEnd, Top, TopStart, TopEnd, Left, Right, Center and their *Start / *End variants. Auto picks the side with the most room.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Overflow Menu root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires once the Overflow Menu instance is ready (OverflowMenuId).' },
		{
			name: 'OnMenuToggle',
			description: 'Fires every time the menu opens or closes, with IsOpen carrying the new state.',
		},
	],
	apiSections: [
		{
			title: 'Overflow Menu API',
			rows: [
				{ name: 'Create', description: 'Register a new Overflow Menu instance with its configs.' },
				{ name: 'Initialize', description: 'Build the trigger, balloon, ARIA state and handlers.' },
				{
					name: 'Open / Close',
					description: 'Open or close the menu programmatically (OnMenuToggle still fires).',
				},
				{ name: 'Enable / Disable', description: 'Allow or block the trigger from opening the menu.' },
				{ name: 'ChangeProperty', description: 'Update Position or Shape at runtime.' },
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle.' },
				{ name: 'GetOverflowMenuById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllOverflowMenus', description: 'List the ids of every registered instance.' },
				{ name: 'Dispose', description: 'Tear down the instance, its balloon and its handlers.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'The trigger is a real button: ',
			React.createElement(PdKey, { wide: true, children: 'Enter' }),
			' / ',
			React.createElement(PdKey, { wide: true, children: 'Space' }),
			' toggle it, ',
			React.createElement(PdKey, { wide: true, children: 'ArrowDown' }),
			' and ',
			React.createElement(PdKey, { wide: true, children: 'ArrowUp' }),
			' open the menu and move focus between its items, and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes it and returns focus to the trigger.'
		),
		'The runtime sets aria-haspopup="menu", aria-controls and aria-expanded on the trigger and role="menu" plus aria-hidden on the balloon, and toggles the tabindex of the menu items so they are only reachable while open.',
		'The trigger gets a default aria-label ("Trigger the balloon") — give the Icon in TriggerContent a meaningful label of your own, such as "More actions for <item>".',
		'Under .os-high-contrast the balloon gains a visible border and hovered items an outline in --color-focus-outer, so the menu stays legible without colour.',
	],
	related: [
		{ name: 'Action Sheet', storyId: 'patterns-interaction-actionsheet--docs' },
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
		{ name: 'Floating Actions', storyId: 'patterns-interaction-floatingactions--docs' },
		{ name: 'Submenu', storyId: 'patterns-navigation-submenu--docs' },
	],
};
