import type { PatternDocMeta } from './types';

export const OVERFLOW_MENU_DOC: PatternDocMeta = {
	name: 'Overflow Menu',
	category: 'Navigation',
	lede: 'Ellipsis menu for secondary actions.',
	overview: 'Use Overflow Menu when you need ellipsis menu for secondary actions in your application UI.',
	stylingSelector: '.osui-overflow-menu__trigger',
	liveStoryId: 'patterns-navigation-overflowmenu--default',

	whenToUse: [
		'When ellipsis menu for secondary actions.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-overflow-menu__trigger">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Overflow Menu',
			rows: [
				{
					name: 'Trigger (Icon)',
					type: 'Text',
					description: 'Phosphor icon class for the Icon widget in the Trigger placeholder.',
				},
				{ name: 'Position', type: 'Text', description: 'Maps to the Position input parameter.' },
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
		{ name: 'BottomBar', storyId: 'patterns-navigation-bottombar--docs' },
		{ name: 'Breadcrumbs', storyId: 'patterns-navigation-breadcrumbs--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
