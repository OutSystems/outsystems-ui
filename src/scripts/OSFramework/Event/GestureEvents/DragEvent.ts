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
		 * @param {Callbacks.onGestureStart} onStartCallback
		 * @param {Callbacks.onGestureMove} onMoveCallback
		 * @param {Callbacks.onGestureEnd} [onEndCallback]
		 * @memberof DragEvent
		 */
		public setEvents(
			onStartCallback: Callbacks.onGestureStart,
			onMoveCallback: Callbacks.onGestureMove,
			onEndCallback?: Callbacks.onGestureEnd
		): void {
			super.setCallbacks(onStartCallback, onMoveCallback, onEndCallback);
			super.setEventListeners();
		}
	}
}
