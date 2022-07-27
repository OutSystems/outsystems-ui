// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	export interface ISwipeEvent extends IGestureEvent {
		/**
		 * Gesture Events Instance
		 *
		 * @type {Event.GestureEvent.SwipeEvent}
		 * @memberof ISwipeEvent
		 */
		gestureEventInstance: Event.GestureEvent.SwipeEvent;

		/**
		 * Signature Method to add swipe events
		 *
		 * @param {Event.GestureEvent.swipeDown} swipeDownCallback
		 * @param {Event.GestureEvent.swipeLeft} swipeLeftCallback
		 * @param {Event.GestureEvent.swipeRight} swipeRightCallback
		 * @param {Event.GestureEvent.swipeUp} swipeUpCallback
		 * @memberof ISwipeEvent
		 */
		setGestureEvents(
			swipeDownCallback: Event.GestureEvent.Callbacks.swipeDown,
			swipeLeftCallback: Event.GestureEvent.Callbacks.swipeLeft,
			swipeRightCallback: Event.GestureEvent.Callbacks.swipeRight,
			swipeUpCallback: Event.GestureEvent.Callbacks.swipeUp
		);
	}
}
