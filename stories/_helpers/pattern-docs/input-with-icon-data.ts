import type { PatternDocMeta } from './types';

export const INPUT_WITH_ICON_DOC: PatternDocMeta = {
	name: 'Input With Icon',
	category: 'Interaction',
	lede: 'Text input with a leading or trailing icon.',
	overview: 'Use Input With Icon when you need text input with a leading or trailing icon in your application UI.',
	stylingSelector: '.osui-iwi-matrix',
	liveStoryId: 'patterns-interaction-inputwithicon--default',

	whenToUse: [
		'When text input with a leading or trailing icon.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-iwi-matrix">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Input With Icon',
			rows: [
				{ name: 'IconPosition', type: 'Text', description: 'Side of the input where the icon is rendered.' },
				{ name: 'Icon', type: 'Text', description: 'Phosphor icon class (e.g. ph-magnifying-glass).' },
				{ name: 'Placeholder', type: 'Text', description: 'Maps to the Placeholder input parameter.' },
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
