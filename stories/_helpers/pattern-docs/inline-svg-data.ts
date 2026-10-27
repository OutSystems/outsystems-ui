import type { PatternDocMeta } from './types';

export const INLINE_SVG_DOC: PatternDocMeta = {
	name: 'Inline Svg',
	category: 'Utilities',
	lede: 'Inline SVG helper for themed icons.',
	overview: 'Use Inline Svg when you need inline svg helper for themed icons in your application UI.',
	stylingSelector: '.inline-svg',
	liveStoryId: 'patterns-utilities-inlinesvg--default',

	whenToUse: [
		'When inline svg helper for themed icons.',
		'Inside utilities layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="inline-svg">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Inline Svg',
			rows: [
				{ name: 'SVGCode', type: 'Text', description: 'Maps to the SVGCode input parameter.' },
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
		{ name: 'MarginContainer', storyId: 'patterns-utilities-margincontainer--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
