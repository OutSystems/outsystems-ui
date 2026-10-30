import type { PatternDocMeta } from './types';

export const MARGIN_CONTAINER_DOC: PatternDocMeta = {
	name: 'Margin Container',
	category: 'Utilities',
	lede: 'Wraps content in the theme screen padding so it never touches the viewport edge — the quickest way to inset a block inside an edge-to-edge layout.',
	overview:
		'A CSS-only wrapper that applies symmetrical padding on all four sides from the spacing tokens: $token-scale-600 by default, tighter on native tablet and phone layouts. Everything you drop into the MarginContainer placeholder is inset by that amount.',
	stylingSelector: '.margin-container',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/utilities/margin_container/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/utilities/margin_container/',
	liveStoryId: 'patterns-utilities-margincontainer--basic-usage',
	whenToUse: [
		'Screens whose layout content area is edge-to-edge (full-bleed images, maps, lists) but whose text and forms need the standard inset.',
		'Keeping the same screen padding across screens without repeating padding utility classes on every container.',
		'Native mobile apps — the padding adapts to the phone and tablet layouts automatically.',
	],
	whenNotToUse: [
		'Content that should bleed to the edge, such as a hero image, a full-width table or a Carousel.',
		'Grouping related content with a title — Section or Card already carry their own padding.',
	],
	anatomy: {
		tree: `<div class="margin-container"> <!-- padding: $token-scale-600 on every side -->
  <!-- MarginContainer placeholder -->
</div>`,
	},
	properties: [
		{
			title: 'Margin Container',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Margin Container root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'Purely presentational — a plain div with padding, no roles or ARIA, so it does not change the reading order of its content.',
		'The inset gives touch targets near the screen edge some breathing room on phones, where the padding drops to $token-scale-400.',
		'Do not rely on it for layout landmarks; add a heading or a Section inside when the content is a distinct region.',
	],
	related: [
		{ name: 'Center Content', storyId: 'patterns-utilities-centercontent--docs' },
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
		{ name: 'Columns', storyId: 'patterns-adaptive-columns--docs' },
	],
};
