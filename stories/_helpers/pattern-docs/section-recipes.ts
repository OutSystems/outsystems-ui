import type { StudioRecipe } from '../studio-recipe';

export const SECTION_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Section',
		groupProps: { UsePadding: true },
		items: [
			{
				placeholders: [
					{ label: 'Title placeholder', steps: ['Set the section heading text.'] },
					{ label: 'Content placeholder', steps: ['Add the grouped content below the title.'] },
				],
			},
		],
	},
	stickyGroup: {
		kind: 'widget',
		widgetName: 'Section Group',
		groupProps: { IsSticky: true },
		publishStep: 'Add multiple Section widgets inside the group, then publish and scroll to test sticky titles.',
		items: [
			{
				placeholders: [
					{
						label: 'Section Group',
						steps: [
							'Drag a Section Group widget.',
							'Add several Section widgets inside the group.',
							'Configure title and content on each Section.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
