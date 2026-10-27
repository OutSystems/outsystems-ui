import type { StudioRecipe } from '../studio-recipe';

export const SCROLLABLE_AREA_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Scrollable Area',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Scrollable Area block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
