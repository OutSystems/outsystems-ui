import type { StudioRecipe } from '../studio-recipe';

export const RATING_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Rating',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Rating block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
