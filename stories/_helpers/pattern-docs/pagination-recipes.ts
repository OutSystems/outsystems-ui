import type { StudioRecipe } from '../studio-recipe';

export const PAGINATION_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Pagination',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Pagination block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
