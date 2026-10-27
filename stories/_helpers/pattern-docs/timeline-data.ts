import type { PatternDocMeta } from './types';

export const TIMELINE_DOC: PatternDocMeta = {
	name: 'Timeline',
	category: 'Navigation',
	lede: 'Vertical sequence of dated events.',
	overview:
		'Use Timeline when you need vertical sequence of dated events in your application UI.',
	stylingSelector: '.timeline',
	liveStoryId: 'patterns-navigation-timeline--default',

	whenToUse: [
		'When vertical sequence of dated events.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="timeline">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Timeline',
			rows: [

			],
		},
	],
	accessibility: [
		'Ensure keyboard users can reach and operate interactive elements inside the pattern.',
		'Provide meaningful labels for icons-only controls.',
		'Use the Storybook A11y toolbar to check contrast and focus order on the live demo.',
	],
	related: [
		{ name: 'BottomBar', storyId: 'patterns-navigation-bottombar--default' },
		{ name: 'Breadcrumbs', storyId: 'patterns-navigation-breadcrumbs--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
