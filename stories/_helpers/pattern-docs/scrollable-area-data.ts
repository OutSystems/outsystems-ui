import type { PatternDocMeta } from './types';

export const SCROLLABLE_AREA_DOC: PatternDocMeta = {
	name: 'Scrollable Area',
	category: 'Interaction',
	lede: 'Scroll container with optional fade edges.',
	overview: 'Use Scrollable Area when you need scroll container with optional fade edges in your application UI.',
	stylingSelector: '.scrollable-area',
	liveStoryId: 'patterns-interaction-scrollablearea--default',

	whenToUse: [
		'When scroll container with optional fade edges.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="scrollable-area">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Scrollable Area',
			rows: [
				{
					name: 'ScrollDirection',
					type: 'Text',
					description: '`none` keeps the area scrollable but hides the scrollbars.',
				},
				{
					name: 'UseCompactScrollbar',
					type: 'Text',
					description: 'Maps to the UseCompactScrollbar input parameter.',
				},
				{ name: 'Height', type: 'Text', description: 'Maps to the Height input parameter.' },
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
