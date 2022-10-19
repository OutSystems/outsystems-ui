// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	export interface ISwipeEvent extends IGestureEvent {
		/**
		 * Gesture Events Instance
		 *
		 * @type {Event.GestureEvent.SwipeEvent}
		 * @memberof OSFramework.Interface.ISwipeEvent
		 */
		gestureEventInstance: Event.GestureEvent.SwipeEvent;

		/**
		 * Signature Method to add swipe events
		 *
		 * @param {Event.GestureEvent.swipeDown} swipeDownCallback
		 * @param {Event.GestureEvent.swipeLeft} swipeLeftCallback
		 * @param {Event.GestureEvent.swipeRight} swipeRightCallback
		 * @param {Event.GestureEvent.swipeUp} swipeUpCallback
		 * @memberof OSFramework.Interface.ISwipeEvent
		 */
		setGestureEvents(
			swipeDownCallback: Event.GestureEvent.Callbacks.SwipeDown,
			swipeLeftCallback: Event.GestureEvent.Callbacks.SwipeLeft,
			swipeRightCallback: Event.GestureEvent.Callbacks.SwipeRight,
			swipeUpCallback: Event.GestureEvent.Callbacks.SwipeUp
		);
	}
}
