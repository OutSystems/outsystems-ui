import type { PatternDocMeta } from './types';

export const GALLERY_DOC: PatternDocMeta = {
	name: 'Gallery',
	category: 'Adaptive',
	lede: 'Responsive grid that reflows per device.',
	overview: 'Use Gallery when you need responsive grid that reflows per device in your application UI.',
	stylingSelector: '.gallery',
	liveStoryId: 'patterns-adaptive-gallery--default',

	whenToUse: [
		'When responsive grid that reflows per device.',
		'Inside adaptive layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="gallery">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Gallery',
			rows: [{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' }],
		},
	],
	accessibility: [
		'Ensure keyboard users can reach and operate interactive elements inside the pattern.',
		'Provide meaningful labels for icons-only controls.',
		'Use the Storybook A11y toolbar to check contrast and focus order on the live demo.',
	],
	related: [
		{ name: 'Columns', storyId: 'patterns-adaptive-columns--docs' },
		{ name: 'MasterDetail', storyId: 'patterns-adaptive-masterdetail--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
