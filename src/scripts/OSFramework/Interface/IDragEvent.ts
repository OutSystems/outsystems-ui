// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
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
		 * @param {Event.GestureEvent.gestureStart} onGestureStart
		 * @param {Event.GestureEvent.gestureMove} onGestureMove
		 * @param {Event.GestureEvent.gestureEnd} onGestureEnd
		 * @memberof IDragEvent
		 */
		setGestureEvents(
			onGestureStart: Event.GestureEvent.Callbacks.gestureStart,
			onGestureMove: Event.GestureEvent.Callbacks.gestureMove,
			onGestureEnd: Event.GestureEvent.Callbacks.gestureEnd
		);
	}
}
