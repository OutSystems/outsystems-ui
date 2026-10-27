import type { PatternDocMeta } from './types';

export const TOUCH_EVENTS_DOC: PatternDocMeta = {
	name: 'Touch Events',
	category: 'Utilities',
	lede: 'Low-level touch event helpers.',
	overview: 'Use Touch Events when you need low-level touch event helpers in your application UI.',
	stylingSelector: '.touch-events',
	liveStoryId: 'patterns-utilities-touchevents--default',

	whenToUse: [
		'When low-level touch event helpers.',
		'Inside utilities layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="touch-events">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Touch Events',
			rows: [],
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
