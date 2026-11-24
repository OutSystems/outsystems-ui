import type { StudioRecipe } from '../studio-recipe';

const CONTENT_STEPS = [
	'Drag an Expression widget into the Content placeholder, set its Value to 26 and add font-size-display to its Style Classes.',
	'Drag a Text widget into the Content placeholder with "Completed requests".',
	'Drag an Icon widget into the Content placeholder and choose the check icon.',
];

export const COUNTER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Counter',
		groupProps: { BackgroundColor: 'Primary', IsVertical: false, Height: '150' },
		items: [{ placeholders: [{ label: 'Content placeholder', steps: CONTENT_STEPS }] }],
		publishStep: 'Publish the app and check the value, label and icon line up inside the tile.',
	},
	orientation: {
		kind: 'widget',
		widgetName: 'Counter',
		groupProps: { BackgroundColor: 'Primary', Height: '150' },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag two Counters side by side (for example inside a Columns2) and fill both Content placeholders as in Basic usage.',
							'Leave IsVertical False on the first Counter and set it to True on the second.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and compare the row and column layouts in the browser.',
	},
	backgroundColors: {
		kind: 'widget',
		widgetName: 'Counter',
		groupProps: { IsVertical: false, Height: '150' },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag one Counter per colour and set BackgroundColor to Primary, Green and Orange.',
							'Fill each Content placeholder with the value, label and icon as in Basic usage.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and check the text keeps enough contrast on each background.',
	},
} satisfies Record<string, StudioRecipe>;
