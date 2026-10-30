import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const FLOATING_ACTIONS_DOC: PatternDocMeta = {
	name: 'Floating Actions',
	category: 'Interaction',
	lede: 'Floating action button pinned to the bottom-right corner that fans out a short stack of labelled secondary actions.',
	overview:
		'Floating Actions is the parent: its Button placeholder is the main round button and its Items placeholder holds one Floating Actions Item per action (a Label plus an Item icon). The block toggles the .is--open state on click — or on hover with IsHover — staggering each item in from the bottom; on tablet and phone an overlay dims the screen behind the open stack.',
	stylingSelector: '.floating-actions-wrapper',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/floating_actions/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/floating_actions/',
	liveStoryId: 'patterns-interaction-floatingactions--basic-usage',
	cssApiSlug: 'patterns-interaction-floating-actions',
	whenToUse: [
		'One primary "create" action per screen with two to four related shortcuts (new message, add contact, schedule).',
		'Mobile screens where the primary action must stay reachable while the content scrolls.',
		'Apps that follow a native, thumb-first layout.',
	],
	whenNotToUse: [
		'Actions on a specific item in a list — use Action Sheet or Overflow Menu next to the item.',
		'More than four actions or actions that need text input — use Bottom Sheet.',
	],
	anatomy: {
		tree: `<div class="floating-overlay"></div> <!-- dims the screen on tablet/phone; .desktop hides it -->
<div class="floating-actions-wrapper"> <!-- + is--open on both wrapper and overlay -->
  <div class="floating-items" aria-hidden="true"> <!-- Items placeholder -->
    <div class="floating-actions-item" style="--delay: 1"> <!-- one Floating Actions Item -->
      <span class="floating-actions-item-label"><!-- Label placeholder --></span>
      <div class="floating-actions-item-button" role="button" tabindex="0">
        <!-- Item placeholder --> <i class="icon ph ph-envelope"></i>
      </div>
    </div>
  </div>
  <div class="floating-button" role="button" tabindex="0" aria-expanded="false">
    <!-- Button placeholder --> <i class="icon ph ph-plus"></i>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Floating Actions',
			rows: [
				{
					name: 'IsExpanded',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'Initial state of the stack: True renders the items already fanned out.',
				},
				{
					name: 'IsHover',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'True opens the stack on pointer hover instead of on click.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Floating Actions wrapper. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'Floating Actions Item',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description: 'Extra CSS classes on the item root.',
				},
			],
		},
	],
	events: [{ name: 'OnToggle', description: 'Fires after the stack opens or closes.' }],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'The main button and every item button carry role="button" and tabindex="0", so they take focus in order; ',
			React.createElement(PdKey, null, 'Enter'),
			' / ',
			React.createElement(PdKey, { wide: true, children: 'Space' }),
			' toggle the stack and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes it.'
		),
		'The main button exposes aria-expanded and the items container is aria-hidden while collapsed, so assistive tech only announces actions that can be activated.',
		'Keep the Label placeholder filled — the icon alone is not an accessible name — and give the main button an aria-label such as "Create".',
		'Under .has-accessible-features the main button shows a focus ring in both states; the fan-out animation is driven by --delay and is short enough not to need a reduced-motion variant.',
	],
	related: [
		{ name: 'Action Sheet', storyId: 'patterns-interaction-actionsheet--docs' },
		{ name: 'Bottom Sheet', storyId: 'patterns-interaction-bottomsheet--docs' },
		{ name: 'Overflow Menu', storyId: 'patterns-navigation-overflowmenu--docs' },
	],
};
