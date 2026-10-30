import type { PatternDocMeta } from './types';

export const FLOATING_CONTENT_DOC: PatternDocMeta = {
	name: 'Floating Content',
	category: 'Content',
	lede: 'Fixed-position overlay anchored to a screen edge or centre — for toolbars, FAB panels, or persistent helpers.',
	overview:
		'Floating Content uses `position: fixed` with a position class (`.floating-content-bottom-right`, etc.). Optional margin and full-width/height modifiers stretch the block along an axis.',
	stylingSelector: '.floating-content',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/floating_content/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/floating_content/',
	liveStoryId: 'patterns-content-floatingcontent--bottom-right',
	whenToUse: [
		'Persistent action bars or chat widgets over scrolling content.',
		'Contextual panels pinned to a corner.',
		'Full-width banners that float above the page.',
	],
	whenNotToUse: [
		'Modal dialogs that block the whole screen — use a popup pattern.',
		'Inline content in the normal document flow.',
	],
	anatomy: {
		tree: `<div class="floating-content floating-content-bottom-right floating-content-margin">
  <!-- Content placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Floating Content',
			rows: [
				{
					name: 'Position',
					type: 'FloatingContentPosition',
					description:
						'Anchors the block: top-left, top, top-right, left, center, right, bottom-left, bottom, bottom-right.',
				},
				{ name: 'UseMargin', type: 'Boolean', description: 'Adds outer margin (`.floating-content-margin`).' },
				{ name: 'FullWidth', type: 'Boolean', description: 'Stretches across the full width.' },
				{ name: 'FullHeight', type: 'Boolean', description: 'Stretches across the full height.' },
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' },
			],
		},
	],
	accessibility: [
		'Floating UI should not trap focus unless it behaves as a modal.',
		'Ensure sufficient contrast against content scrolling behind the panel.',
		'Do not cover essential page controls without a way to dismiss or move the panel.',
	],
	related: [
		{ name: 'FloatingActions', storyId: 'patterns-interaction-floatingactions--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Sidebar', storyId: 'patterns-navigation-sidebar--docs' },
	],
};
