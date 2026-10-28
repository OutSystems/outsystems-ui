import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const ACTION_SHEET_DOC: PatternDocMeta = {
	name: 'Action Sheet',
	category: 'Interaction',
	lede: 'Slide-up menu of a few mutually exclusive actions for the item in context — the mobile answer to a context menu.',
	overview:
		'The block renders a fixed full-screen container whose backdrop fades in while the sheet slides up from the bottom edge. Each Button placeholder becomes one full-width action row; IsOpen (bound to a Boolean variable) drives the open state and OnClose fires once the sheet has closed.',
	stylingSelector: '.action-sheet',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/action_sheet/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/action_sheet/',
	liveStoryId: 'patterns-interaction-actionsheet--basic-usage',
	cssApiSlug: 'patterns-interaction-action-sheet',
	whenToUse: [
		'Three to five actions on a selected item on a phone (share, duplicate, delete).',
		'Confirming one destructive action where the choice should sit in the thumb zone.',
		'Native-looking mobile apps where a small context menu would be hard to tap.',
	],
	whenNotToUse: [
		'Desktop or dense screens — use Overflow Menu or Dropdown next to the trigger instead.',
		'Content that scrolls, forms, or more than five actions — use Bottom Sheet.',
	],
	anatomy: {
		tree: `<div class="action-sheet-container action-sheet-container--animatable"> <!-- fixed host; backdrop is its ::after -->
  <!-- + action-sheet-container--visible while IsOpen is True -->
  <div class="action-sheet">
    <div class="action-sheet-buttons">
      <div class="action-sheet-actions">
        <!-- Button1 placeholder --> <button class="btn">Share photo</button>
      </div>
      <div class="action-sheet-actions">
        <!-- Button2 placeholder -->
      </div>
      <!-- … up to Button5 -->
    </div>
    <div class="action-sheet-cancel">
      <button class="btn">Cancel</button>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Action Sheet',
			rows: [
				{
					name: 'IsOpen',
					type: 'Boolean',
					description:
						'Required. Bind a Boolean variable: True opens the sheet, False closes it. Set it back to False in the OnClose handler.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Action Sheet container. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [{ name: 'OnClose', description: 'Fires after the Action Sheet has closed.' }],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'Action rows are Button widgets, so they are reachable with ',
			React.createElement(PdKey, null, 'Tab'),
			' and activated with ',
			React.createElement(PdKey, null, 'Enter'),
			' — give each a verb label ("Delete photo"), never an icon alone.'
		),
		'Under .has-accessible-features every action and the cancel row get an inner focus ring; .os-high-contrast adds solid borders to the sheet and its rows.',
		'The library ships no JavaScript for this pattern: focus is not trapped and Esc is not handled by the CSS. Add both in the screen logic when the sheet can be opened from a keyboard.',
		'The slide-up transition only runs with the --animatable modifier; drop it (ExtendedClass) for a motion-free variant.',
	],
	related: [
		{ name: 'Bottom Sheet', storyId: 'patterns-interaction-bottomsheet--docs' },
		{ name: 'Overflow Menu', storyId: 'patterns-navigation-overflowmenu--docs' },
		{ name: 'Floating Actions', storyId: 'patterns-interaction-floatingactions--docs' },
	],
};
