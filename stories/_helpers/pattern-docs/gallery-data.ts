import type { PatternDocMeta } from './types';

export const GALLERY_DOC: PatternDocMeta = {
	name: 'Gallery',
	category: 'Adaptive',
	lede: 'Responsive grid for a list of equal items — set how many fit per row on desktop, tablet and phone and the layout reflows on its own.',
	overview:
		'Drop a List (or any widgets) into the Content placeholder and the Gallery lays its children out as a CSS grid. RowItemsDesktop, RowItemsTablet and RowItemsPhone each write a CSS variable that the device class on <body> picks up, and ItemsGap maps a Space entity value to the matching --space-* variable for both row and column gaps. Items stretch to equal height, so cards line up.',
	stylingSelector: '.osui-gallery',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/adaptive/gallery/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/adaptive/gallery/',
	liveStoryId: 'patterns-adaptive-gallery--basic-usage',
	whenToUse: [
		'Product catalogues, photo grids and dashboards of equal-weight cards fed by a List.',
		'Any repeated content that needs a different number of columns per device without media queries.',
		'Tile pickers (plans, templates, team members) where every item has the same shape.',
	],
	whenNotToUse: [
		'A fixed, hand-placed arrangement of a few different-sized blocks — use Columns.',
		'A horizontal, one-row sequence the user pages through — use Carousel.',
	],
	anatomy: {
		tree: `<div class="osui-gallery" style="--gallery-desktop-items: 4; --gallery-tablet-items: 3; --gallery-phone-items: 1; --gallery-gap: var(--space-base);">
  <div class="list"> <!-- a List widget in the Content placeholder (plain widgets work too) -->
    <div> <!-- list item -->
      <div class="card card-sectioned">…</div>
    </div>
    <div>…</div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Gallery',
			rows: [
				{
					name: 'RowItemsDesktop',
					type: 'Integer',
					defaultValue: '4',
					description: 'Number of items shown per row on desktop. Must be greater than 0.',
				},
				{
					name: 'RowItemsTablet',
					type: 'Integer',
					defaultValue: '3',
					description: 'Number of items shown per row on tablet. Must be greater than 0.',
				},
				{
					name: 'RowItemsPhone',
					type: 'Integer',
					defaultValue: '1',
					description: 'Number of items shown per row on phone. Must be greater than 0.',
				},
				{
					name: 'ItemsGap',
					type: 'Space',
					defaultValue: 'Base',
					description:
						'Space between the items — None, ExtraSmall, Small, Base, Medium, Large, ExtraLarge or XXLarge. Resolves to the matching --space-* variable.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the Gallery root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [{ name: 'Initialized', description: 'Fires once the Gallery instance is ready.' }],
	apiSections: [
		{
			title: 'Gallery API',
			rows: [
				{ name: 'Create', description: 'Register a new Gallery instance.' },
				{
					name: 'Initialize',
					description: 'Write the per-device item counts and gap as CSS variables on the root.',
				},
				{
					name: 'ChangeProperty',
					description: 'Update RowItemsDesktop, RowItemsTablet, RowItemsPhone or ItemsGap at runtime.',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to Gallery callbacks.' },
				{
					name: 'GetGalleryById / GetAllGalleries',
					description: 'Look up one instance or list every registered id.',
				},
				{ name: 'Dispose', description: 'Tear down the instance.' },
			],
		},
	],
	accessibility: [
		'The grid is purely visual: DOM order is reading order, so screen readers and keyboard users move through the items in list order regardless of the column count.',
		'Give each item one focusable element (a link or button) when the whole tile is clickable, rather than making the wrapper itself clickable.',
		'Every image inside an item needs alt text — descriptive when it carries meaning, empty when the tile text already says it.',
		'Keep RowItemsPhone at 1 or 2 so tap targets and text stay large enough on narrow screens.',
	],
	related: [
		{ name: 'Columns', storyId: 'patterns-adaptive-columns--docs' },
		{ name: 'Master Detail', storyId: 'patterns-adaptive-masterdetail--docs' },
		{ name: 'Card Sectioned', storyId: 'patterns-content-card-sectioned--docs' },
		{ name: 'Carousel', storyId: 'patterns-content-carousel--docs' },
	],
};
