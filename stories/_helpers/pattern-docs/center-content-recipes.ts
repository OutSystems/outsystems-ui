import type { StudioRecipe } from '../studio-recipe';

export const CENTER_CONTENT_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Center Content',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Center Content block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
