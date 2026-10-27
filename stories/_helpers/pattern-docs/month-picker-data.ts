import type { PatternDocMeta } from './types';

export const MONTH_PICKER_DOC: PatternDocMeta = {
	name: 'Month Picker',
	category: 'Interaction',
	lede: 'Month/year picker built on Flatpickr.',
	overview:
		'Use Month Picker when you need month/year picker built on flatpickr in your application UI.',
	stylingSelector: '.osui-monthpicker-a11y',
	liveStoryId: 'patterns-interaction-monthpicker--default',

	whenToUse: [
		'When month/year picker built on flatpickr.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-monthpicker-a11y">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Month Picker',
			rows: [
				{ name: 'DateFormat', type: 'Text', description: 'Maps to the DateFormat input parameter.' },
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
		{ name: 'ActionSheet', storyId: 'patterns-interaction-actionsheet--default' },
		{ name: 'AnimatedLabel', storyId: 'patterns-interaction-animatedlabel--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
