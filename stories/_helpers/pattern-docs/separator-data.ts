import type { PatternDocMeta } from './types';

export const SEPARATOR_DOC: PatternDocMeta = {
	name: 'Separator',
	category: 'Utilities',
	lede: 'Horizontal or vertical content divider.',
	overview: 'Use Separator when you need horizontal or vertical content divider in your application UI.',
	stylingSelector: '.separator',
	liveStoryId: 'patterns-utilities-separator--default',

	whenToUse: [
		'When horizontal or vertical content divider.',
		'Inside utilities layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="separator">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Separator',
			rows: [
				{
					name: 'IsVertical',
					type: 'Text',
					description: 'Set the orientation of the Separator. When true it renders as a vertical rule.',
				},
				{
					name: 'Space',
					type: 'Text',
					description:
						'Space around the Separator — padding on the block axis when horizontal, on the inline axis when vertical.',
				},
				{
					name: 'Color',
					type: 'Text',
					description: 'Color of the Separator. Empty falls back to the neutral border colour from the SCSS.',
				},
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
		{ name: 'CenterContent', storyId: 'patterns-utilities-centercontent--docs' },
		{ name: 'InlineSvg', storyId: 'patterns-utilities-inlinesvg--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
