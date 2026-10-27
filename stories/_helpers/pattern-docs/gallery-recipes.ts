import type { StudioRecipe } from '../studio-recipe';

export const GALLERY_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Gallery',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Gallery block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
