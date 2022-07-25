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
		 * @param {Event.GestureEvent.onGestureStart} onGestureStart
		 * @param {Event.GestureEvent.onGestureMove} onGestureMove
		 * @param {Event.GestureEvent.onGestureEnd} onGestureEnd
		 * @memberof IDragEvent
		 */
		setGestureEvents(
			onGestureStart: Event.GestureEvent.onGestureStart,
			onGestureMove: Event.GestureEvent.onGestureMove,
			onGestureEnd: Event.GestureEvent.onGestureEnd
		);
	}
}
