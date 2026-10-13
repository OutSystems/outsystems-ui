// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	export interface IDragEvent extends IGestureEvent {
		/**
		 * Gesture Events Instance
		 */
		gestureEventInstance: Event.GestureEvent.DragEvent;

		/**
		 * Signature Method to add drag events
		 *
		 * @param onGestureStart Called when the drag gesture starts
		 * @param onGestureMove Called while the drag gesture moves
		 * @param onGestureEnd Called when the drag gesture ends
		 */
		setGestureEvents(
			onGestureStart: Event.GestureEvent.Callbacks.GestureStart,
			onGestureMove: Event.GestureEvent.Callbacks.GestureMove,
			onGestureEnd: Event.GestureEvent.Callbacks.GestureEnd
		);
	}
}
