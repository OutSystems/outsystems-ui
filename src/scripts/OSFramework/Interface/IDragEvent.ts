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
		 * @param {Event.GestureEvent.Callbacks.gestureStart} gestureStart
		 * @param {Event.GestureEvent.Callbacks.gestureMove} gestureMove
		 * @param {Event.GestureEvent.Callbacks.gestureEnd} gestureEnd
		 * @memberof IDragEvent
		 */
		setGestureEvents(
			onGestureStart: Event.GestureEvent.Callbacks.gestureStart,
			onGestureMove: Event.GestureEvent.Callbacks.gestureMove,
			onGestureEnd: Event.GestureEvent.Callbacks.gestureEnd
		);
	}
}
