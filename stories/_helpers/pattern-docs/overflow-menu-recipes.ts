import type { StudioRecipe } from '../studio-recipe';

export const OVERFLOW_MENU_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Overflow Menu',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Overflow Menu block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
