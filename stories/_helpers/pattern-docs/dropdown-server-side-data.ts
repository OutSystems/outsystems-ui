import type { PatternDocMeta } from './types';

export const DROPDOWN_SERVER_SIDE_DOC: PatternDocMeta = {
	name: 'Dropdown Server Side',
	category: 'Advanced',
	lede: 'Dropdown fed by a server-side data source.',
	overview:
		'Use Dropdown Server Side when you need dropdown fed by a server-side data source in your application UI.',
	stylingSelector: '.osui-dropdown-serverside',
	liveStoryId: 'patterns-advanced-dropdownserverside--default',

	whenToUse: [
		'When dropdown fed by a server-side data source.',
		'Inside advanced layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="osui-dropdown-serverside">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Dropdown Server Side',
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
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
