import type { PatternDocMeta } from './types';

export const VIDEO_DOC: PatternDocMeta = {
	name: 'Video',
	category: 'Utilities',
	lede: 'Themed video player chrome.',
	overview: 'Use Video when you need themed video player chrome in your application UI.',
	stylingSelector: '.video',
	liveStoryId: 'patterns-utilities-video--default',

	whenToUse: [
		'When themed video player chrome.',
		'Inside utilities layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="video">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Video',
			rows: [
				{ name: 'URL', type: 'Text', description: 'Maps to the URL input parameter.' },
				{ name: 'Controls', type: 'Text', description: 'Maps to the Controls input parameter.' },
				{ name: 'Muted', type: 'Text', description: 'Maps to the Muted input parameter.' },
				{ name: 'Loop', type: 'Text', description: 'Maps to the Loop input parameter.' },
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
		{ name: 'CenterContent', storyId: 'patterns-utilities-centercontent--docs' },
		{ name: 'InlineSvg', storyId: 'patterns-utilities-inlinesvg--docs' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
