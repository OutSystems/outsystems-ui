// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Event.GestureEvent {
	/**
	 * Class that represents the gesture events.
	 *
	 * @export
	 * @class GestureEvent
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class DragEvent extends Event.GestureEvent.AbstractGestureEvent {
		constructor(target: HTMLElement) {
			super(target);
		}

		/**
		 * Method to set the expected callbacks and add eventListeners to the target element
		 *
		 * @param {Event.GestureEvent.Callbacks.gestureStart} onStartCallback
		 * @param {Event.GestureEvent.Callbacks.gestureMove} onMoveCallback
		 * @param {Event.GestureEvent.Callbacks.gestureEnd} [onEndCallback]
		 * @memberof DragEvent
		 */
		public setSwipeEvents(
			onStartCallback: Event.GestureEvent.Callbacks.gestureStart,
			onMoveCallback: Event.GestureEvent.Callbacks.gestureMove,
			onEndCallback?: Event.GestureEvent.Callbacks.gestureEnd
		): void {
			super.setCallbacks(onStartCallback, onMoveCallback, onEndCallback);
			super.setEventListeners();
		}
	}
}
