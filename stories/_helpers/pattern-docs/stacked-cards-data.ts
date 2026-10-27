import type { PatternDocMeta } from './types';

export const STACKED_CARDS_DOC: PatternDocMeta = {
	name: 'Stacked Cards',
	category: 'Interaction',
	lede: 'Swipeable card stack for decision flows.',
	overview:
		'Use Stacked Cards when you need swipeable card stack for decision flows in your application UI.',
	stylingSelector: '.stacked-cards',
	liveStoryId: 'patterns-interaction-stackedcards--default',

	whenToUse: [
		'When swipeable card stack for decision flows.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="stacked-cards">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Stacked Cards',
			rows: [
				{ name: 'Overlay preview', type: 'Text', description: 'Shows one of the swipe-feedback overlays (left = reject/error, right = accept/success, top = info).' },
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
		{ name: 'ActionSheet', storyId: 'patterns-interaction-actionsheet--default' },
		{ name: 'AnimatedLabel', storyId: 'patterns-interaction-animatedlabel--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
