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
		 * @param {Event.GestureEvent.Callbacks.GestureStart} onStartCallback
		 * @param {Event.GestureEvent.Callbacks.GestureMove} onMoveCallback
		 * @param {Event.GestureEvent.Callbacks.GestureEnd} [onEndCallback]
		 * @memberof DragEvent
		 */
		public setSwipeEvents(
			onStartCallback: Event.GestureEvent.Callbacks.GestureStart,
			onMoveCallback: Event.GestureEvent.Callbacks.GestureMove,
			onEndCallback?: Event.GestureEvent.Callbacks.GestureEnd
		): void {
			this.setCallbacks(onStartCallback, onMoveCallback, onEndCallback);
			this.setEventListeners();
		}
	}
}
