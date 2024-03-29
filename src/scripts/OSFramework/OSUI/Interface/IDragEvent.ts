// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
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
		 * @param {Event.GestureEvent.Callbacks.GestureStart} gestureStart
		 * @param {Event.GestureEvent.Callbacks.GestureMove} gestureMove
		 * @param {Event.GestureEvent.Callbacks.GestureEnd} gestureEnd
		 * @memberof OSFramework.Interface.IDragEvent
		 */
		setGestureEvents(
			onGestureStart: Event.GestureEvent.Callbacks.GestureStart,
			onGestureMove: Event.GestureEvent.Callbacks.GestureMove,
			onGestureEnd: Event.GestureEvent.Callbacks.GestureEnd
		);
	}
}
