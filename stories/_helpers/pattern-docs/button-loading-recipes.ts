import type { StudioRecipe } from '../studio-recipe';

export const BUTTON_LOADING_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Button Loading',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Button Loading block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
