// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.GestureEvent {
	export interface IGestureEvent {
		/**
		 * Target element that receives the event listeners
		 */
		targetElement: HTMLElement;

		/**
		 * Signature method to unset the gesture events
		 */
		unsetTouchEvents(): void;
	}
}
