import type { PatternDocMeta } from './types';

export const FLOATING_ACTIONS_DOC: PatternDocMeta = {
	name: 'Floating Actions',
	category: 'Interaction',
	lede: 'Expandable FAB with secondary actions.',
	overview: 'Use Floating Actions when you need expandable fab with secondary actions in your application UI.',
	stylingSelector: '.floating-actions',
	liveStoryId: 'patterns-interaction-floatingactions--default',

	whenToUse: [
		'When expandable fab with secondary actions.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="floating-actions">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Floating Actions',
			rows: [
				{ name: 'IsExpanded', type: 'Text', description: 'When true, the floating actions start expanded.' },
				{
					name: 'IsHover',
					type: 'Text',
					description: 'When true, the actions open on hover instead of click.',
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
		{ name: 'ActionSheet', storyId: 'patterns-interaction-actionsheet--docs' },
		{ name: 'AnimatedLabel', storyId: 'patterns-interaction-animatedlabel--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
