import type { StudioRecipe } from '../studio-recipe';

const TRIP_PHOTOS = [
	'Aurora over the fjord',
	'Basalt cliffs at low tide',
	'Cedar valley in the fog',
	'Dunes after the rain',
];

const LIGHTBOX_HOST = {
	label: 'Lightbox block (Utilities folder)',
	steps: [
		'Drag the Lightbox block from the Utilities folder onto the screen once, outside the images — it hosts the viewer.',
	],
};

export const LIGHTBOX_IMAGE_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Lightbox Image',
		groupProps: { Title: TRIP_PHOTOS[0], Group: 'trip-photos', ImageZoom: 2 },
		publishStep:
			'Publish the app and click a thumbnail: the viewer opens on that photo and the arrows move through the group.',
		items: [
			{
				placeholders: [
					{
						label: 'Thumbnail placeholder',
						steps: [
							'Drag an Image widget into the Thumbnail placeholder and set its Image to the photo.',
							'Set the Image widget Width to 220px.',
						],
					},
					{
						label: 'Group',
						steps: [
							`Repeat the block for each photo (${TRIP_PHOTOS.length} here) with its own Title and the same Group, so they open as one gallery.`,
						],
					},
					LIGHTBOX_HOST,
				],
			},
		],
	},
	singleImage: {
		kind: 'widget',
		widgetName: 'Lightbox Image',
		groupProps: { Title: TRIP_PHOTOS[0], Group: '', ImageZoom: 2 },
		publishStep:
			'Publish the app and click the thumbnail: the viewer opens on the photo alone, with its title as caption.',
		items: [
			{
				placeholders: [
					{
						label: 'Thumbnail placeholder',
						steps: [
							'Drag an Image widget into the Thumbnail placeholder and set its Image to the photo.',
							'Set the Image widget Width to 320px.',
						],
					},
					LIGHTBOX_HOST,
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
