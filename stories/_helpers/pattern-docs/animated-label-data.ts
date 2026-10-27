import type { PatternDocMeta } from './types';

export const ANIMATED_LABEL_DOC: PatternDocMeta = {
	name: 'Animated Label',
	category: 'Interaction',
	lede: 'Floating label that animates on focus.',
	overview:
		'Use Animated Label when you need floating label that animates on focus in your application UI.',
	stylingSelector: '.animated-label',
	liveStoryId: 'patterns-interaction-animatedlabel--default',

	whenToUse: [
		'When floating label that animates on focus.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="animated-label">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Animated Label',
			rows: [
				{ name: 'Disabled', type: 'Text', description: 'Disables the input and mutes the field surface + label.' },
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
		{ name: 'BottomSheet', storyId: 'patterns-interaction-bottomsheet--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
