import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const WIZARD_DOC: PatternDocMeta = {
	name: 'Wizard',
	category: 'Navigation',
	lede: 'A row (or column) of step markers that shows where the user is in a multi-step task — checkout, onboarding, or any long form split into manageable screens.',
	overview:
		'Wizard is a parent block whose Content placeholder holds one Wizard Item per step. Each item carries a Status (Past, Active or Next) and fills a Label placeholder and an Icon placeholder (a number, an icon, or nothing for a dot). The runtime adds the orientation and status classes, draws the connector between markers, and — with StepsBehaviour = Interactive — makes Past steps clickable and raises OnClick so you can navigate back; the actual Next/Back navigation stays in your own buttons and logic.',
	stylingSelector: '.osui-wizard',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/navigation/wizard/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/wizard/',
	liveStoryId: 'patterns-navigation-wizard--basic-usage',
	cssApiSlug: 'patterns-content-wizard-item',
	whenToUse: [
		'Checkout or sign-up flows with three to six sequential steps the user should see at a glance.',
		'Long forms split across screens, where showing progress lowers abandonment.',
		'Guided setup where completed steps should stay reachable (StepsBehaviour = Interactive).',
	],
	whenNotToUse: [
		'A history of events that already happened — use the Timeline pattern.',
		'Two or three short sections on one screen — Tabs or an Accordion are lighter.',
	],
	anatomy: {
		tree: `<div class="osui-wizard is-horizontal is-interactive" role="tablist" aria-orientation="horizontal">
  <!-- runtime adds: is-horizontal | is-vertical, is-interactive | is-progress-only (role="list") -->
  <div class="list"> <!-- Content placeholder: one Wizard Item per step -->
    <div data-block="WizardItem" role="tab" aria-selected="false" aria-label="Account" tabindex="0">
      <div class="osui-wizard-item is-past"> <!-- is-past | is-active | is-next, is-reversed -->
        <div class="osui-wizard-item-icon-wrapper"> <!-- connector drawn with ::before -->
          <div class="osui-wizard-item-icon">
            <!-- Icon placeholder: number, icon, or empty for a dot -->
          </div>
        </div>
        <div class="osui-wizard-item-label">
          <!-- Label placeholder (required — read for aria-label) -->
        </div>
      </div>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Wizard',
			rows: [
				{
					name: 'IsVertical',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, the steps stack vertically instead of running left to right.',
				},
				{
					name: 'StepsBehaviour',
					type: 'StepsBehaviour',
					defaultValue: 'Interactive',
					description:
						'Entities.StepsBehaviour.Interactive — Past steps are clickable navigation controls (OnClick fires). ProgressOnly — steps are a read-only progress indicator; users move with your Next/Back buttons.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Wizard root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'Wizard Item',
			rows: [
				{
					name: 'Status',
					type: 'Steps',
					description:
						'Required. Entities.Steps.Past (completed), Active (current) or Next (upcoming). Drives the is-past / is-active / is-next classes and the ARIA state.',
				},
				{
					name: 'ReverseLabelPosition',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, swaps the label and the marker (label above, or before, the icon).',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description: 'Extra CSS classes on the Wizard Item root.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Wizard: fires once the Wizard instance is ready (returns WizardId).' },
		{
			name: 'OnClick',
			description:
				'Wizard Item: fires when a Past step is clicked in an Interactive wizard (returns WizardItemId).',
		},
	],
	apiSections: [
		{
			title: 'Wizard API',
			rows: [
				{ name: 'Create', description: 'Register a new Wizard instance (before its items).' },
				{ name: 'Initialize', description: 'Build the Wizard: orientation, behaviour classes and ARIA role.' },
				{
					name: 'ChangeProperty',
					description: 'Update IsVertical or StepBehavior at runtime; items re-apply their classes.',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to Wizard-level callbacks.' },
				{
					name: 'GetWizardById / GetAllWizards',
					description: 'Look up one instance or list every registered id.',
				},
				{ name: 'Dispose', description: 'Tear down the instance (after its items).' },
			],
		},
		{
			title: 'Wizard Item API',
			rows: [
				{ name: 'Create', description: 'Register a step; it joins the closest .osui-wizard parent.' },
				{
					name: 'Initialize',
					description: 'Build the step: status class, label-driven aria-label and click handling.',
				},
				{
					name: 'ChangeProperty',
					description: 'Update Status or ReverseLabelPosition — the usual way to advance the wizard.',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to OnClick.' },
				{
					name: 'GetWizardItemById / GetAllWizardItems',
					description: 'Look up one step or list every registered id.',
				},
				{ name: 'Dispose', description: 'Tear down the step.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'Interactive wizards render as role="tablist" with each step a focusable role="tab" (tabindex="0"); ',
			React.createElement(PdKey, null, 'Tab'),
			' reaches Past steps and ',
			React.createElement(PdKey, null, 'Enter'),
			' activates them.'
		),
		'ProgressOnly wizards render as role="list" / role="listitem"; the Active step carries aria-current="step" and is not focusable.',
		'The runtime copies the Label placeholder text into aria-label on each step, so every Wizard Item needs a text label — an icon alone is not announced.',
		'Next steps get aria-disabled="true"; the Active step in an Interactive wizard is aria-selected="true".',
	],
	related: [
		{ name: 'Timeline', storyId: 'patterns-navigation-timeline--docs' },
		{ name: 'Tabs', storyId: 'patterns-navigation-tabs--docs' },
		{ name: 'Progress Bar', storyId: 'patterns-numbers-progress-bar--docs' },
	],
};
