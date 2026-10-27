import type { PatternDocMeta } from './types';

export const COLUMNS_DOC: PatternDocMeta = {
	name: 'Columns',
	category: 'Adaptive',
	lede: 'Responsive multi-column layout.',
	overview:
		'Use Columns to lay out sibling content in equal or asymmetric splits. Gutter size and breakpoint behaviour control how columns stack on tablet and phone.',
	stylingSelector: '.columns',
	liveStoryId: 'patterns-adaptive-columns--columns-2',
	whenToUse: [
		'Side-by-side content that should reflow on smaller breakpoints.',
		'Equal-width grids (2–6 columns) or asymmetric splits (medium/small + wide).',
	],
	whenNotToUse: [
		'Complex page grids — use the platform layout grid instead.',
		'When a single column list is enough.',
	],
	anatomy: {
		tree: `<div class="columns columns2 gutter-base">
  <div class="columns-item"><!-- Column 1 --></div>
  <div class="columns-item"><!-- Column 2 --></div>
</div>`,
	},
	properties: [
		{
			title: 'Columns',
			rows: [
				{ name: 'GutterSize', type: 'Space', description: 'Gap between columns — maps to `gutter-{size}` on the root.' },
				{
					name: 'TabletBehavior',
					type: 'ColumnsBreakBehavior',
					description: 'How columns stack on tablet (`tablet-break-*`).',
				},
				{
					name: 'PhoneBehavior',
					type: 'ColumnsBreakBehavior',
					description: 'How columns stack on phone (`phone-break-*`).',
				},
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' },
			],
		},
	],
	accessibility: [
		'Keep a logical reading order in the DOM — columns stack in source order on small screens.',
		'Do not rely on column position alone to convey meaning.',
	],
	related: [
		{ name: 'Gallery', storyId: 'patterns-adaptive-gallery--docs' },
		{ name: 'MasterDetail', storyId: 'patterns-adaptive-masterdetail--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
	],
};
