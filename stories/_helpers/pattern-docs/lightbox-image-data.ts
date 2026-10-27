import type { PatternDocMeta } from './types';

export const LIGHTBOX_IMAGE_DOC: PatternDocMeta = {
	name: 'Lightbox Image',
	category: 'Interaction',
	lede: 'Fullscreen image viewer with gestures.',
	overview:
		'Use Lightbox Image when you need fullscreen image viewer with gestures in your application UI.',
	stylingSelector: '.lightbox-image',
	liveStoryId: 'patterns-interaction-lightboximage--default',

	whenToUse: [
		'When fullscreen image viewer with gestures.',
		'Inside interaction layouts where this pattern is the intended building block.',
	],
	whenNotToUse: [
		'When a simpler utility or widget already covers the use case.',
		'When the interaction model does not match how users should complete the task.',
	],
	anatomy: {
		tree: `<div class="lightbox-image">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Lightbox Image',
			rows: [
				{ name: 'ThumbnailWidth (px)', type: 'Text', description: 'Maps to the ThumbnailWidth (px) input parameter.' },
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
