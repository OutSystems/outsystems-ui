import type { StudioRecipe } from '../studio-recipe';

export const SUBMENU_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Submenu',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Submenu block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
