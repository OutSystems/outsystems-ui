import type { StudioRecipe } from '../studio-recipe';

export const MONTH_PICKER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Month Picker',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Month Picker block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
