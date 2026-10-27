import type { StudioRecipe } from '../studio-recipe';

export const STACKED_CARDS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Stacked Cards',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Stacked Cards block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
