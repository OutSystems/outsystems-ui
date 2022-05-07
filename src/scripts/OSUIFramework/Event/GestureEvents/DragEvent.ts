// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	/**
	 * Class that represents the gesture events.
	 *
	 * @export
	 * @class GestureEvent
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class DragEvent extends Event.GestureEvent implements IGestureEvent {
		constructor(target: HTMLElement) {
			super(target);
		}

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
