import type { PatternDocMeta } from './types';

export const BADGE_DOC: PatternDocMeta = {
	name: 'Badge',
	category: 'Numbers',
	lede: 'Compact pill that shows a count — unread messages, pending tasks, items in a cart — right next to the thing it counts.',
	overview:
		'The Badge is CSS-only: the Number parameter renders as text inside a `.badge` root, and Color, Size, Shape and IsLight each map to a utility or modifier class on that root. Place it beside a label, a menu entry or a List Item Content so the count has a subject.',
	stylingSelector: '.badge',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/numbers/badge/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/numbers/badge/',
	liveStoryId: 'patterns-numbers-badge--basic-usage',
	cssApiSlug: 'patterns-numbers-badge',
	whenToUse: [
		'Unread or pending counts beside a navigation entry, a tab title or a list row.',
		'Item totals on a summary (cart items, open tickets) that change as data changes.',
		'A short number that must stand out from the surrounding text at a glance.',
	],
	whenNotToUse: [
		'A count that belongs to an icon — use Icon Badge, which pins the pill to the icon corner.',
		'Text labels or categories — use Tag; the Badge is sized and padded for numbers.',
	],
	anatomy: {
		tree: `<div class="badge border-radius-rounded background-primary OSInline"> <!-- Size → .badge-small | .badge-medium; IsLight → background-{color}-lightest -->
  <span class="OSFillParent">3</span> <!-- Number -->
</div>`,
	},
	properties: [
		{
			title: 'Badge',
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
					description: 'Background color of the Block. Maps to `background-{color}` on the root.',
				},
				{
					name: 'Size',
					type: 'Size',
					defaultValue: 'NullIdentifier()',
					description:
						'Set the size: Medium (`.badge-medium`, 28px) or Small (`.badge-small`, 16px). Leave empty for the default 20px pill.',
				},
				{
					name: 'Shape',
					type: 'Shape',
					defaultValue: 'Rounded',
					description:
						'Set the shape: Rounded, SoftRounded or Sharp — `border-radius-rounded`, `border-radius-soft` or `border-radius-none` on the root.',
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
		'The badge is plain text: the Number is read inline with the content around it, so keep the label it counts right before it ("Inbox 3").',
		'When no visible label precedes the count, add a visually hidden one with the `wcag-hide-text` class ("3 unread messages") so the number is not announced on its own.',
		'IsLight pairs each `-lightest` background with the darker text token of the same family, so contrast stays AA in both the light and the dark theme.',
		'Colour reinforces meaning but must not carry it — the Number is the content; do not rely on Color alone to signal severity.',
	],
	related: [
		{ name: 'Icon Badge', storyId: 'patterns-numbers-iconbadge--docs' },
		{ name: 'Counter', storyId: 'patterns-numbers-counter--docs' },
		{ name: 'Tag', storyId: 'patterns-content-tag--docs' },
		{ name: 'List Item Content', storyId: 'patterns-content-list-item-content--docs' },
	],
};
