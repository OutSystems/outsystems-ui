import type { StudioRecipe } from '../studio-recipe';

export const BOTTOM_BAR_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Bottom Bar',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Bottom Bar block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
