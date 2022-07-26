// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	export interface IDragEvent extends IGestureEvent {
		/**
		 * Gesture Events Instance
		 *
		 * @type {Event.GestureEvent.DragEvent}
		 * @memberof IDragEvent
		 */
		gestureEventInstance: Event.GestureEvent.DragEvent;

		/**
		 * Signature Method to add drag events
		 *
		 * @param {Callbacks.onGestureStart} onGestureStart
		 * @param {Callbacks.onGestureMove} onGestureMove
		 * @param {Callbacks.onGestureEnd} onGestureEnd
		 * @memberof IDragEvent
		 */
		setGestureEvents(
			onGestureStart: Callbacks.onGestureStart,
			onGestureMove: Callbacks.onGestureMove,
			onGestureEnd: Callbacks.onGestureEnd
		);
	}
}
