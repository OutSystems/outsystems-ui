import type { PatternDocMeta } from './types';

export const LIST_ITEM_CONTENT_DOC: PatternDocMeta = {
	name: 'List Item Content',
	category: 'Content',
	lede: 'Three-region row layout — left, centre (title + text), and right — composed inside a List Item.',
	overview:
		'List Item Content is not a standalone screen block: it lives inside a List Item widget within a List. Use it to align avatar, title, subtitle, and trailing actions in a tappable row.',
	stylingSelector: '.list-item-content',
	odcUrl:
		'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/list_item_content/',
	o11Url:
		'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/list_item_content/',
	liveStoryId: 'patterns-content-list-item-content--basic-row',
	whenToUse: [
		'Contact lists, settings rows, or notification feeds.',
		'Any list row that needs avatar + title + subtitle + trailing metadata.',
	],
	whenNotToUse: [
		'Standalone cards outside a List — use Card Item instead.',
		'Data tables with sortable columns — use Table.',
	],
	anatomy: {
		tree: `<div class="list-item-content">
  <div class="list-item-content-left"><!-- Avatar / icon --></div>
  <div class="list-item-content-center">
    <div class="list-item-content-title">Title</div>
    <div class="list-item-content-text">Supporting text</div>
  </div>
  <div class="list-item-content-right"><!-- Trailing action --></div>
</div>`,
	},
	properties: [
		{
			title: 'List Item Content',
			rows: [
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the content root.' },
			],
		},
	],
	accessibility: [
		'The parent List Item should be keyboard focusable when the row is interactive.',
		'Title and supporting text should convey the row purpose without relying on the avatar alone.',
		'Trailing icons need accessible names when they are actionable.',
	],
	related: [
		{ name: 'UserAvatar', storyId: 'patterns-content-useravatar--docs' },
		{ name: 'Card Item', storyId: 'patterns-content-card-item--docs' },
		{ name: 'Table', storyId: 'patterns-content-table--docs' },
	],
};
