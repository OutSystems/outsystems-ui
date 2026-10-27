import type { StudioRecipe } from '../studio-recipe';

export const ACTION_SHEET_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Action Sheet',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Action Sheet block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
