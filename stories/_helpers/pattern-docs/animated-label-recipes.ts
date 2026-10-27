import type { StudioRecipe } from '../studio-recipe';

export const ANIMATED_LABEL_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Animated Label',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Animated Label block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
