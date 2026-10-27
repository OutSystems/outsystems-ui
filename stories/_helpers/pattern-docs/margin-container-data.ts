import type { PatternDocMeta } from './types';

export const MARGIN_CONTAINER_DOC: PatternDocMeta = {
	name: 'Margin Container',
	category: 'Utilities',
	lede: 'Spacing wrapper using theme margins.',
	overview: 'Use Margin Container when you need spacing wrapper using theme margins in your application UI.',
	stylingSelector: '.margin-container',
	liveStoryId: 'patterns-utilities-margincontainer--default',

	whenToUse: [
		'When spacing wrapper using theme margins.',
		'Inside utilities layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="margin-container">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Margin Container',
			rows: [],
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
