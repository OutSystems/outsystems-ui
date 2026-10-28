import type { PatternDocMeta } from './types';

export const SEPARATOR_DOC: PatternDocMeta = {
	name: 'Separator',
	category: 'Utilities',
	lede: 'A 1px horizontal or vertical rule with configurable colour and surrounding space — splits content visually without the weight of a Section or Card.',
	overview:
		'A CSS-only block: IsVertical picks .separator-horizontal (full width) or .separator-vertical (full height of its wrapper); Color emits a background-* utility class on the rule; Space becomes padding utility classes on the wrapper so the rule keeps its distance from the content around it.',
	stylingSelector: '.separator',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/utilities/separator/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/utilities/separator/',
	liveStoryId: 'patterns-utilities-separator--basic-usage',
	whenToUse: [
		'Dividing groups of fields or rows inside one Card or form where a full Section title would be too much.',
		'Splitting side-by-side content — a toolbar, a header with meta on both sides — with a vertical rule (IsVertical True inside a flex or Columns layout).',
		'Giving a list or detail page visual rhythm with a coloured rule that matches the brand.',
	],
	whenNotToUse: [
		'Grouping content under a heading — use Section, which adds the title and spacing for you.',
		'Separating list rows — List Item Content and tables draw their own row borders.',
	],
	anatomy: {
		tree: `<!-- IsVertical = False -->
<div class="padding-top-base padding-bottom-base"> <!-- Space → padding on the block axis -->
  <div class="separator separator-horizontal background-neutral-4"></div> <!-- Color → background-* -->
</div>

<!-- IsVertical = True (needs a sized, flex parent) -->
<div class="separator-wrapper full-height padding-right-base padding-left-base"> <!-- Space → padding on the inline axis -->
  <div class="separator separator-vertical background-neutral-4"></div>
</div>`,
	},
	properties: [
		{
			title: 'Separator',
			rows: [
				{
					name: 'IsVertical',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'If set as True, the Separator becomes vertical (.separator-vertical, full height of its wrapper). False renders a full-width horizontal rule.',
				},
				{
					name: 'Space',
					type: 'Space',
					defaultValue: 'Base',
					description:
						'Set the space around the Separator line — None, ExtraSmall, Small, Base, Medium, Large, ExtraLarge or XXLarge. Padding above and below when horizontal, left and right when vertical.',
				},
				{
					name: 'Color',
					type: 'Color',
					defaultValue: 'Neutral4',
					description:
						'Set the color of the Separator line. Maps to the matching background-* utility class (for example background-primary).',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Separator rule. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'The rule is a plain div — decorative, with no role, so screen readers skip it. If the division carries meaning, add role="separator" through a Container or custom markup instead.',
		'A 1px neutral line is not required to meet text contrast ratios, but pick a colour at least 3:1 against the background when the separation must be perceivable (the Neutral4 default is tuned for the light surface).',
		'In dark theme the Color utility classes re-map through the tokens, so the rule stays visible without a dedicated override.',
		'A vertical Separator only shows if its parent has a height — in a Columns or flex layout the full-height wrapper stretches to the row.',
	],
	related: [
		{ name: 'Section', storyId: 'patterns-content-section--docs' },
		{ name: 'Columns', storyId: 'patterns-adaptive-columns--docs' },
		{ name: 'List Item Content', storyId: 'patterns-content-list-item-content--docs' },
	],
};
