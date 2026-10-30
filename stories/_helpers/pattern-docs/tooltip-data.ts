import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const TOOLTIP_DOC: PatternDocMeta = {
	name: 'Tooltip',
	category: 'Interaction',
	lede: 'Short hint in a balloon anchored to a trigger — the lightest way to explain an icon, a field or an abbreviation without adding text to the layout.',
	overview:
		'The Content placeholder is the trigger and the Tooltip placeholder the balloon. The runtime positions the balloon on the side given by Position (flipping it when it would overflow), opens it on hover or on click according to Trigger — on touch devices OnHover falls back to tap — and closes it on Esc, Tab or a click outside. StartsOpen shows it as soon as the screen renders.',
	stylingSelector: '.osui-tooltip',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/tooltip/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/tooltip/',
	liveStoryId: 'patterns-interaction-tooltip--basic-usage',
	cssApiSlug: 'patterns-interaction-tooltip',
	whenToUse: [
		'Explaining an icon-only button or a help icon beside a form label.',
		'A one-line definition of a term, status or abbreviation on hover.',
		'Guiding first-time users to a control with StartsOpen, then closing it once they interact.',
	],
	whenNotToUse: [
		'Content users must read to complete the task — put it in the layout, or use Notification for feedback.',
		'Interactive content (links, buttons, forms) — use Overflow Menu, Floating Content or a Popup.',
	],
	anatomy: {
		tree: `<div class="osui-tooltip osui-tooltip--is-hover" name="<id>"> <!-- + osui-tooltip--is-open while open -->
  <div class="osui-tooltip__content" role="button" tabindex="0" aria-describedby="<id>-balloon">
    <!-- Content placeholder: the trigger -->
  </div>
  <div class="osui-tooltip__balloon-wrapper osui-balloon" role="tooltip">
    <div class="osui-tooltip__balloon-wrapper__balloon" id="<id>-balloon">
      <!-- Tooltip placeholder -->
    </div>
    <div class="osui-tooltip__balloon-arrow"></div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Tooltip',
			rows: [
				{
					name: 'Position',
					type: 'Position',
					defaultValue: 'Right',
					description:
						'Side of the trigger the balloon opens on: Top, TopLeft, TopRight, Bottom, BottomLeft, BottomRight, Left, Right or Center.',
				},
				{
					name: 'StartsOpen',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'True shows the balloon as soon as the screen renders, before any hover or click.',
				},
				{
					name: 'Trigger',
					type: 'Trigger',
					defaultValue: 'OnHover',
					description:
						'OnHover opens on pointer hover (tap on touch devices); OnClick opens on click or keyboard focus and stays open until dismissed.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Tooltip root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires after the Tooltip instance is ready (TooltipId).' },
		{ name: 'OnToggle', description: 'Fires each time the balloon opens or closes (TooltipId, IsOpened).' },
	],
	apiSections: [
		{
			title: 'Tooltip API',
			rows: [
				{ name: 'Create', description: 'Register a new Tooltip instance with its configs.' },
				{
					name: 'Initialize',
					description: 'Build the tooltip: balloon positioning, triggers and ARIA wiring.',
				},
				{ name: 'Open / Close', description: 'Programmatically show or hide the balloon.' },
				{ name: 'ChangeProperty', description: 'Update IsHover, Position or StartVisible at runtime.' },
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle.' },
				{ name: 'GetTooltipById', description: 'Return the instance registered under an id.' },
				{ name: 'GetAllTooltips', description: 'List the ids of every registered Tooltip.' },
				{ name: 'Dispose', description: 'Tear down the instance and its listeners.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'The trigger gets role="button" and tabindex="0", so it is in the Tab order; focusing it opens the balloon and ',
			React.createElement(PdKey, null, 'Esc'),
			' or ',
			React.createElement(PdKey, null, 'Tab'),
			' closes it.'
		),
		'The balloon wrapper has role="tooltip" and the trigger points to it with aria-describedby, so screen readers read the hint together with the trigger.',
		'Keep the balloon to plain text: it is a description, not a place for links or buttons (they would be unreachable from the keyboard).',
		'Under .os-high-contrast the balloon and its arrow get a solid border; the 150 ms entrance fade is short enough not to need a reduced-motion variant.',
	],
	related: [
		{ name: 'Notification', storyId: 'patterns-interaction-notification--docs' },
		{ name: 'Overflow Menu', storyId: 'patterns-navigation-overflowmenu--docs' },
		{ name: 'Floating Content', storyId: 'patterns-content-floatingcontent--docs' },
	],
};
