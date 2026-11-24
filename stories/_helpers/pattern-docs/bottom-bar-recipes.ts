import type { StudioRecipe } from '../studio-recipe';

const BASIC_ITEMS = [
	{ label: 'Home', icon: 'house' },
	{ label: 'Search', icon: 'magnifying-glass' },
	{ label: 'Alerts', icon: 'bell' },
	{ label: 'Profile', icon: 'user' },
] as const;

const LONG_LABEL_ITEMS = [
	{ label: 'Home', icon: 'house' },
	{ label: 'Notifications centre', icon: 'bell' },
	{ label: 'Account settings', icon: 'gear' },
	{ label: 'Help and support', icon: 'question' },
] as const;

const itemList = (items: ReadonlyArray<{ label: string; icon: string }>): string =>
	items.map((item) => `${item.label} (${item.icon})`).join(', ');

export const BOTTOM_BAR_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Bottom Bar Item',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Bottom placeholder (screen layout)',
						steps: [
							`Drag one Bottom Bar Item per destination into the Bottom placeholder of the layout: ${itemList(BASIC_ITEMS)}.`,
						],
					},
					{
						label: 'Icon placeholder',
						steps: [
							'Drag an Icon widget into the Icon placeholder of each item and pick the icon named above.',
						],
					},
					{
						label: 'Text placeholder',
						steps: ['Drag a Text widget into the Text placeholder and set Text to the destination name.'],
					},
				],
			},
		],
		publishStep:
			'Publish the app and open it on a phone (or the phone preview) to see the bar pinned to the bottom edge.',
	},
	activeItem: {
		kind: 'widget',
		widgetName: 'Bottom Bar Item',
		groupProps: { ExtendedClass: 'active' },
		items: [
			{
				placeholders: [
					{
						label: 'Bottom placeholder (screen layout)',
						steps: [
							`Drag one Bottom Bar Item per destination into the Bottom placeholder of the layout: ${itemList(BASIC_ITEMS)}.`,
							'Set ExtendedClass to "active" only on the item of the current screen (Alerts here); leave it blank on the others.',
						],
					},
					{
						label: 'Icon and Text placeholders',
						steps: ['Drag an Icon widget into Icon and a Text widget into Text, as in Basic usage.'],
					},
				],
			},
		],
		publishStep: 'Publish the app and check that the Alerts item renders in the primary colour.',
	},
	longLabels: {
		kind: 'widget',
		widgetName: 'Bottom Bar Item',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Bottom placeholder (screen layout)',
						steps: [
							`Drag one Bottom Bar Item per destination into the Bottom placeholder of the layout: ${itemList(LONG_LABEL_ITEMS)}.`,
						],
					},
					{
						label: 'Text placeholder',
						steps: [
							'Drag a Text widget into the Text placeholder and set Text to the full label — the bar ellipsizes whatever does not fit.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and resize the phone preview to see the labels truncate instead of wrapping.',
	},
} satisfies Record<string, StudioRecipe>;
