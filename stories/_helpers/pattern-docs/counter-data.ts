import type { PatternDocMeta } from './types';

export const COUNTER_DOC: PatternDocMeta = {
	name: 'Counter',
	category: 'Numbers',
	lede: 'Animated numeric counter display.',
	overview:
		'Use Counter when you need animated numeric counter display in your application UI.',
	stylingSelector: '.counter',
	liveStoryId: 'patterns-numbers-counter--default',

	whenToUse: [
		'When animated numeric counter display.',
		'Inside numbers layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="counter">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Counter',
			rows: [
				{ name: 'BackgroundColor', type: 'Text', description: 'Background color of the Block. Maps to `background-{value}` utility class on the root.' },
				{ name: 'IsVertical', type: 'Text', description: 'When True, content is displayed vertically (column). Maps to `flex-direction-column` on `.center-align`; False maps to `flex-direction-row`.' },
				{ name: 'Height', type: 'Text', description: 'Maps to the Height input parameter.' },
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
		{ name: 'IconBadge', storyId: 'patterns-numbers-iconbadge--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
