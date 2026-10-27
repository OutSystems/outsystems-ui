import type { StudioRecipe } from '../studio-recipe';

export const TIME_PICKER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Time Picker',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Time Picker block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
