import type { PatternDocMeta } from './types';

export const PROGRESS_DOC: PatternDocMeta = {
	name: 'Progress',
	category: 'Numbers',
	lede: 'Bar and circle variants for completion.',
	overview:
		'Use Progress when you need bar and circle variants for completion in your application UI.',
	stylingSelector: '.osui-progress-bar__container',
	liveStoryId: 'patterns-numbers-progress--bar',

	whenToUse: [
		'When bar and circle variants for completion.',
		'Inside numbers layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-progress-bar__container">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Progress',
			rows: [
				{ name: 'Shape', type: 'Text', description: 'Maps to the Shape input parameter.' },
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
		{ name: 'Badge', storyId: 'patterns-numbers-badge--default' },
		{ name: 'Counter', storyId: 'patterns-numbers-counter--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
