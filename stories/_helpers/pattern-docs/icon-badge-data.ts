import type { PatternDocMeta } from './types';

export const ICON_BADGE_DOC: PatternDocMeta = {
	name: 'Icon Badge',
	category: 'Numbers',
	lede: 'Icon with an overlaid count badge.',
	overview:
		'Use Icon Badge when you need icon with an overlaid count badge in your application UI.',
	stylingSelector: '.badge',
	liveStoryId: 'patterns-numbers-iconbadge--default',

	whenToUse: [
		'When icon with an overlaid count badge.',
		'Inside numbers layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="badge">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Icon Badge',
			rows: [
				{ name: 'Color', type: 'Text', description: 'Background color of the Badge.' },
				{ name: 'IsLight', type: 'Text', description: 'Use the lightest color version for the background and the darker color version for text.' },
				{ name: 'Number', type: 'Text', description: 'Maps to the Number input parameter.' },
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
