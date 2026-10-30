import type { StudioRecipe } from '../studio-recipe';

export const FLIP_CONTENT_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Flip Content',
		groupProps: { FlipSelf: true, IsFlipped: false },
		items: [
			{
				placeholders: [
					{ label: 'Front placeholder', steps: ['Add content for the visible front face.'] },
					{ label: 'Back placeholder', steps: ['Add content for the back face revealed on flip.'] },
				],
			},
		],
	},
	startsFlipped: {
		kind: 'widget',
		widgetName: 'Flip Content',
		groupProps: { FlipSelf: true, IsFlipped: true },
		items: [{ placeholders: [{ label: 'Front / Back placeholders', steps: ['Configure both faces as needed.'] }] }],
	},
} satisfies Record<string, StudioRecipe>;
