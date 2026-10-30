import type { PatternDocMeta } from './types';

export const ICON_BADGE_DOC: PatternDocMeta = {
	name: 'Icon Badge',
	category: 'Numbers',
	lede: 'An icon with a count pinned to its top-right corner — the notification bell, the cart, the inbox indicator.',
	overview:
		'The Icon Badge is CSS-only: `.icon-badge` is an inline-block, relatively positioned container; the Icon placeholder holds the icon and the Number renders in an absolutely positioned `.badge` offset by `translate(50%, -50%)` onto the corner, with a 1px ring (`--osui-icon-badge-ring-color`) that separates it from the icon.',
	stylingSelector: '.icon-badge',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/numbers/icon_badge/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/numbers/icon_badge/',
	liveStoryId: 'patterns-numbers-iconbadge--basic-usage',
	cssApiSlug: 'patterns-numbers-icon-badge',
	whenToUse: [
		'Notification, inbox or cart icons in the header that carry an unread or item count.',
		'Bottom Bar items that need a pending count on top of their icon.',
		'Any icon-only control whose count would otherwise need a separate label.',
	],
	whenNotToUse: [
		'A count with no icon of its own — use Badge next to a text label.',
		'Icons that only toggle state (favourite, bookmark) — the count adds noise; use the Icon alone.',
	],
	anatomy: {
		tree: `<div class="icon-badge">
  <div><i class="icon ph ph-bell"></i></div> <!-- Icon placeholder -->
  <div class="badge border-radius-rounded background-primary OSInline"> <!-- Color; IsLight → background-{color}-lightest -->
    <span class="OSFillParent">3</span> <!-- Number -->
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Icon Badge',
			rows: [
				{
					name: 'Number',
					type: 'Long Integer',
					description: 'Number to be displayed. Required.',
				},
				{
					name: 'Color',
					type: 'Color',
					defaultValue: 'Primary',
					description: 'Background color of the Block. Maps to `background-{color}` on the inner `.badge`.',
				},
				{
					name: 'IsLight',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'Use the lightest color version for the background and the darker color version for the text (`background-{color}-lightest`).',
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
		'When the icon is the only control (a bell button), give the button an accessible name that includes the count, such as "Notifications, 3 unread" — the badge text alone is just a number.',
		'The count inside `.badge` is plain text read inline with what precedes it; pair it with a visible or `wcag-hide-text` label when it is not inside a named control.',
		'The ring around the badge keeps it legible over any icon colour; IsLight pairs the subtle background with the darker text token of the same family for AA contrast.',
		'Inside a Bottom Bar (`.layout-native .bottom-bar-wrapper`) the icon inherits the bar font size while the badge keeps its 16px minimum, so the count stays readable.',
	],
	related: [
		{ name: 'Badge', storyId: 'patterns-numbers-badge--docs' },
		{ name: 'Counter', storyId: 'patterns-numbers-counter--docs' },
		{ name: 'Bottom Bar', storyId: 'patterns-navigation-bottombar--docs' },
	],
};
