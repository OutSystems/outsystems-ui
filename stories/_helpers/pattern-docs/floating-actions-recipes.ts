import type { StudioRecipe } from '../studio-recipe';

export const FLOATING_ACTIONS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Floating Actions',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Floating Actions block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
