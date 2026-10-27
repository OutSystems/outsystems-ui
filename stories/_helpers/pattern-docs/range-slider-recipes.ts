import type { StudioRecipe } from '../studio-recipe';

export const RANGE_SLIDER_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Range Slider',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Range Slider block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
