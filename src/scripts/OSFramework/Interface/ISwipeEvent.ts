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
		 * @param {CallbacksOLD.onSwipeDown} swipeDownCallback
		 * @param {CallbacksOLD.onSwipeLeft} swipeLeftCallback
		 * @param {CallbacksOLD.onSwipeRight} swipeRightCallback
		 * @param {CallbacksOLD.onSwipeUp} swipeUpCallback
		 * @memberof ISwipeEvent
		 */
		setGestureEvents(
			swipeDownCallback: CallbacksOLD.onSwipeDown,
			swipeLeftCallback: CallbacksOLD.onSwipeLeft,
			swipeRightCallback: CallbacksOLD.onSwipeRight,
			swipeUpCallback: CallbacksOLD.onSwipeUp
		);
	}
}
