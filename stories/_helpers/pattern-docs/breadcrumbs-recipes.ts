import type { StudioRecipe } from '../studio-recipe';

export const BREADCRUMBS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Breadcrumbs',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Breadcrumbs block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
