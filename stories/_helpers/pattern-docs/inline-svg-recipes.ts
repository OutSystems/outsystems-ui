import type { StudioRecipe } from '../studio-recipe';

export const INLINE_SVG_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Inline Svg',
		groupProps: {},
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Drag the Inline Svg block onto the screen.',
							'Configure its properties in the properties panel.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
