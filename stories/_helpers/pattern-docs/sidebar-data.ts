import type { PatternDocMeta } from './types';

export const SIDEBAR_DOC: PatternDocMeta = {
	name: 'Sidebar',
	category: 'Navigation',
	lede: 'Off-canvas panel anchored to an edge.',
	overview:
		'Use Sidebar when you need off-canvas panel anchored to an edge in your application UI.',
	stylingSelector: '.osui-sidebar__content',
	liveStoryId: 'patterns-navigation-sidebar--default',

	whenToUse: [
		'When off-canvas panel anchored to an edge.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-sidebar__content">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Sidebar',
			rows: [
				{ name: 'Direction', type: 'Text', description: 'Maps to the Direction input parameter.' },
				{ name: 'Width', type: 'Text', description: 'Maps to the Width input parameter.' },
				{ name: 'HasOverlay', type: 'Text', description: 'Maps to the HasOverlay input parameter.' },
				{ name: 'StartsOpen', type: 'Text', description: 'Maps to the StartsOpen input parameter.' },
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
		{ name: 'BottomBar', storyId: 'patterns-navigation-bottombar--default' },
		{ name: 'Breadcrumbs', storyId: 'patterns-navigation-breadcrumbs--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
