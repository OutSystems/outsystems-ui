import type { StudioRecipe } from '../studio-recipe';

export const TOOLTIP_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Tooltip',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Tooltip block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
