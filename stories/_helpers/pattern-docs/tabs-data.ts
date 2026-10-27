import type { PatternDocMeta } from './types';

export const TABS_DOC: PatternDocMeta = {
	name: 'Tabs',
	category: 'Navigation',
	lede: 'Switch between sibling views in place.',
	overview: 'Use Tabs when you need switch between sibling views in place in your application UI.',
	stylingSelector: '.osui-tabs__header',
	liveStoryId: 'patterns-navigation-tabs--default',

	whenToUse: [
		'When switch between sibling views in place.',
		'Inside navigation layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-tabs__header">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Tabs',
			rows: [
				{ name: 'JustifyHeaders', type: 'Text', description: 'Maps to the JustifyHeaders input parameter.' },
				{ name: 'TabsOrientation', type: 'Text', description: 'Maps to the TabsOrientation input parameter.' },
				{
					name: 'TabsVerticalPosition',
					type: 'Text',
					description: 'Maps to the TabsVerticalPosition input parameter.',
				},
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
