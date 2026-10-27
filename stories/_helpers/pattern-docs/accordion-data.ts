import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const ACCORDION_DOC: PatternDocMeta = {
	name: 'Accordion',
	category: 'Content',
	lede: 'Stacked sections that expand and collapse on click — ideal for FAQs, dense settings, and optional detail without leaving the page.',
	overview:
		'Use the Accordion pattern when users need to scan headings first and reveal detail on demand. Each section has a title row and a collapsible content area.',
	stylingSelector: '.osui-accordion-item',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/accordion/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/accordion/',
	liveStoryId: 'patterns-content-accordion--basic-usage',
	cssApiSlug: 'patterns-content-accordion-item',
	whenToUse: [
		'FAQs and help content where only one section needs focus at a time.',
		'Optional settings or advanced options that should stay out of the default view.',
		'Grouped content that would otherwise require long vertical scroll.',
	],
	whenNotToUse: [
		'Primary navigation — use Tabs or a sidebar instead.',
		'Content that must remain fully visible (legal text, critical warnings).',
	],
	anatomy: {
		tree: `<div class="osui-accordion">
  <div data-block> <!-- widget wrapper (carries widget id) -->
    <div class="osui-accordion-item" name="<id>"> <!-- item root -->
      <div class="osui-accordion-item__title">
        <div class="osui-accordion-item__icon"></div>
        <div class="osui-accordion-item__icon placeholder-empty"></div> <!-- custom icon slot -->
        <div class="osui-accordion-item__title__placeholder">
          <span>Title text</span>
        </div>
      </div>
      <div class="osui-accordion-item__content">
        <!-- content placeholder -->
      </div>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Accordion',
			rows: [
				{
					name: 'MultipleItems',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, more than one Accordion Item can stay expanded at the same time.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Accordion root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'Accordion Item',
			rows: [
				{
					name: 'StartsExpanded',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, the item renders open. Cannot be changed at runtime after build.',
				},
				{
					name: 'Icon',
					type: 'AccordionIconType',
					defaultValue: 'Caret',
					description:
						'Caret — chevron up/down (default). PlusMinus — plus when collapsed, minus when expanded. Custom — drop an Icon widget into the item placeholder.',
				},
				{
					name: 'IconPosition',
					type: 'AccordionIconPosition',
					defaultValue: 'Right',
					description: 'Icon on the left or right of the title row.',
				},
				{
					name: 'IsDisabled',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, the item cannot be expanded or collapsed.',
				},
				{
					name: 'ToggleWithIcon',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'Advanced — only the icon toggles the item; use AllowTitleEvents for links inside the title.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description: 'Extra CSS classes on the Accordion Item root.',
				},
			],
		},
	],
	events: [{ name: 'OnToggle', description: 'Fires when an Accordion Item expands or collapses.' }],
	apiSections: [
		{
			title: 'Accordion API',
			rows: [
				{ name: 'Create', description: 'Register a new Accordion instance.' },
				{ name: 'Initialize', description: 'Build the Accordion and wire child items.' },
				{ name: 'CollapseAllItems', description: 'Close every expanded item in the group.' },
				{ name: 'ExpandAllItems', description: 'Open every item (respects MultipleItems when False).' },
				{ name: 'ChangeProperty', description: 'Update a runtime property.' },
				{ name: 'RegisterCallback', description: 'Subscribe to Accordion-level callbacks.' },
				{ name: 'Dispose', description: 'Tear down the instance and release handlers.' },
			],
		},
		{
			title: 'Accordion Item API',
			rows: [
				{ name: 'Create', description: 'Register an item; auto-joins the closest .osui-accordion parent.' },
				{ name: 'Initialize', description: 'Build the item behaviour and ARIA state.' },
				{ name: 'Expand / Collapse', description: 'Programmatically open or close the item.' },
				{ name: 'AllowTitleEvents', description: 'Let clicks inside the title pass through without toggling.' },
				{ name: 'ToggleClickableZone', description: 'Switch toggle target between full title and icon only.' },
				{
					name: 'ChangeProperty',
					description: 'Update a runtime property (except StartsExpanded after build).',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle and other item callbacks.' },
				{ name: 'Dispose', description: 'Tear down the item instance.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'Title row is keyboard operable — ',
			React.createElement(PdKey, null, 'Enter'),
			' and ',
			React.createElement(PdKey, { wide: true, children: 'Space' }),
			' toggle expand/collapse.'
		),
		'Expanded state is exposed to assistive tech via ARIA attributes on the item.',
		'Disabled items (IsDisabled) are inactive controls and do not receive focus for toggle.',
		'Use the Storybook A11y features toolbar to preview focus rings on the live demo.',
	],
	related: [
		{ name: 'Alert', storyId: 'patterns-content-alert--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
	],
};
