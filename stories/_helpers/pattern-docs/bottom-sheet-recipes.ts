import type { StudioRecipe } from '../studio-recipe';

const DELIVERY_SLOT_PLACEHOLDERS = [
	{
		label: 'TopBar placeholder',
		steps: ['Drag a Text widget into the TopBar placeholder.', 'Set Text to "Delivery slot".'],
	},
	{
		label: 'Content placeholder',
		steps: [
			'Drag a Text widget into the Content placeholder and set Text to "Pick a window for Thursday, 14 March.".',
			'Drag a List widget below it with one List Item per slot ("08:00 – 10:00", "12:00 – 14:00", "18:00 – 20:00").',
			'Drag a Button widget after the list, set Text to "Confirm slot" and close the sheet in its OnClick action.',
		],
	},
	{
		label: 'Trigger (outside the block)',
		steps: [
			'Drag a Button widget above the block and set Text to "Choose delivery slot".',
			'In its OnClick action, open the sheet with the Bottom Sheet open client action from the OutSystems UI library.',
		],
	},
];

export const BOTTOM_SHEET_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Bottom Sheet',
		groupProps: { Shape: 'SoftRounded', ShowHandler: true },
		publishStep:
			'Publish the app, tap the button and check the sheet slides up from the bottom edge and closes on Confirm.',
		items: [{ placeholders: DELIVERY_SLOT_PLACEHOLDERS }],
	},
	shapes: {
		kind: 'widget',
		widgetName: 'Bottom Sheet',
		groupProps: { Shape: 'Rounded', ShowHandler: true },
		publishStep: 'Publish the app and compare the corner radius of the top edge across the three sheets.',
		items: [
			{
				placeholders: [
					{
						label: 'Shape',
						steps: [
							'Drag one Bottom Sheet per shape and set Shape to SoftRounded, Rounded and Sharp.',
							'Give each one the same TopBar and Content so only the corners differ.',
						],
					},
					DELIVERY_SLOT_PLACEHOLDERS[0],
				],
			},
		],
	},
	dragHandler: {
		kind: 'widget',
		widgetName: 'Bottom Sheet',
		groupProps: { Shape: 'SoftRounded', ShowHandler: false },
		publishStep:
			'Publish the app and check the sheet opens without the drag bar; on a phone, a downward swipe on the header still closes it.',
		items: [
			{
				placeholders: [
					{
						label: 'ShowHandler',
						steps: [
							'Set ShowHandler to False to hide the drag bar.',
							'Keep a second Bottom Sheet with ShowHandler = True to compare.',
						],
					},
					DELIVERY_SLOT_PLACEHOLDERS[0],
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
