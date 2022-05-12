// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	export interface ISwipeEventPattern extends IGestureEventPattern {
		/**
		 * Gesture Events Instance
		 *
		 * @type {Event.GestureEvent.SwipeEvent}
		 * @memberof ISwipeEventPattern
		 */
		gestureEventInstance: Event.GestureEvent.SwipeEvent;

		/**
		 * Signature Method to add swipe events
		 *
		 * @param {Callbacks.onSwipeDown} swipeDownCallback
		 * @param {Callbacks.onSwipeLeft} swipeLeftCallback
		 * @param {Callbacks.onSwipeRight} swipeRightCallback
		 * @param {Callbacks.onSwipeUp} swipeUpCallback
		 * @memberof ISwipeEventPattern
		 */
		setGestureEvents(
			swipeDownCallback: Callbacks.onSwipeDown,
			swipeLeftCallback: Callbacks.onSwipeLeft,
			swipeRightCallback: Callbacks.onSwipeRight,
			swipeUpCallback: Callbacks.onSwipeUp
		);
	}
}
