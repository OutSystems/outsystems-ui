import type { PatternDocMeta } from './types';

export const SCROLLABLE_AREA_DOC: PatternDocMeta = {
	name: 'Scrollable Area',
	category: 'Interaction',
	lede: 'A sized container that scrolls its content along one axis — the way to put a row of cards, a chip strip or a tall list inside a fixed region without scrolling the page.',
	overview:
		'Scrollable Area is CSS-only: the block wraps the Content placeholder in a .scrollable-area-content root sized by Width and Height, and Orientation decides which axis overflows. Horizontal keeps the children on a single line (inline-block, spaced by a token gap) so they overflow sideways; Vertical stacks them and scrolls when Height is smaller than the content. ScrollbarStyle only changes how the scrollbar looks.',
	stylingSelector: '.scrollable-area-content',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/scrollable_area/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/scrollable_area/',
	liveStoryId: 'patterns-interaction-scrollablearea--basic-usage',
	whenToUse: [
		'A horizontal strip of cards, thumbnails or filter chips on a phone, where the page should keep scrolling vertically.',
		'A tall list (chat history, activity log) that must stay inside a fixed-height panel next to other content.',
		'A wide table or timeline that would otherwise force the whole layout to overflow.',
	],
	whenNotToUse: [
		'Content that should be browsed one item at a time with arrows and dots — use Carousel.',
		'Grids that should wrap and reflow with the viewport — use Gallery or Columns instead of clipping them.',
	],
	anatomy: {
		tree: `<div data-block="Interaction.ScrollableArea"> <!-- block wrapper; the scrollbar rules key off it -->
  <div class="scrollable-area-content horizontal-scroll compact"
       style="--scrollable-area-height: <Height>; --scrollable-area-width: <Width>;">
    <!-- horizontal-scroll | vertical-scroll from Orientation -->
    <!-- compact | none from ScrollbarStyle (Default adds no class) -->
    <!-- Content placeholder: loose widgets, or a List (.list.list-group) -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Scrollable Area',
			rows: [
				{
					name: 'Orientation',
					type: 'Orientation Identifier',
					defaultValue: 'Horizontal',
					description:
						'Horizontal lays the content on one line and scrolls sideways; Vertical stacks it and scrolls up and down.',
				},
				{
					name: 'Height',
					type: 'Text',
					defaultValue: '""',
					description:
						'Height of the component with its unit (120px, 70%). Mainly for Vertical. If empty, the height of the parent is used.',
				},
				{
					name: 'Width',
					type: 'Text',
					defaultValue: '""',
					description:
						'Width of the component with its unit (360px, 100%). Mainly for Horizontal. If empty, the width of the parent is used.',
				},
				{
					name: 'ScrollbarStyle',
					type: 'ScrollbarStyle Identifier',
					defaultValue: 'Default',
					description:
						'Default keeps the native scrollbar; Compact shows a slim thumb on hover; None hides the scrollbar while the area still scrolls with touch or trackpad gestures. Horizontal scroll is not driven by the mouse wheel.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Scrollable Area root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'The area is a native scroll container: keyboard users can scroll it once it holds a focusable child (a link or button) or is given tabindex="0" through ExtendedClass-driven logic — otherwise it is skipped by Tab.',
		'ScrollbarStyle None removes the only visual cue that there is more content; pair it with a visible affordance (a partially cut-off item, arrows, a count) so sighted users know to swipe.',
		'Horizontal areas do not respond to the mouse wheel — desktop users need a trackpad gesture or the scrollbar, so avoid None for horizontal strips on desktop layouts.',
		'Content inside keeps its own semantics; make sure a long vertical list has a heading or aria-label so screen-reader users know what region they are scrolling.',
	],
	related: [
		{ name: 'Carousel', storyId: 'patterns-content-carousel--docs' },
		{ name: 'Gallery', storyId: 'patterns-adaptive-gallery--docs' },
		{ name: 'Table', storyId: 'patterns-content-table--docs' },
	],
};
