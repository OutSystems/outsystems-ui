import type { PatternDocMeta } from './types';

export const CARD_BACKGROUND_DOC: PatternDocMeta = {
	name: 'Card Background',
	category: 'Content',
	lede: 'Hero-style tile that layers content over a background image with a colour overlay.',
	overview:
		'Card Background stacks three layers — content, image, and a colour wash — so you can build promotional or feature tiles with minimum height control.',
	stylingSelector: '.card-background',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/card/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/card/',
	liveStoryId: 'patterns-content-card-background--basic-usage',
	cssApiSlug: 'patterns-content-card-background',
	whenToUse: [
		'Promotional or feature tiles with a full-bleed background image.',
		'Hero cards where text sits on top of a branded colour overlay.',
		'Marketing blocks that need a minimum height regardless of content length.',
	],
	whenNotToUse: [
		'Simple bordered containers — use Card.',
		'Structured image + copy + footer layouts — use Card Sectioned.',
		'List rows — use Card Item.',
	],
	anatomy: {
		tree: `<div class="card-background">
  <div class="card-background-content"><!-- Content placeholder --></div>
  <div class="card-background-image"><!-- Image placeholder --></div>
  <div class="card-background-color background-primary"></div>
</div>`,
	},
	properties: [
		{
			rows: [
				{
					name: 'Color',
					type: 'Color',
					defaultValue: 'Primary',
					description: 'Background colour overlay (`.card-background-color.background-{color}`).',
				},
				{
					name: 'MinHeight',
					type: 'Integer',
					description: 'Minimum height of the card in pixels.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description: 'Extra CSS classes on the Card Background root.',
				},
			],
		},
	],
	accessibility: [
		'Ensure sufficient contrast between overlay text and the background image or colour wash.',
		'Background images that convey information need alt text on the image widget.',
	],
	related: [
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Card Sectioned', storyId: 'patterns-content-card-sectioned--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
	],
};
