import type { PatternDocMeta } from './types';

export const BOTTOM_SHEET_DOC: PatternDocMeta = {
	name: 'Bottom Sheet',
	category: 'Interaction',
	lede: 'Draggable panel that rises from the bottom.',
	overview: 'Use Bottom Sheet when you need draggable panel that rises from the bottom in your application UI.',
	stylingSelector: '.bottom-sheet',
	liveStoryId: 'patterns-interaction-bottomsheet--default',

	whenToUse: [
		'When draggable panel that rises from the bottom.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="bottom-sheet">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Bottom Sheet',
			rows: [
				{ name: 'ShowHandler', type: 'Text', description: 'Maps to the ShowHandler input parameter.' },
				{ name: 'Shape', type: 'Text', description: 'Maps to the Shape input parameter.' },
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
