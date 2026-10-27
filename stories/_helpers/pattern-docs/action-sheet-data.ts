import type { PatternDocMeta } from './types';

export const ACTION_SHEET_DOC: PatternDocMeta = {
	name: 'Action Sheet',
	category: 'Interaction',
	lede: 'Bottom sheet of contextual actions.',
	overview: 'Use Action Sheet when you need bottom sheet of contextual actions in your application UI.',
	stylingSelector: '.action-sheet-container',
	liveStoryId: 'patterns-interaction-actionsheet--default',

	whenToUse: [
		'When bottom sheet of contextual actions.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="action-sheet-container">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Action Sheet',
			rows: [
				{ name: 'ShowCancel', type: 'Text', description: 'Renders the cancel row below the actions.' },
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
		{ name: 'AnimatedLabel', storyId: 'patterns-interaction-animatedlabel--docs' },
		{ name: 'BottomSheet', storyId: 'patterns-interaction-bottomsheet--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
