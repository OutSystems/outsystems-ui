import type { PatternDocMeta } from './types';

export const BUTTON_LOADING_DOC: PatternDocMeta = {
	name: 'Button Loading',
	category: 'Interaction',
	lede: 'Button that swaps to a loading state.',
	overview: 'Use Button Loading when you need button that swaps to a loading state in your application UI.',
	stylingSelector: '.button-loading',
	liveStoryId: 'patterns-interaction-buttonloading--default',

	whenToUse: [
		'When button that swaps to a loading state.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="button-loading">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Button Loading',
			rows: [
				{ name: 'IsLoading', type: 'Text', description: 'Maps to the IsLoading input parameter.' },
				{
					name: 'ShowLoadingAndLabel',
					type: 'Text',
					description: 'Maps to the ShowLoadingAndLabel input parameter.',
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
		{ name: 'ActionSheet', storyId: 'patterns-interaction-actionsheet--docs' },
		{ name: 'AnimatedLabel', storyId: 'patterns-interaction-animatedlabel--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
