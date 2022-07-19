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
		 * @param {Callbacks.onSwipeDown} swipeDownCallback
		 * @param {Callbacks.onSwipeLeft} swipeLeftCallback
		 * @param {Callbacks.onSwipeRight} swipeRightCallback
		 * @param {Callbacks.onSwipeUp} swipeUpCallback
		 * @memberof ISwipeEvent
		 */
		setGestureEvents(
			swipeDownCallback: Callbacks.onSwipeDown,
			swipeLeftCallback: Callbacks.onSwipeLeft,
			swipeRightCallback: Callbacks.onSwipeRight,
			swipeUpCallback: Callbacks.onSwipeUp
		);
	}
}
