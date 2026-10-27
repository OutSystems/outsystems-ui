import type { StudioRecipe } from '../studio-recipe';

export const LIGHTBOX_IMAGE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Lightbox Image',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Lightbox Image block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
