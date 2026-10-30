import type { StudioRecipe } from '../studio-recipe';

export const PROGRESS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Progress Bar',
		groupProps: { Progress: 60, ProgressColor: 'Primary', Thickness: 12 },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag a Text widget into the Content placeholder with "Storage used · 60% of 50 GB" (or an Expression bound to the same variable as Progress).',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and watch the bar animate from 0 to 60% on load.',
	},
	thickness: {
		kind: 'widget',
		widgetName: 'Progress Bar',
		groupProps: { Progress: 60 },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag three Progress Bars one below the other and set Thickness to 1, 8 and 20.',
							'Leave the Content placeholder empty for a bare track.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and compare the three track heights in the browser.',
	},
	shapes: {
		kind: 'widget',
		widgetName: 'Progress Bar',
		groupProps: { Progress: 60, Thickness: 20 },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag three Progress Bars and set OptionalConfigs.Shape to Entities.Shape.Sharp, Entities.Shape.SoftRounded and Entities.Shape.Rounded.',
							'Leave the Content placeholder empty for a bare track.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and check the end caps of each bar in the browser.',
	},
	progressColors: {
		kind: 'widget',
		widgetName: 'Progress Bar',
		groupProps: { Progress: 60, Thickness: 8 },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag one Progress Bar per colour and set ProgressColor to Entities.Color.Green, Entities.Color.Orange and Entities.Color.Red.',
							'For an arbitrary colour set ProgressColor to TextToIdentifier("#0F766E") or TextToIdentifier("rgb(124, 58, 237)").',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and check each fill picks up the theme colour in the browser.',
	},
} satisfies Record<string, StudioRecipe>;
