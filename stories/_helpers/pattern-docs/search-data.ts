import type { PatternDocMeta } from './types';

export const SEARCH_DOC: PatternDocMeta = {
	name: 'Search',
	category: 'Interaction',
	lede: 'Search field with clear and optional icon.',
	overview: 'Use Search when you need search field with clear and optional icon in your application UI.',
	stylingSelector: '.search',
	liveStoryId: 'patterns-interaction-search--default',

	whenToUse: [
		'When search field with clear and optional icon.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="search">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Search',
			rows: [],
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
