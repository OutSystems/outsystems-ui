import type { PatternDocMeta } from './types';

export const BADGE_DOC: PatternDocMeta = {
	name: 'Badge',
	category: 'Numbers',
	lede: 'Numeric or text badge for counts.',
	overview:
		'Use Badge when you need numeric or text badge for counts in your application UI.',
	stylingSelector: '.badge',
	liveStoryId: 'patterns-numbers-badge--default',

	whenToUse: [
		'When numeric or text badge for counts.',
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
			title: 'Badge',
			rows: [
				{ name: 'Color', type: 'Text', description: 'Background color of the Block.' },
				{ name: 'Size', type: 'Text', description: 'Set the size of the Badge (small / medium).' },
				{ name: 'Shape', type: 'Text', description: 'Set the shape of the Badge (border-radius variant).' },
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
		{ name: 'Counter', storyId: 'patterns-numbers-counter--default' },
		{ name: 'IconBadge', storyId: 'patterns-numbers-iconbadge--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
