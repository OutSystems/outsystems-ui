// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.GestureEvent {
	/**
	 * Class that represents the gesture events.
	 */
	export class DragEvent extends AbstractGestureEvent {
		constructor(target: HTMLElement) {
			super(target);
		}

		/**
		 * Method to set the expected callbacks and add eventListeners to the target element
		 *
		 * @param onStartCallback Function invoked when the gesture starts
		 * @param onMoveCallback Function invoked while the gesture moves
		 * @param [onEndCallback] Function invoked when the gesture ends
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
