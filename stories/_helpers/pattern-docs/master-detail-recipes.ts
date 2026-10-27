import type { StudioRecipe } from '../studio-recipe';

export const MASTER_DETAIL_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Master Detail',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Master Detail block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
