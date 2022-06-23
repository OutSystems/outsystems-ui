// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event.GestureEvent {
	export interface IAbstractGestureEvent {
		/**
		 * Target element that receives the event listeners
		 *
		 * @type {HTMLElement}
		 * @memberof IAbstractGestureEvent
		 */
		targetElement: HTMLElement;

		/**
		 * Signature method to unset the gesture events
		 *
		 * @memberof IAbstractGestureEvent
		 */
		unsetTouchEvents(): void;
	}
}
