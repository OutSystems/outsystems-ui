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
		 * @param {CallbacksOLD.onGestureStart} onStartCallback
		 * @param {CallbacksOLD.onGestureMove} onMoveCallback
		 * @param {CallbacksOLD.onGestureEnd} [onEndCallback]
		 * @memberof DragEvent
		 */
		public setEvents(
			onStartCallback: CallbacksOLD.onGestureStart,
			onMoveCallback: CallbacksOLD.onGestureMove,
			onEndCallback?: CallbacksOLD.onGestureEnd
		): void {
			super.setCallbacks(onStartCallback, onMoveCallback, onEndCallback);
			super.setEventListeners();
		}
	}
}
