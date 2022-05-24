// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event.GestureEvent {
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
		 * @param {Callbacks.Generic} onStartCallback
		 * @param {Callbacks.Generic} onMoveCallback
		 * @param {Callbacks.Generic} [onEndCallback]
		 * @memberof DragEvent
		 */
		public setEvents(
			onStartCallback: Callbacks.Generic,
			onMoveCallback: Callbacks.Generic,
			onEndCallback?: Callbacks.Generic
		): void {
			super.setCallbacks(onStartCallback, onMoveCallback, onEndCallback);
			super.setEventListeners();
		}
	}
}
