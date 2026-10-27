import type { PatternDocMeta } from './types';

export const SWIPE_EVENTS_DOC: PatternDocMeta = {
	name: 'Swipe Events',
	category: 'Utilities',
	lede: 'Gesture helpers for swipe interactions.',
	overview:
		'Use Swipe Events when you need gesture helpers for swipe interactions in your application UI.',
	stylingSelector: '.swipe-events',
	liveStoryId: 'patterns-utilities-swipeevents--default',

	whenToUse: [
		'When gesture helpers for swipe interactions.',
		'Inside utilities layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="swipe-events">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Swipe Events',
			rows: [

			],
		},
	],
	accessibility: [
		'Ensure keyboard users can reach and operate interactive elements inside the pattern.',
		'Provide meaningful labels for icons-only controls.',
		'Use the Storybook A11y toolbar to check contrast and focus order on the live demo.',
	],
	related: [
		{ name: 'CenterContent', storyId: 'patterns-utilities-centercontent--default' },
		{ name: 'InlineSvg', storyId: 'patterns-utilities-inlinesvg--default' },
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
	],
};
