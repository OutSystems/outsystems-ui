import type { PatternDocMeta } from './types';

export const TAG_DOC: PatternDocMeta = {
	name: 'Tag',
	category: 'Content',
	lede: 'Compact label for status, category, or count — available in multiple colours, sizes, and shapes.',
	overview:
		'Use Tag for short metadata beside titles or inside tables. Color maps to background utilities; IsLight switches to the subtle background variant with darker text.',
	stylingSelector: '.tag',
	odcUrl:
		'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/tag/',
	o11Url:
		'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/tag/',
	liveStoryId: 'patterns-content-tag--default-style',
	cssApiSlug: 'patterns-content-tag',
	whenToUse: [
		'Status chips (Active, Draft, Error).',
		'Category or taxonomy labels.',
		'Compact counts in list rows.',
	],
	whenNotToUse: [
		'Primary actions — use Button.',
		'Long sentences or multi-line content.',
	],
	anatomy: {
		tree: `<div class="tag tag-medium border-radius-rounded background-primary OSInline">Label</div>`,
	},
	properties: [
		{
			title: 'Tag',
			rows: [
				{ name: 'Color', type: 'Color', defaultValue: 'Primary', description: 'Background colour (`.background-{color}`).' },
				{ name: 'Size', type: 'TagSize', description: 'small, medium, or default compact size.' },
				{ name: 'Shape', type: 'TagShape', description: 'Border radius: none, soft, rounded, circle.' },
				{
					name: 'IsLight',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'Lightest background variant with darker text.',
				},
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' },
			],
		},
	],
	accessibility: [
		'Tag text should be readable without relying on colour alone.',
		'If the tag conveys status, include the status in the label text.',
	],
	related: [
		{ name: 'Badge', storyId: 'patterns-numbers-badge--default' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'UserAvatar', storyId: 'patterns-content-useravatar--docs' },
	],
};
