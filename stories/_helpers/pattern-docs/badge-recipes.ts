import type { StudioRecipe } from '../studio-recipe';

export const BADGE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Badge',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Badge block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
