import type { PatternDocMeta } from './types';

export const CARD_ITEM_DOC: PatternDocMeta = {
	name: 'Card Item',
	category: 'Content',
	lede: 'Compact list row with left, center, and right placeholders for avatar, text, and trailing metadata.',
	overview:
		'Card Item (`.card.card-detail`) is designed for List rows — avatar or icon on the left, title and subtitle in the center, badge or action on the right.',
	stylingSelector: '.card.card-detail',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/card/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/card/',
	liveStoryId: 'patterns-content-card-item--basic-usage',
	cssApiSlug: 'patterns-content-card-item',
	whenToUse: [
		'User or entity rows inside a List (avatar, name, role, trailing count).',
		'Selectable list items that need a card-like surface per row.',
		'Rows where left and right slots carry icons, badges, or actions.',
	],
	whenNotToUse: [
		'Standalone content blocks outside a List — use Card or Card Sectioned.',
		'Simple title + caption without left/right slots — use List Item Content.',
	],
	anatomy: {
		tree: `<div class="card card-detail">
  <div class="card-detail-left"><!-- Avatar or icon --></div>
  <div class="card-detail-center">
    <div class="card-detail-title">Title</div>
    <div class="card-detail-text">Subtitle</div>
  </div>
  <div class="card-detail-right"><!-- Badge or action --></div>
</div>`,
	},
	properties: [
		{
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					description: 'Extra CSS classes on the Card Item root (`.card.card-detail`).',
				},
			],
		},
	],
	accessibility: [
		"Avatar images need meaningful alt text or an aria-label with the person's name.",
		'Trailing badges that convey status should include visible text or an accessible name.',
		'When the whole row is clickable, ensure a single focusable target with a clear label.',
	],
	related: [
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'List Item Content', storyId: 'patterns-content-list-item-content--docs' },
		{ name: 'UserAvatar', storyId: 'patterns-content-useravatar--docs' },
		{ name: 'Tag', storyId: 'patterns-content-tag--docs' },
	],
};
