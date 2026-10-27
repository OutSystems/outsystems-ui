import type { StudioRecipe } from '../studio-recipe';

export const SEPARATOR_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Separator',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Separator block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
