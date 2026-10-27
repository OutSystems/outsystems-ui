import type { StudioRecipe } from '../studio-recipe';

export const DROPDOWN_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Dropdown',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Dropdown block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
