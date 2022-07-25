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
		 * @param {CallbacksOLD.onGestureStart} onGestureStart
		 * @param {CallbacksOLD.onGestureMove} onGestureMove
		 * @param {CallbacksOLD.onGestureEnd} onGestureEnd
		 * @memberof IDragEvent
		 */
		setGestureEvents(
			onGestureStart: CallbacksOLD.onGestureStart,
			onGestureMove: CallbacksOLD.onGestureMove,
			onGestureEnd: CallbacksOLD.onGestureEnd
		);
	}
}
