import type { PatternDocMeta } from './types';

export const BOTTOM_BAR_DOC: PatternDocMeta = {
	name: 'Bottom Bar',
	category: 'Navigation',
	lede: 'Fixed tab bar for mobile navigation.',
	overview:
		'Use Bottom Bar when you need fixed tab bar for mobile navigation in your application UI.',
	stylingSelector: '.bottom-bar-wrapper',
	liveStoryId: 'patterns-navigation-bottombar--default',

	whenToUse: [
		'When fixed tab bar for mobile navigation.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="bottom-bar-wrapper">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Bottom Bar',
			rows: [
				{ name: 'Active item', type: 'Text', description: 'Maps to the Active item input parameter.' },
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
		{ name: 'Breadcrumbs', storyId: 'patterns-navigation-breadcrumbs--default' },
		{ name: 'OverflowMenu', storyId: 'patterns-navigation-overflowmenu--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
