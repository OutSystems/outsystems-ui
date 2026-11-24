import type { StudioRecipe } from '../studio-recipe';

export const CAROUSEL_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Carousel',
		groupProps: { ItemsDesktop: 1, Loop: true, Navigation: 'Both', AutoPlay: false },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Add Carousel Item widgets inside the Carousel content area.',
							'Drop content (images, cards, or text) into each item.',
						],
					},
				],
			},
		],
	},
	autoPlay: {
		kind: 'widget',
		widgetName: 'Carousel',
		groupProps: { ItemsDesktop: 1, Loop: true, Navigation: 'Dots', AutoPlay: true },
		items: [
			{
				placeholders: [
					{ label: 'Content placeholder', steps: ['Add at least two Carousel Items with content.'] },
				],
			},
		],
	},
	arrowsOnly: {
		kind: 'widget',
		widgetName: 'Carousel',
		groupProps: { ItemsDesktop: 1, Loop: true, Navigation: 'Arrows', AutoPlay: false },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Add Carousel Item widgets inside the Carousel content area.',
							'Set Navigation to Arrows to show prev/next controls without pagination dots.',
						],
					},
				],
			},
		],
	},
	roundShape: {
		kind: 'widget',
		widgetName: 'Carousel',
		groupProps: { ItemsDesktop: 1, Loop: true, Navigation: 'Both', ExtendedClass: 'shape-round' },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Add Carousel Item widgets inside the Carousel content area.',
							'Set ExtendedClass to shape-round to apply the round shape profile to the carousel.',
						],
					},
				],
			},
		],
	},
	twoItemsInfinite: {
		kind: 'widget',
		widgetName: 'Carousel',
		groupProps: { ItemsDesktop: 2, Loop: true, Navigation: 'Both', AutoPlay: false },
		items: [
			{
				placeholders: [
					{
						label: 'Content placeholder',
						steps: [
							'Add Carousel Item widgets inside the Carousel content area.',
							'Set ItemsDesktop to 2 and Loop to True for an infinite two-up layout.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
