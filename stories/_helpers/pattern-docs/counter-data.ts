import type { PatternDocMeta } from './types';

export const COUNTER_DOC: PatternDocMeta = {
	name: 'Counter',
	category: 'Numbers',
	lede: 'Card-like tile that gives feedback about the current count of something — registered users, open requests, completed tasks — with a value, a label and an icon.',
	overview:
		'The Counter is CSS-only: the root is `.counter.card` carrying the BackgroundColor utility class, and its Content placeholder is a `.center-align` flex row — or a centred column when IsVertical is True. Drop the value, its label and an icon into the placeholder; Height fixes the tile height in pixels.',
	stylingSelector: '.counter',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/numbers/counter/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/numbers/counter/',
	liveStoryId: 'patterns-numbers-counter--basic-usage',
	whenToUse: [
		'KPI tiles at the top of a dashboard — one Counter per metric, side by side in Columns.',
		'A headline total above a list (open tickets, active users) that the list below details.',
		'Feedback after a bulk action, such as how many records were imported or updated.',
	],
	whenNotToUse: [
		'A small inline count beside a label or icon — use Badge or Icon Badge.',
		'Progress toward a target — use Progress Bar or Progress Circle, which show the ratio.',
	],
	anatomy: {
		tree: `<div class="counter card background-primary text-neutral-0" style="height:150px;"> <!-- BackgroundColor, Height -->
  <div class="center-align flex-direction-row"> <!-- IsVertical → flex-direction-column -->
    <!-- Content placeholder -->
    <div class="font-size-display">26</div>
    <div>Completed requests</div>
    <div><i class="icon ph ph-check"></i></div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Counter',
			rows: [
				{
					name: 'BackgroundColor',
					type: 'Color',
					defaultValue: 'Neutral0',
					description: 'Background color of the Block. Maps to `background-{color}` on the root.',
				},
				{
					name: 'IsVertical',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'If set to True, the content will be displayed vertically (`flex-direction-column`); False lays it out in a row with space between.',
				},
				{
					name: 'Height',
					type: 'Text',
					defaultValue: '"100"',
					description: 'Height of the block, use Pixel units. Applied as an inline `height` on the root.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Add custom style classes to the Pattern. Example: `myclass` or `myclass1 myclass2`. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'Value and label are plain text — keep the label inside the Content placeholder so the number is announced with its meaning, not on its own.',
		'A coloured BackgroundColor switches the text to `text-neutral-0`; check contrast for the lighter families (Yellow, Lime, Cyan) and the low neutrals before shipping.',
		'The icon is decorative — give it no accessible name so screen readers announce only the value and label.',
		'Height is a fixed pixel value: make sure the label still fits at 200% zoom or larger font sizes, or leave Height generous.',
	],
	related: [
		{ name: 'Badge', storyId: 'patterns-numbers-badge--docs' },
		{ name: 'Icon Badge', storyId: 'patterns-numbers-iconbadge--docs' },
		{ name: 'Card', storyId: 'patterns-content-card--docs' },
		{ name: 'Progress Bar', storyId: 'patterns-numbers-progress-bar--docs' },
	],
};
