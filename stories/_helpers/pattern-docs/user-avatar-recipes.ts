import type { StudioRecipe } from '../studio-recipe';

export const USER_AVATAR_RECIPES = {
	initials: {
		kind: 'widget',
		widgetName: 'User Avatar',
		groupProps: { Name: 'John Doe', Color: 'Primary', Size: 'Medium', Shape: 'Rounded', IsLight: false },
		items: [{ placeholders: [{ label: 'Image', steps: ['Leave Image empty to show initials from Name.'] }] }],
	},
	withImage: {
		kind: 'widget',
		widgetName: 'User Avatar',
		groupProps: { Name: 'Jane Doe', Image: '/assets/placeholder-card.svg', Shape: 'Circle' },
		items: [{ placeholders: [{ label: 'Image', steps: ['Set Image to the user photo URL.'] }] }],
	},
	lightStyle: {
		kind: 'widget',
		widgetName: 'User Avatar',
		groupProps: { Name: 'Alex Kim', Color: 'Primary', IsLight: true, Shape: 'Rounded' },
		items: [{}],
	},
} satisfies Record<string, StudioRecipe>;
