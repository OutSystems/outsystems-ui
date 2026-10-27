import type { StudioRecipe } from '../studio-recipe';

export const FLOATING_CONTENT_RECIPES = {
	bottomRight: {
		kind: 'widget',
		widgetName: 'Floating Content',
		groupProps: { Position: 'BottomRight', UseMargin: true, FullWidth: false, FullHeight: false },
		items: [{ placeholders: [{ label: 'Content placeholder', steps: ['Add the floating panel content (e.g. a Card).'] }] }],
	},
	center: {
		kind: 'widget',
		widgetName: 'Floating Content',
		groupProps: { Position: 'Center', UseMargin: true },
		items: [{ placeholders: [{ label: 'Content placeholder', steps: ['Add centred overlay content.'] }] }],
	},
	fullWidth: {
		kind: 'widget',
		widgetName: 'Floating Content',
		groupProps: { Position: 'Top', UseMargin: false, FullWidth: true },
		items: [{ placeholders: [{ label: 'Content placeholder', steps: ['Add a full-width banner or toolbar.'] }] }],
	},
} satisfies Record<string, StudioRecipe>;
