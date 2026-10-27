import type { PatternDocMeta } from './types';

export const CENTER_CONTENT_DOC: PatternDocMeta = {
	name: 'Center Content',
	category: 'Utilities',
	lede: 'Centers children in the available space.',
	overview:
		'Use Center Content when you need centers children in the available space in your application UI.',
	stylingSelector: '.center-content',
	liveStoryId: 'patterns-utilities-centercontent--default',

	whenToUse: [
		'When centers children in the available space.',
		'Inside utilities layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="center-content">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Center Content',
			rows: [
				{ name: 'Header slot', type: 'Text', description: 'Maps to the Header slot input parameter.' },
				{ name: 'Bottom slot', type: 'Text', description: 'Maps to the Bottom slot input parameter.' },
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
		{ name: 'InlineSvg', storyId: 'patterns-utilities-inlinesvg--default' },
		{ name: 'MarginContainer', storyId: 'patterns-utilities-margincontainer--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
