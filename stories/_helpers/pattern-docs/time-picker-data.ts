import type { PatternDocMeta } from './types';

export const TIME_PICKER_DOC: PatternDocMeta = {
	name: 'Time Picker',
	category: 'Interaction',
	lede: 'Time input with selectable intervals.',
	overview: 'Use Time Picker when you need time input with selectable intervals in your application UI.',
	stylingSelector: '.time-picker',
	liveStoryId: 'patterns-interaction-timepicker--default',

	whenToUse: [
		'When time input with selectable intervals.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="time-picker">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Time Picker',
			rows: [
				{ name: 'Is24Hours', type: 'Text', description: 'Maps to the Is24Hours input parameter.' },
				{ name: 'TimeFormat', type: 'Text', description: 'Maps to the TimeFormat input parameter.' },
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
