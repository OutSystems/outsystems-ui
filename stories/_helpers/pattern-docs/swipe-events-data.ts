import type { PatternDocMeta } from './types';

export const SWIPE_EVENTS_DOC: PatternDocMeta = {
	name: 'Swipe Events',
	category: 'Utilities',
	lede: 'Turns touch gestures on any widget into four directional events — swipe to dismiss, reveal, or navigate without writing gesture code.',
	overview:
		'Swipe Events has no markup of its own. Point it at a widget through WidgetId and the block tracks the touch gesture on that element; when the finger lifts after moving more than 10px at swipe speed, it raises SwipeUp, SwipeDown, SwipeLeft or SwipeRight. Mouse and keyboard interactions never trigger it, so always pair a swipe with a visible control.',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/utilities/swipe_events/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/utilities/swipe_events/',
	liveStoryId: 'patterns-utilities-swipeevents--basic-usage',
	whenToUse: [
		'Swipe-to-dismiss or swipe-to-archive gestures on list rows, cards and notifications in a mobile app.',
		'Moving between steps, photos or days with a horizontal swipe when the content is not already a Carousel or Tabs.',
		'Pull-style gestures (SwipeDown to refresh, SwipeUp to reveal a sheet) on a custom container.',
	],
	whenNotToUse: [
		'Sliding content that Carousel, Tabs with SwipeOnMobile, or Bottom Sheet already handle — those patterns ship their own gestures.',
		'When you need the finger position or distance while the gesture is in progress — use Touch Events, which streams Start, Move and End with coordinates.',
	],
	anatomy: {
		tree: `<!-- Swipe Events renders nothing: it listens on the widget named by WidgetId -->
<div id="SwipeArea" style="touch-action: none;"> <!-- the target Container (WidgetId = SwipeArea.Id) -->
  <!-- your content -->
</div>`,
	},
	properties: [
		{
			title: 'Swipe Events',
			rows: [
				{
					name: 'WidgetId',
					type: 'Text',
					description:
						'Id of the widget that will be swipeable (for example Container.Id). The touch listeners are attached to that element; changing the value at runtime moves them.',
				},
			],
		},
	],
	events: [
		{ name: 'SwipeUp', description: 'Fires after an upward swipe on the target widget.' },
		{ name: 'SwipeDown', description: 'Fires after a downward swipe on the target widget.' },
		{ name: 'SwipeLeft', description: 'Fires after a swipe towards the left.' },
		{ name: 'SwipeRight', description: 'Fires after a swipe towards the right.' },
	],
	apiSections: [
		{
			title: 'Swipe Events API',
			rows: [
				{ name: 'Create', description: 'Register a new SwipeEvents instance bound to a WidgetId.' },
				{ name: 'Initialize', description: 'Attach the touch listeners to the target element.' },
				{ name: 'RegisterCallback', description: 'Subscribe to SwipeUp, SwipeDown, SwipeLeft or SwipeRight.' },
				{
					name: 'GestureEnd',
					description:
						'Classify a finished gesture from its offsets and duration — the platform forwards the Touch Events End values here.',
				},
				{
					name: 'GestureMove',
					description: 'Cancel the default touch-move behaviour while a gesture is tracked.',
				},
				{ name: 'ChangeProperty', description: 'Update WidgetId; listeners move to the new element.' },
				{
					name: 'GetSwipeEventsById / GetAllSwipeEvents',
					description: 'Look up one instance or list every registered id.',
				},
				{ name: 'Dispose', description: 'Remove the listeners and release the instance.' },
			],
		},
	],
	accessibility: [
		'A swipe is touch-only: keyboard, screen-reader and mouse users never raise it. Expose the same action as a visible button or menu entry.',
		'Announce the result of a swipe (for example "Message archived") with an aria-live region, since the gesture itself gives no feedback to assistive tech.',
		'Set touch-action: none (or pan-y) on the target so the browser does not scroll the page while the user is swiping it.',
		'Respect reduced-motion preferences on the animation that follows the swipe; the event fires the same way either way.',
	],
	related: [
		{ name: 'Touch Events', storyId: 'patterns-utilities-touchevents--docs' },
		{ name: 'Carousel', storyId: 'patterns-content-carousel--docs' },
		{ name: 'Bottom Sheet', storyId: 'patterns-interaction-bottomsheet--docs' },
		{ name: 'Tabs', storyId: 'patterns-navigation-tabs--docs' },
	],
};
