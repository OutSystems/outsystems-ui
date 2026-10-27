import type { PatternDocMeta } from './types';

export const DROPDOWN_DOC: PatternDocMeta = {
	name: 'Dropdown',
	category: 'Interaction',
	lede: 'Filterable select with multi-selection.',
	overview:
		'Use Dropdown when you need filterable select with multi-selection in your application UI.',
	stylingSelector: '.dropdown',
	liveStoryId: 'patterns-interaction-dropdown--default',

	whenToUse: [
		'When filterable select with multi-selection.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="dropdown">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Dropdown',
			rows: [
				{ name: 'AllowMultipleSelection', type: 'Text', description: 'Maps to the AllowMultipleSelection input parameter.' },
				{ name: 'IsDisabled', type: 'Text', description: 'Maps to the IsDisabled input parameter.' },
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
