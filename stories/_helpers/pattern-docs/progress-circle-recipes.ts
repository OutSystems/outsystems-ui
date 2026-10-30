import type { StudioRecipe } from '../studio-recipe';

export const PROGRESS_CIRCLE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Progress Circle',
		groupProps: { Progress: 72, Size: '120px', Thickness: 8 },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag a Text widget into the Content placeholder with "72%" (or an Expression bound to the same variable as Progress) — it is centred over the ring.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and watch the arc animate from 0 to 72% on load.',
	},
	sizes: {
		kind: 'widget',
		widgetName: 'Progress Circle',
		groupProps: { Progress: 60, Thickness: 8 },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag three Progress Circles side by side; place the first inside a Container with Width 140px and leave its Size "auto".',
							'Set Size to "80px" on the second and "200px" on the third.',
							'Leave the Content placeholders empty for bare rings.',
						],
					},
				],
			},
		],
		publishStep:
			'Publish the app and check the first ring follows its container while the other two keep their own diameter.',
	},
	thickness: {
		kind: 'widget',
		widgetName: 'Progress Circle',
		groupProps: { Progress: 60, Size: 'auto' },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag three Progress Circles into Containers of the same width and set Thickness to 1, 8 and 20.',
							'Leave the Content placeholders empty for bare rings.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and compare the three stroke widths in the browser.',
	},
	shapes: {
		kind: 'widget',
		widgetName: 'Progress Circle',
		groupProps: { Progress: 60, Size: 'auto', Thickness: 20 },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag three Progress Circles into Containers of the same width and set OptionalConfigs.Shape to Entities.Shape.Sharp, Entities.Shape.SoftRounded and Entities.Shape.Rounded.',
							'Leave the Content placeholders empty for bare rings.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and check the arc ends: square caps on Sharp, round caps on the other two.',
	},
} satisfies Record<string, StudioRecipe>;
