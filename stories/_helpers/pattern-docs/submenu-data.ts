import type { PatternDocMeta } from './types';

export const SUBMENU_DOC: PatternDocMeta = {
	name: 'Submenu',
	category: 'Navigation',
	lede: 'Nested navigation under a parent item.',
	overview:
		'Use Submenu when you need nested navigation under a parent item in your application UI.',
	stylingSelector: '.submenu',
	liveStoryId: 'patterns-navigation-submenu--default',

	whenToUse: [
		'When nested navigation under a parent item.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="submenu">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Submenu',
			rows: [
				{ name: 'OpenOnHover', type: 'Text', description: 'Maps to the OpenOnHover input parameter.' },
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
