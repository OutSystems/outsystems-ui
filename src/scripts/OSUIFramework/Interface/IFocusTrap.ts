// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	export interface IFocusTrap {
		/**
		 * Gesture Events Instance
		 *
		 * @type {DynamicElements.Trapping.FocusTrap}
		 * @memberof IFocusTrap
		 */
		focusTrapInstance: DynamicElements.Trapping.FocusTrap;

		/**
		 * Signature Method to add focus trap
		 *
		 * @param {Callbacks.onSwipeDown} swipeDownCallback
		 * @param {Callbacks.onSwipeLeft} swipeLeftCallback
		 * @memberof IFocusTrap
		 */
		setGestureEvents(
			focusTopCallback: Callbacks.OnFocusTopElement,
			focusBottomCallback: Callbacks.OnFocusBottomElement
		);
	}
}
