import type { PatternDocMeta } from './types';

export const RANGE_SLIDER_DOC: PatternDocMeta = {
	name: 'Range Slider',
	category: 'Interaction',
	lede: 'Single or dual-thumb numeric slider.',
	overview: 'Use Range Slider when you need single or dual-thumb numeric slider in your application UI.',
	stylingSelector: '.osui-range-slider__provider',
	liveStoryId: 'patterns-interaction-rangeslider--default',

	whenToUse: [
		'When single or dual-thumb numeric slider.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-range-slider__provider">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Range Slider',
			rows: [
				{ name: 'MinValue', type: 'Text', description: 'Maps to the MinValue input parameter.' },
				{ name: 'MaxValue', type: 'Text', description: 'Maps to the MaxValue input parameter.' },
				{ name: 'Step', type: 'Text', description: 'Maps to the Step input parameter.' },
				{
					name: 'ShowFloatingLabel',
					type: 'Text',
					description: 'Maps to the ShowFloatingLabel input parameter.',
				},
				{ name: 'ShowTickMarks', type: 'Text', description: 'Maps to the ShowTickMarks input parameter.' },
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
