import type { StudioRecipe } from '../studio-recipe';

const TRAIL_CARD_STEPS = [
	'Drag a List widget into the Content placeholder and set its Source to the Trails aggregate.',
	'Inside the list item, drag a Card Sectioned widget; drop an Image bound to Trails.List.Current.Photo into its Image placeholder and Text widgets for the name, length and difficulty.',
] as const;

export const GALLERY_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Gallery',
		groupProps: { RowItemsDesktop: 4, RowItemsTablet: 3, RowItemsPhone: 1, ItemsGap: 'Base' },
		publishStep: 'Publish the app and resize the browser (or preview per device) to watch the grid reflow.',
		items: [{ placeholders: [{ label: 'Content placeholder', steps: [...TRAIL_CARD_STEPS] }] }],
	},
	itemsPerRow: {
		kind: 'widget',
		widgetName: 'Gallery',
		groupProps: { RowItemsDesktop: 3, RowItemsTablet: 3, RowItemsPhone: 1, ItemsGap: 'Base' },
		publishStep:
			'Publish the app; change RowItemsDesktop between 2, 3 and 4 and republish to compare the column counts.',
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							...TRAIL_CARD_STEPS,
							'To compare layouts on one screen, drag one Gallery per column count and set RowItemsDesktop and RowItemsTablet to 2, 3 and 4 respectively.',
						],
					},
				],
			},
		],
	},
	itemsGap: {
		kind: 'widget',
		widgetName: 'Gallery',
		groupProps: { RowItemsDesktop: 3, RowItemsTablet: 2, RowItemsPhone: 1, ItemsGap: 'ExtraLarge' },
		publishStep: 'Publish the app and compare the spacing between tiles against the Base default.',
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							...TRAIL_CARD_STEPS,
							'To compare gaps on one screen, drag one Gallery per value and set ItemsGap to Entities.Space.Small, Entities.Space.Base and Entities.Space.ExtraLarge respectively.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
