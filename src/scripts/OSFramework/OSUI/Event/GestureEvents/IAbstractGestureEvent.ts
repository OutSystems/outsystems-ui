// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.GestureEvent {
	export interface IAbstractGestureEvent {
		/**
		 * Target element that receives the event listeners
		 *
		 * @type {HTMLElement}
		 * @memberof OSFramework.Event.GestureEvent.IAbstractGestureEvent
		 */
		targetElement: HTMLElement;

		/**
		 * Signature method to unset the gesture events
		 *
		 * @memberof OSFramework.Event.GestureEvent.IAbstractGestureEvent
		 */
		unsetTouchEvents(): void;
	}
}
