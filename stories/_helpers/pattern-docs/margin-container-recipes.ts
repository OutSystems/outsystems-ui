import type { StudioRecipe } from '../studio-recipe';

export const MARGIN_CONTAINER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Margin Container',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Margin Container block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
