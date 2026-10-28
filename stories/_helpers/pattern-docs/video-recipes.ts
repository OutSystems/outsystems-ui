import type { StudioRecipe } from '../studio-recipe';

const VIDEO_SOURCE_STEPS = [
	'Upload the mp4 or webm file to the module Resources (Deploy Action: Deploy to Target Directory) or host it on a CDN.',
	'Set URL to the file path, for example "/MyApp/videos/product-tour.mp4". The URL must point at the video file itself, not a YouTube or Vimeo page.',
] as const;

export const VIDEO_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Video',
		groupProps: { URL: '/MyApp/videos/product-tour.mp4', Controls: true },
		publishStep: 'Publish the app and play the video with the native controls in the browser.',
		items: [
			{
				placeholders: [
					{ label: 'Video source', steps: [...VIDEO_SOURCE_STEPS] },
					{
						label: 'StateChanged event (optional)',
						steps: [
							'Create a handler for StateChanged and assign a local Text variable the VideoState parameter to react to Playing, Paused or Ended.',
						],
					},
				],
			},
		],
	},
	posterImage: {
		kind: 'widget',
		widgetName: 'Video',
		groupProps: {
			URL: '/MyApp/videos/product-tour.mp4',
			Controls: true,
			'OptionalConfigs.PosterURL': '/MyApp/images/product-tour-poster.jpg',
		},
		publishStep: 'Publish the app and confirm the poster image shows until playback starts.',
		items: [
			{
				placeholders: [
					{ label: 'Video source', steps: [...VIDEO_SOURCE_STEPS] },
					{
						label: 'Poster image',
						steps: [
							'Add the still image to Resources (or Images) and set OptionalConfigs.PosterURL to its path.',
						],
					},
				],
			},
		],
	},
	autoplayLoop: {
		kind: 'widget',
		widgetName: 'Video',
		groupProps: {
			URL: '/MyApp/videos/hero-loop.mp4',
			Controls: false,
			'OptionalConfigs.Autoplay': true,
			'OptionalConfigs.Muted': true,
			'OptionalConfigs.Loop': true,
		},
		publishStep: 'Publish the app and confirm the clip starts on its own, silently, and repeats.',
		items: [
			{
				placeholders: [
					{ label: 'Video source', steps: [...VIDEO_SOURCE_STEPS] },
					{
						label: 'Autoplay rules',
						steps: [
							'Keep OptionalConfigs.Muted True whenever Autoplay is True — browsers block autoplay with sound.',
							'Set Controls to False only for decorative clips; keep them for content the user needs to follow.',
						],
					},
				],
			},
		],
	},
	fixedSize: {
		kind: 'widget',
		widgetName: 'Video',
		groupProps: { URL: '/MyApp/videos/product-tour.mp4', Controls: true, Width: '320', Height: '180' },
		publishStep: 'Publish the app and confirm the player renders at 320 × 180 pixels.',
		items: [
			{
				placeholders: [
					{ label: 'Video source', steps: [...VIDEO_SOURCE_STEPS] },
					{
						label: 'Size',
						steps: [
							'Set Width and Height in pixels or percentage ("320" / "180", or "100%"); leave them empty to keep the original video dimensions.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
