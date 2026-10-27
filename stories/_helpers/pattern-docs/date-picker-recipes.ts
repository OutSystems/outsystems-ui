import type { StudioRecipe } from '../studio-recipe';

export const DATE_PICKER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Date Picker',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Date Picker block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
