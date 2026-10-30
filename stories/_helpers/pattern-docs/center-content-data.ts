import type { PatternDocMeta } from './types';

export const CENTER_CONTENT_DOC: PatternDocMeta = {
	name: 'Center Content',
	category: 'Utilities',
	lede: 'Vertically centres content inside a sized parent, with optional pinned Top and Bottom slots — ideal for empty states, login screens, and short full-height pages.',
	overview:
		'A CSS-only flex column that fills the height of its parent (or the Height you give it). The Top and Bottom placeholders are pinned to the edges; the Center placeholder takes the remaining space and centres its content on both axes.',
	stylingSelector: '.center-content',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/utilities/center_content/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/utilities/center_content/',
	liveStoryId: 'patterns-utilities-centercontent--basic-usage',
	whenToUse: [
		'Full-height screens with little content — a welcome message, an empty list, a confirmation — that would otherwise sit at the top of a blank page.',
		'Login and onboarding layouts where a logo belongs at the top, the form in the middle, and a footer link at the bottom.',
		'Placeholder states inside a fixed-height panel, such as a sidebar or a card body.',
	],
	whenNotToUse: [
		'Content that should scroll naturally from the top — it will hover in the middle until it is tall enough, which looks like a layout bug.',
		'Empty-state copy with an icon and actions — Blank Slate already centres itself and gives you the slots.',
	],
	anatomy: {
		tree: `<div class="center-content"> <!-- flex column, height 100% (or Height px) -->
  <div class="center-content-header">
    <!-- Top placeholder -->
  </div>
  <div class="center-content-container"> <!-- flex: 1, centres both axes -->
    <!-- Center placeholder -->
  </div>
  <div class="center-content-bottom">
    <!-- Bottom placeholder -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Center Content',
			rows: [
				{
					name: 'Height',
					type: 'Integer',
					defaultValue: '0',
					description:
						'Height of the block, in pixels. If the value is empty (0), it will try to adjust to the parent height.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Center Content root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'Purely presentational — no roles or ARIA are added, so the reading order stays Top, Center, Bottom exactly as the placeholders are ordered.',
		'Keep a heading inside the Center placeholder when the block is the main content of a screen, so screen-reader users can jump to it.',
		'A fixed Height clips nothing by itself, but content taller than it will overflow; prefer the parent-height default on small screens.',
	],
	related: [
		{ name: 'Blank Slate', storyId: 'patterns-content-blankslate--docs' },
		{ name: 'Margin Container', storyId: 'patterns-utilities-margincontainer--docs' },
		{ name: 'Columns', storyId: 'patterns-adaptive-columns--docs' },
	],
};
