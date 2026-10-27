import type { StudioRecipe } from '../studio-recipe';

export const SEARCH_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Search',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Search block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
