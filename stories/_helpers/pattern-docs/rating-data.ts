import type { PatternDocMeta } from './types';

export const RATING_DOC: PatternDocMeta = {
	name: 'Rating',
	category: 'Numbers',
	lede: 'Star rating input and display.',
	overview:
		'Use Rating when you need star rating input and display in your application UI.',
	stylingSelector: '.osui-rating',
	liveStoryId: 'patterns-numbers-rating--default',

	whenToUse: [
		'When star rating input and display.',
		'Inside numbers layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-rating">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Rating',
			rows: [
				{ name: 'IsEdit', type: 'Text', description: 'Maps to the IsEdit input parameter.' },
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
		{ name: 'Badge', storyId: 'patterns-numbers-badge--default' },
		{ name: 'Counter', storyId: 'patterns-numbers-counter--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
