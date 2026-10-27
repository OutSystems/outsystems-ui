import type { PatternDocMeta } from './types';

export const SECTION_DOC: PatternDocMeta = {
	name: 'Section',
	category: 'Content',
	lede: 'Page section with a titled heading and body — group related settings or content under a divider.',
	overview:
		'Use Section to break long forms or settings screens into scannable groups. Section Group wraps multiple sections; IsSticky keeps titles visible while scrolling.',
	stylingSelector: '.section',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/section/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/section/',
	liveStoryId: 'patterns-content-section--basic-usage',
	cssApiSlug: 'patterns-content-section',
	whenToUse: [
		'Settings or profile pages with multiple topic groups.',
		'Long forms split into logical chunks.',
		'Sticky section headers in scrollable panels.',
	],
	whenNotToUse: [
		'Primary navigation between top-level views — use Tabs.',
		'Collapsible optional detail — use Accordion.',
	],
	anatomy: {
		tree: `<div class="section-group">
  <div class="section" role="region">
    <div class="section-title dividers">Account settings</div>
    <div class="section-content">Grouped content</div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Section',
			rows: [
				{
					name: 'UsePadding',
					type: 'Boolean',
					defaultValue: 'True',
					description: 'When False, removes top padding from `.section-content` (`.padding-none`).',
				},
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on `.section-group`.' },
			],
		},
		{
			title: 'Section Group',
			rows: [
				{
					name: 'IsSticky',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, section titles stick while their section scrolls (`.is--sticky`).',
				},
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the group root.' },
			],
		},
	],
	accessibility: [
		'Each `.section` uses role="region" — pair with a visible title.',
		'Sticky titles should not obscure focusable controls underneath.',
	],
	related: [
		{ name: 'Accordion', storyId: 'patterns-content-accordion--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Tabs', storyId: 'patterns-navigation-tabs--docs' },
	],
};
