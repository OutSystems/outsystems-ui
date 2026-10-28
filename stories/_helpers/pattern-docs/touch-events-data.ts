import type { PatternDocMeta } from './types';

export const TOUCH_EVENTS_DOC: PatternDocMeta = {
	name: 'Touch Events',
	category: 'Utilities',
	lede: 'Streams the raw touch gesture on any widget — start point, live position and offsets, release — so you can build drag, draw and custom-gesture interactions.',
	overview:
		'Touch Events has no markup of its own. Point it at a widget through WidgetId and it attaches touchstart, touchmove and touchend listeners to that element. Start reports where the finger lands, Move fires continuously with the current position and the offset from the start point, and End adds how long the gesture took. PreventDefaults (True by default) stops the browser from scrolling or zooming while the gesture runs.',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/utilities/touch_events/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/utilities/touch_events/',
	liveStoryId: 'patterns-utilities-touchevents--basic-usage',
	whenToUse: [
		'Dragging an element with the finger — reorder handles, sliders, signature or drawing pads, image pan.',
		'Custom gestures that need distance or speed: pull-to-refresh thresholds, swipe-to-reveal with a live preview.',
		'Mobile-only interactions where the native touch coordinates are needed, with the page scroll suppressed on that area.',
	],
	whenNotToUse: [
		'When you only need the direction of a completed gesture — Swipe Events wraps this block and raises SwipeUp, SwipeDown, SwipeLeft and SwipeRight for you.',
		'Content that already carries its own gesture handling, such as Carousel, Range Slider or Bottom Sheet.',
	],
	anatomy: {
		tree: `<!-- Touch Events renders nothing: it listens on the widget named by WidgetId -->
<div id="TouchArea" style="touch-action: none;"> <!-- the target Container (WidgetId = TouchArea.Id) -->
  <!-- your content -->
</div>`,
	},
	properties: [
		{
			title: 'Touch Events',
			rows: [
				{
					name: 'WidgetId',
					type: 'Text',
					description:
						'Id of the widget that will receive the touch gesture (for example Container.Id). The listeners are attached to that element.',
				},
				{
					name: 'PreventDefaults',
					type: 'Boolean',
					defaultValue: 'True',
					description:
						'When True, the default browser behaviour of the touch events (scrolling, zooming, text selection) is prevented while the gesture is on the widget.',
				},
			],
		},
	],
	events: [
		{ name: 'Start', description: 'Fires when the touch begins, with the X and Y page coordinates of the finger.' },
		{
			name: 'Move',
			description:
				'Fires on every touch move with the current X and Y, the OffsetX and OffsetY from the start point, and the native event.',
		},
		{
			name: 'End',
			description:
				'Fires when the finger lifts, with the final X and Y, the total OffsetX and OffsetY, and the TimeTaken in milliseconds.',
		},
	],
	apiSections: [
		{
			title: 'Touch Events API',
			rows: [
				{ name: 'Create', description: 'Register a new TouchEvents instance bound to a WidgetId.' },
				{ name: 'Initialize', description: 'Attach the touchstart, touchmove and touchend listeners.' },
				{ name: 'RegisterCallback', description: 'Subscribe to Start, Move or End.' },
				{ name: 'ChangeProperty', description: 'Update a runtime property.' },
				{
					name: 'GetTouchEventsById / GetAllTouchEvents',
					description: 'Look up one instance or list every registered id.',
				},
				{ name: 'Dispose', description: 'Remove the listeners and release the instance.' },
			],
		},
	],
	accessibility: [
		'Touch gestures are invisible to keyboard, screen-reader and mouse users. Offer the same outcome through buttons or inputs (for example arrow buttons next to a draggable handle).',
		'Give the target widget an accessible name and role when it behaves like a control, and reflect its state with aria-live or aria-valuenow updates as the gesture progresses.',
		'Keep PreventDefaults True on surfaces that are dragged, otherwise the page scrolls under the finger; set it to False on scrollable content where the gesture is only observed.',
		'Set touch-action: none on the target to stop browser pan and zoom gestures from competing with yours.',
	],
	related: [
		{ name: 'Swipe Events', storyId: 'patterns-utilities-swipeevents--docs' },
		{ name: 'Range Slider', storyId: 'patterns-interaction-rangeslider--docs' },
		{ name: 'Bottom Sheet', storyId: 'patterns-interaction-bottomsheet--docs' },
	],
};
