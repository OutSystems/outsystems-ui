import type { PatternDocMeta } from './types';

export const MASTER_DETAIL_DOC: PatternDocMeta = {
	name: 'Master Detail',
	category: 'Adaptive',
	lede: 'List + detail split that adapts by breakpoint.',
	overview: 'Use Master Detail when you need list + detail split that adapts by breakpoint in your application UI.',
	stylingSelector: '.master-detail',
	liveStoryId: 'patterns-adaptive-masterdetail--default',

	whenToUse: [
		'When list + detail split that adapts by breakpoint.',
		'Inside adaptive layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="master-detail">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Master Detail',
			rows: [
				{
					name: 'OpenedOnPhone',
					type: 'Text',
					description:
						'Whether the detail pane is opened on phone. Runtime/responsive: wraps the pattern in a `.phone` context and applies `.open` to `.split-right`, which slides the pane in via CSS transition.',
				},
				{
					name: 'Height',
					type: 'Text',
					description:
						'Height of the pattern (any valid CSS value, e.g. "400px", "60vh"). Applied as an inline height style.',
				},
				{ name: 'LeftPercentage', type: 'Text', description: 'Maps to the LeftPercentage input parameter.' },
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
		{ name: 'Columns', storyId: 'patterns-adaptive-columns--docs' },
		{ name: 'Gallery', storyId: 'patterns-adaptive-gallery--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
