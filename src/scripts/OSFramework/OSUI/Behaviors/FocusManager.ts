// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Behaviors {
	/**
	 * Class to manage focus of overlay components
	 *
	 * @export
	 * @class FocusManager
	 */
	export class FocusManager {
		// Store the last focused element
		private _lastFocusedElem: HTMLElement;

		constructor() {
			// do nothing.
		}

		/**
		 * Method to return the focus to the previous focused element
		 *
		 * @return {*}  {void}
		 * @memberof OSFramework.Behaviors.FocusManager
		 */
		public setFocusToStoredElement(): void {
			// If no element was set as the last focused element or it is not focusable anymore,
			// return the focus to the first focusable element in the page.
			if (
				this._lastFocusedElem === undefined ||
				!document.body.contains(this._lastFocusedElem) ||
				this._lastFocusedElem.hasAttribute(GlobalEnum.HTMLAttributes.Disabled) ||
				this._lastFocusedElem.tabIndex < 0
			) {
				(document.querySelector(OSFramework.OSUI.Constants.FocusableElems) as HTMLElement).focus();
			}
			// Otherwise, return the focus to the stored element.
			else {
				this._lastFocusedElem.focus();
			}
		}

		/**
		 * Method to store the last focused element if any
		 *
		 * @return {*}  {void}
		 * @memberof OSFramework.Behaviors.FocusManager
		 */
		public storeLastFocusedElement(): void {
			// In case there is an element focused, i.e., the activeElement is not the body, null or undefined,
			// Store it as the last focused element
			if (
				document.activeElement !== undefined &&
				document.activeElement !== null &&
				document.activeElement !== document.body
			)
				this._lastFocusedElem = document.activeElement as HTMLElement;
		}
	}
}
