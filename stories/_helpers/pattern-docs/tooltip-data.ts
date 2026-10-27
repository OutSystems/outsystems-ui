import type { PatternDocMeta } from './types';

export const TOOLTIP_DOC: PatternDocMeta = {
	name: 'Tooltip',
	category: 'Interaction',
	lede: 'Hover/focus tip anchored to a trigger.',
	overview:
		'Use Tooltip when you need hover/focus tip anchored to a trigger in your application UI.',
	stylingSelector: '.tooltip',
	liveStoryId: 'patterns-interaction-tooltip--default',

	whenToUse: [
		'When hover/focus tip anchored to a trigger.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="tooltip">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Tooltip',
			rows: [
				{ name: 'IsHover', type: 'Text', description: 'Maps to the IsHover input parameter.' },
				{ name: 'Position', type: 'Text', description: 'Maps to the Position input parameter.' },
				{ name: 'StartVisible', type: 'Text', description: 'Maps to the StartVisible input parameter.' },
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
