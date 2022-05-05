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
		constructor(
			target: HTMLElement,
			onStartCallback: Callbacks.Generic,
			onMoveCallback: Callbacks.Generic,
			onEndCallback: Callbacks.Generic
		) {
			super(target, onStartCallback, onMoveCallback, onEndCallback);
		}
	}
}
