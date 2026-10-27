import type { StudioRecipe } from '../studio-recipe';

export const COUNTER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Counter',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Counter block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
