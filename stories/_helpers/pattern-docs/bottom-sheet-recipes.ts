import type { StudioRecipe } from '../studio-recipe';

export const BOTTOM_SHEET_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Bottom Sheet',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Bottom Sheet block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
