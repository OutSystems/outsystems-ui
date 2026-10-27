import type { PatternDocMeta } from './types';

export const WIZARD_DOC: PatternDocMeta = {
	name: 'Wizard',
	category: 'Navigation',
	lede: 'Step-by-step flow with progress markers.',
	overview: 'Use Wizard when you need step-by-step flow with progress markers in your application UI.',
	stylingSelector: '.wizard',
	liveStoryId: 'patterns-navigation-wizard--wizard-story',

	whenToUse: [
		'When step-by-step flow with progress markers.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="wizard">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Wizard',
			rows: [
				{
					name: 'Wizard.StepBehavior',
					type: 'Text',
					description:
						'Interactive makes past steps clickable (role=tablist); ProgressOnly renders a plain list.',
				},
				{
					name: 'Item.ReverseLabelPosition',
					type: 'Text',
					description: 'Places the label before the icon (`is-reversed`).',
				},
				{
					name: 'Wizard.IsVertical',
					type: 'Text',
					description: 'Maps to the Wizard.IsVertical input parameter.',
				},
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' },
			],
		},
	],
	accessibility: [
		'Ensure keyboard users can reach and operate interactive elements inside the pattern.',
		'Provide meaningful labels for icons-only controls.',
		'Use the Storybook A11y toolbar to check contrast and focus order on the live demo.',
	],
	related: [
		{ name: 'BottomBar', storyId: 'patterns-navigation-bottombar--docs' },
		{ name: 'Breadcrumbs', storyId: 'patterns-navigation-breadcrumbs--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
