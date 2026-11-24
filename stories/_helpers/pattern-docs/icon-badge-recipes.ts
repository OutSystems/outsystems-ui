import type { StudioRecipe } from '../studio-recipe';

const ICON_STEPS = ['Drag an Icon widget into the Icon placeholder, choose the bell icon and set its Size to Large.'];

export const ICON_BADGE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Icon Badge',
		groupProps: { Number: 3, Color: 'Primary', IsLight: false },
		items: [{ placeholders: [{ label: 'Icon placeholder', steps: ICON_STEPS }] }],
		publishStep: 'Publish the app and check the count sits on the top-right corner of the icon.',
	},
	counts: {
		kind: 'widget',
		widgetName: 'Icon Badge',
		groupProps: { Color: 'Primary', IsLight: false },
		items: [
			{
				placeholders: [
					{
						label: 'Icon placeholder',
						steps: [
							'Drag three Icon Badges side by side and set Number to 7, 42 and 128.',
							'Drag a bell Icon widget into each Icon placeholder and set its Size to Large.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and check the badge widens with the digits without wrapping.',
	},
	lightStyle: {
		kind: 'widget',
		widgetName: 'Icon Badge',
		groupProps: { Number: 3, IsLight: true },
		items: [
			{
				placeholders: [
					{
						label: 'Icon placeholder',
						steps: [
							'Drag one Icon Badge per colour and set Color to Primary, Green and Red.',
							'Drag a bell Icon widget into each Icon placeholder and set its Size to Large.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and compare the light tints against the solid default.',
	},
} satisfies Record<string, StudioRecipe>;
