// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	export interface IFocusTrap {
		/**
		 * Focus Trap Instance
		 *
		 * @type {DynamicElements.Trapping.FocusTrap}
		 * @memberof IFocusTrap
		 */
		focusTrapInstance: DynamicElements.Trapping.FocusTrap;

		/**
		 * Target element that will apply the Focus Trap
		 *
		 * @type {HTMLElement}
		 * @memberof IFocusTrap
		 */
		targetChildElement: HTMLElement;

		/**
		 * Target element that will apply the FOcus Trap
		 *
		 * @type {HTMLElement}
		 * @memberof IFocusTrap
		 */
		targetElement: HTMLElement;

		/**
		 * Signature Method to add focus trap
		 *
		 * @param {Callbacks.FocusTrapBottomEvent} focusBottomCallback
		 * @param {Callbacks.FocusTrapTopEvent} focusTopCallback
		 * @memberof IFocusTrap
		 */
		setFocusTrap(
			focusBottomCallback: Callbacks.FocusTrapBottomEvent,
			focusTopCallback: Callbacks.FocusTrapTopEvent
		);
	}
}
