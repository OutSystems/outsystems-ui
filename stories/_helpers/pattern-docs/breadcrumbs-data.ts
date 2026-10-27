import type { PatternDocMeta } from './types';

export const BREADCRUMBS_DOC: PatternDocMeta = {
	name: 'Breadcrumbs',
	category: 'Navigation',
	lede: 'Hierarchical path back through screens.',
	overview:
		'Use Breadcrumbs when you need hierarchical path back through screens in your application UI.',
	stylingSelector: '.breadcrumbs',
	liveStoryId: 'patterns-navigation-breadcrumbs--default',

	whenToUse: [
		'When hierarchical path back through screens.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="breadcrumbs">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Breadcrumbs',
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
		{ name: 'OverflowMenu', storyId: 'patterns-navigation-overflowmenu--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
