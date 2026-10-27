import type { PatternDocMeta } from './types';

export const CARD_DOC: PatternDocMeta = {
	name: 'Card',
	category: 'Content',
	lede: 'Simple bordered surface for grouping related content with consistent padding and radius.',
	overview:
		'Use Card when you need a lightweight container — settings groups, summary tiles, or any block that benefits from a clear visual boundary. For richer layouts, see Card Sectioned, Card Background, or Card Item.',
	stylingSelector: '.card',
	odcUrl:
		'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/card/',
	o11Url:
		'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/card/',
	liveStoryId: 'patterns-content-card--basic-usage',
	cssApiSlug: 'patterns-content-card',
	whenToUse: [
		'Grouping related content with a clear visual boundary (summary, settings group, product tile).',
		'Wrapping a single block of text or controls that should read as one unit.',
	],
	whenNotToUse: [
		'Layouts that need image, title, body, and footer slots — use Card Sectioned.',
		'Hero or promotional tiles with a background image — use Card Background.',
		'Rows inside a List — use Card Item or List Item Content.',
		'Full-page layout structure — use Section or layout blocks.',
	],
	anatomy: {
		tree: `<div class="card">
  Content placeholder
</div>`,
	},
	properties: [
		{
			rows: [
				{
					name: 'UsePadding',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'When False, removes default padding (`.padding-none` on the root).',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description: 'Extra CSS classes on the Card root.',
				},
			],
		},
	],
	accessibility: [
		'Use semantic headings inside card content where the title introduces a new section.',
		'Links and buttons inside the card need visible labels.',
	],
	related: [
		{ name: 'Card Sectioned', storyId: 'patterns-content-card-sectioned--docs' },
		{ name: 'Card Background', storyId: 'patterns-content-card-background--docs' },
		{ name: 'Card Item', storyId: 'patterns-content-card-item--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
	],
};
