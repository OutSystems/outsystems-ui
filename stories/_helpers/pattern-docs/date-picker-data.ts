import type { PatternDocMeta } from './types';

export const DATE_PICKER_DOC: PatternDocMeta = {
	name: 'Date Picker',
	category: 'Interaction',
	lede: 'Calendar input with ranges and locales.',
	overview: 'Use Date Picker when you need calendar input with ranges and locales in your application UI.',
	stylingSelector: '.osui-datepicker',
	liveStoryId: 'patterns-interaction-datepicker--default',

	whenToUse: [
		'When calendar input with ranges and locales.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-datepicker">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Date Picker',
			rows: [
				{ name: 'DateFormat', type: 'Text', description: 'Maps to the DateFormat input parameter.' },
				{ name: 'ShowTodayButton', type: 'Text', description: 'Maps to the ShowTodayButton input parameter.' },
				{ name: 'ShowWeekNumbers', type: 'Text', description: 'Maps to the ShowWeekNumbers input parameter.' },
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
