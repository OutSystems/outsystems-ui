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
		 * @param {Event.GestureEvent.onGestureStart} onStartCallback
		 * @param {Event.GestureEvent.onGestureMove} onMoveCallback
		 * @param {Event.GestureEvent.onGestureEnd} [onEndCallback]
		 * @memberof DragEvent
		 */
		public setEvents(
			onStartCallback: Event.GestureEvent.onGestureStart,
			onMoveCallback: Event.GestureEvent.onGestureMove,
			onEndCallback?: Event.GestureEvent.onGestureEnd
		): void {
			super.setCallbacks(onStartCallback, onMoveCallback, onEndCallback);
			super.setEventListeners();
		}
	}
}
