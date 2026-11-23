import type { PatternDocMeta } from './types';

export const CARD_SECTIONED_DOC: PatternDocMeta = {
	name: 'Card Sectioned',
	category: 'Content',
	lede: 'Structured card with image, title, body copy, and a footer action slot.',
	overview:
		'Card Sectioned combines media and copy in one tile. Stack image and text vertically or place them side by side, then wire a link or button in the Card Bottom placeholder.',
	stylingSelector: '.card.card-sectioned',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/card/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/card/',
	liveStoryId: 'patterns-content-card-sectioned--basic-usage',
	cssApiSlug: 'patterns-content-card',
	whenToUse: [
		'Product or plan tiles with an image, headline, description, and call to action.',
		'Promotional cards where the footer link is the primary action.',
		'Horizontal layouts when image and copy should sit on the same row.',
	],
	whenNotToUse: [
		'A plain content wrapper with no structured slots — use Card.',
		'Full-bleed hero imagery with an overlay — use Card Background.',
		'Compact list rows — use Card Item.',
	],
	anatomy: {
		tree: `<div class="card card-sectioned flex-direction-column">
  <div class="card-image"><!-- Image placeholder --></div>
  <div class="card-sectioned-top">
    <div class="card-title">Title</div>
    <div class="card-content">Body copy</div>
    <div class="card-bottom"><!-- Link or button --></div>
  </div>
</div>`,
	},
	properties: [
		{
			rows: [
				{
					name: 'UsePadding',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'When False, removes all padding including on the image.',
				},
				{
					name: 'IsVertical',
					type: 'Boolean',
					defaultValue: 'True',
					description:
						'Vertical stacks image below copy (`.flex-direction-column`). Horizontal places the image beside the copy (`.flex-direction-row`).',
				},
				{
					name: 'ImagePadding',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'When True, adds padding around the image. Has no effect when UsePadding is False.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description: 'Extra CSS classes on the Card Sectioned root.',
				},
			],
		},
	],
	accessibility: [
		'Images need meaningful alt text; decorative images should use an empty alt attribute.',
		'Links and buttons in Card Bottom need visible labels.',
		'Use the Storybook A11y toolbar to preview focus order inside interactive cards.',
	],
	related: [
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Card Background', storyId: 'patterns-content-card-background--docs' },
		{ name: 'Card Item', storyId: 'patterns-content-card-item--docs' },
		{ name: 'Carousel', storyId: 'patterns-content-carousel--docs' },
	],
};
