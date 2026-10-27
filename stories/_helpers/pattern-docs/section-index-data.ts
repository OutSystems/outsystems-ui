import type { PatternDocMeta } from './types';

export const SECTION_INDEX_DOC: PatternDocMeta = {
	name: 'Section Index',
	category: 'Navigation',
	lede: 'Sticky index that jumps to page sections.',
	overview:
		'Use Section Index when you need sticky index that jumps to page sections in your application UI.',
	stylingSelector: '.section-index',
	liveStoryId: 'patterns-navigation-sectionindex--default',

	whenToUse: [
		'When sticky index that jumps to page sections.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="section-index">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Section Index',
			rows: [
				{ name: 'SmoothScrolling', type: 'Text', description: 'Maps to the SmoothScrolling input parameter.' },
				{ name: 'IsFixed', type: 'Text', description: 'Maps to the IsFixed input parameter.' },
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
		{ name: 'BottomBar', storyId: 'patterns-navigation-bottombar--default' },
		{ name: 'Breadcrumbs', storyId: 'patterns-navigation-breadcrumbs--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
