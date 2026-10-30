import type { StudioRecipe } from '../studio-recipe';

export const TAG_RECIPES = {
	defaultStyle: {
		kind: 'widget',
		widgetName: 'Tag',
		groupProps: { Color: 'Primary', Size: 'Medium', Shape: 'Rounded', IsLight: false },
		items: [{ content: 'Label' }],
	},
	lightStyle: {
		kind: 'widget',
		widgetName: 'Tag',
		groupProps: { Color: 'Primary', Size: 'Medium', Shape: 'Rounded', IsLight: true },
		items: [{ content: 'Label' }],
	},
	allColors: {
		kind: 'widget',
		widgetName: 'Tag',
		publishStep: 'Duplicate the Tag for each colour variant you need, then publish.',
		items: [{ placeholders: [{ label: 'Content', steps: ['Set the tag label text on each instance.'] }] }],
	},
} satisfies Record<string, StudioRecipe>;
