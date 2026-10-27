import type { PatternDocMeta } from './types';

export const PAGINATION_DOC: PatternDocMeta = {
	name: 'Pagination',
	category: 'Navigation',
	lede: 'Page controls for long result sets.',
	overview: 'Use Pagination when you need page controls for long result sets in your application UI.',
	stylingSelector: '.pagination',
	liveStoryId: 'patterns-navigation-pagination--default',

	whenToUse: [
		'When page controls for long result sets.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="pagination">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Pagination',
			rows: [
				{
					name: 'ShowGoToPage',
					type: 'Text',
					description:
						'Replace the page-number buttons with an input to jump straight to a page, followed by an "of N pages" label. The record-range counter on the left is unaffected.',
				},
				{ name: 'StartIndex', type: 'Text', description: 'Maps to the StartIndex input parameter.' },
				{ name: 'MaxRecords', type: 'Text', description: 'Maps to the MaxRecords input parameter.' },
				{ name: 'TotalCount', type: 'Text', description: 'Maps to the TotalCount input parameter.' },
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
		{ name: 'BottomBar', storyId: 'patterns-navigation-bottombar--docs' },
		{ name: 'Breadcrumbs', storyId: 'patterns-navigation-breadcrumbs--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
