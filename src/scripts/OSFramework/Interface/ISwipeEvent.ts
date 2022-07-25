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
		 * @param {Event.GestureEvent.onSwipeDown} swipeDownCallback
		 * @param {Event.GestureEvent.onSwipeLeft} swipeLeftCallback
		 * @param {Event.GestureEvent.onSwipeRight} swipeRightCallback
		 * @param {Event.GestureEvent.onSwipeUp} swipeUpCallback
		 * @memberof ISwipeEvent
		 */
		setGestureEvents(
			swipeDownCallback: Event.GestureEvent.onSwipeDown,
			swipeLeftCallback: Event.GestureEvent.onSwipeLeft,
			swipeRightCallback: Event.GestureEvent.onSwipeRight,
			swipeUpCallback: Event.GestureEvent.onSwipeUp
		);
	}
}
