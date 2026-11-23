import type { StudioRecipe } from '../studio-recipe';

export const SWIPE_EVENTS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Swipe Events',
		groupProps: { WidgetId: 'SwipeArea.Id' },
		publishStep: 'Publish the app and swipe inside the container on a phone or in browser device emulation.',
		items: [
			{
				placeholders: [
					{
						label: 'Target widget',
						steps: [
							'Drag a Container onto the screen and name it SwipeArea; give it a minimum height so there is room to swipe.',
							'Drag a Text widget into the Container and bind it to a local Text variable LastSwipe.',
						],
					},
					{
						label: 'SwipeUp / SwipeDown / SwipeLeft / SwipeRight events',
						steps: [
							'On the Swipe Events block, create a handler for each of the four events.',
							'In each handler, assign LastSwipe the event name (for example "SwipeLeft").',
						],
					},
				],
			},
		],
	},
	swipeToDismiss: {
		kind: 'widget',
		widgetName: 'Swipe Events',
		groupProps: { WidgetId: 'MessageRow.Id' },
		publishStep: 'Publish the app and swipe a message left or right on a phone or in browser device emulation.',
		items: [
			{
				placeholders: [
					{
						label: 'Target widget',
						steps: [
							'Drag a List widget onto the screen bound to your Messages aggregate.',
							'Inside the list item, drag a Container named MessageRow with the message content; drop the Swipe Events block inside the same list item so there is one per row.',
						],
					},
					{
						label: 'SwipeLeft / SwipeRight events',
						steps: [
							'Create a handler for SwipeLeft and SwipeRight on the Swipe Events block.',
							'In the handler, call your Archive action with Messages.List.Current.Id and refresh the aggregate; leave SwipeUp and SwipeDown unhandled.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
