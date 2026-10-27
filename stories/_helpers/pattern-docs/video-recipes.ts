import type { StudioRecipe } from '../studio-recipe';

export const VIDEO_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Video',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: ['Drag the Video block onto the screen.', 'Configure its properties in the properties panel.'],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
