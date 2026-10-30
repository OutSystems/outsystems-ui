import type { PatternDocMeta } from './types';

export const VIDEO_DOC: PatternDocMeta = {
	name: 'Video',
	category: 'Utilities',
	lede: 'Plays a video file in the native HTML5 player with no third-party plug-in — ideal for product clips, onboarding tutorials and muted background loops.',
	overview:
		'The pattern root is a <video> element. The runtime appends a <source> built from URL (a direct file URL or a base64 data URL), writes Width, Height, Controls and the OptionalConfigs (Autoplay, Loop, Muted, PosterURL) as attributes, and adds one <track> per Captions entry. The StateChanged event reports Unstarted, Playing, Paused and Ended, and Play, Pause and JumpToTime drive the player from client actions.',
	stylingSelector: '.osui-video',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/video/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/video/',
	liveStoryId: 'patterns-utilities-video--basic-usage',
	whenToUse: [
		'Self-hosted video files (mp4 or webm in Resources, a CDN or a REST endpoint) that must play inside the app with the native controls.',
		'Silent, looping background or hero clips — Autoplay with Muted and Loop and no Controls.',
		'Tutorials and product demos that need captions or a poster frame, or whose playback state should drive other UI (for example a “Next” button enabled on Ended).',
	],
	whenNotToUse: [
		'YouTube, Vimeo or other hosted players — they provide their own embed code; use an iframe or the provider widget instead.',
		'Animated illustrations or short decorative motion — a GIF, Lottie animation or CSS animation is lighter than a video element.',
	],
	anatomy: {
		tree: `<video class="osui-video" controls width="320" height="180" poster="…"> <!-- pattern root; attributes follow the parameters -->
  <source class="osui-video-source" src="…/clip.mp4" type="video/mp4"> <!-- built from URL; type omitted for extension-less or data URLs -->
  <track class="osui-video-track" kind="captions" srclang="en" src="…/clip.en.vtt" label="English"> <!-- one per Captions entry -->
</video>`,
	},
	properties: [
		{
			title: 'Video',
			rows: [
				{
					name: 'URL',
					type: 'Text',
					description:
						'URL of the video file, preferably mp4 or webm. Must be a direct file, not a YouTube or Vimeo page. A base64 data URL is also accepted.',
				},
				{
					name: 'Controls',
					type: 'Boolean',
					defaultValue: 'True',
					description:
						'Shows the native player controls. On mobile the controls are always enabled regardless of this value.',
				},
				{
					name: 'Width',
					type: 'Text',
					defaultValue: '""',
					description: 'Width of the video in pixels or percentage. Empty keeps the original video width.',
				},
				{
					name: 'Height',
					type: 'Text',
					defaultValue: '""',
					description: 'Height of the video in pixels or percentage. Empty keeps the original video height.',
				},
				{
					name: 'Captions',
					type: 'VideoCaptions List',
					defaultValue: 'empty list',
					description:
						'Caption tracks available in the player, each with LanguageCode, SourceFile (a .vtt file) and Label. Empty by default.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the <video> element. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'OptionalConfigs',
			rows: [
				{
					name: 'OptionalConfigs.Autoplay',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'Starts playback as soon as the video can play. Browsers only honour it when the video is muted, so pair it with Muted.',
				},
				{
					name: 'OptionalConfigs.Loop',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'Restarts playback from the beginning when the video ends.',
				},
				{
					name: 'OptionalConfigs.Muted',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'Starts the video with the audio muted.',
				},
				{
					name: 'OptionalConfigs.PosterURL',
					type: 'Text',
					defaultValue: '""',
					description: 'Image shown in the player before playback starts.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires once the Video instance is ready.' },
		{
			name: 'StateChanged',
			description: 'Fires with the VideoState — Unstarted, Playing, Paused or Ended — whenever playback changes.',
		},
	],
	apiSections: [
		{
			title: 'Video API',
			rows: [
				{ name: 'Create', description: 'Register a new Video instance.' },
				{
					name: 'Initialize',
					description: 'Build the <source> and <track> elements and apply the attributes.',
				},
				{ name: 'Play', description: 'Start or resume playback.' },
				{ name: 'Pause', description: 'Pause playback.' },
				{ name: 'JumpToTime', description: 'Seek to a position, in seconds.' },
				{ name: 'GetState', description: 'Return the current VideoState.' },
				{
					name: 'ChangeProperty',
					description:
						'Update a runtime property (URL, Controls, Autoplay, Loop, Muted, PosterURL, Width, Height).',
				},
				{ name: 'RegisterCallback', description: 'Subscribe to StateChanged.' },
				{
					name: 'GetVideoById / GetAllVideos',
					description: 'Look up one instance or list every registered id.',
				},
				{ name: 'Dispose', description: 'Tear down the instance.' },
			],
		},
	],
	accessibility: [
		'Keep Controls True whenever the video carries information: the native controls are keyboard operable (Space to play/pause, arrow keys to seek, M to mute) and exposed to assistive tech.',
		'Provide Captions for spoken content — each entry becomes a <track kind="captions"> the user can switch on from the player.',
		'Autoplaying video must be Muted; avoid it for content users need to follow, and offer a way to pause a looping background clip.',
		'Add a descriptive Text or aria-label near the player and set a PosterURL so the purpose of the video is clear before it plays.',
	],
	related: [
		{ name: 'Lightbox Image', storyId: 'patterns-interaction-lightboximage--docs' },
		{ name: 'Carousel', storyId: 'patterns-content-carousel--docs' },
		{ name: 'Card Background', storyId: 'patterns-content-card-background--docs' },
	],
};
