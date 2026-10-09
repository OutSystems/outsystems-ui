// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	export interface ISwipeEvent extends IGestureEvent {
		/**
		 * Gesture Events Instance
		 */
		gestureEventInstance: Event.GestureEvent.SwipeEvent;

		/**
		 * Signature Method to add swipe events
		 *
		 * @param swipeDownCallback
		 * @param swipeLeftCallback
		 * @param swipeRightCallback
		 * @param swipeUpCallback
		 */
		setGestureEvents(
			swipeDownCallback: Event.GestureEvent.Callbacks.SwipeDown,
			swipeLeftCallback: Event.GestureEvent.Callbacks.SwipeLeft,
			swipeRightCallback: Event.GestureEvent.Callbacks.SwipeRight,
			swipeUpCallback: Event.GestureEvent.Callbacks.SwipeUp
		);
	}
}
