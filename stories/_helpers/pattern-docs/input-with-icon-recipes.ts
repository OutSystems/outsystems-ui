import type { StudioRecipe } from '../studio-recipe';

export const INPUT_WITH_ICON_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Input With Icon',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Input With Icon block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
