// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.DynamicElements.FocusTrap {
	/**
	 * Class that represents the focus trap.
	 *
	 * @export
	 * @class FocusTrap
	 */
	export class FocusTrap {
		private _bottomElement: HTMLElement;
		private _focusBottomCallback: Callbacks.Generic;
		private _focusTopCallback: Callbacks.Generic;
		private _targetElement: HTMLElement;
		private _topElement: HTMLElement;

		constructor(opts: FocusTrapOpts) {
			// Store the focus target element
			this._targetElement = opts.focusTargetElement;

			// Set the callbacks to focusable elements
			this._focusBottomCallback = opts.focusBottomCallback;
			this._focusTopCallback = opts.focusTopCallback;

			this._buildFocusableElements();
		}
		// Method to create elements
		private _buildFocusableElements(): void {
			// Create the focusable elements
			this._topElement = document.createElement(GlobalEnum.HTMLElement.Span);
			this._bottomElement = document.createElement(GlobalEnum.HTMLElement.Span);

			// Add the created elements to DOM
			this._targetElement.prepend(this._topElement);
			this._targetElement.append(this._bottomElement);

			// Set the default properties of focusable elements
			this._setFocusableProperties();
		}

		// Method that removes the added event listeners
		private _removeEventListeners(): void {
			this._bottomElement.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._focusBottomCallback.bind(this));
			this._topElement.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._focusTopCallback.bind(this));
		}

		// Method to add the event listeners to the created elements
		private _setEventListeners(): void {
			this._bottomElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._focusBottomCallback);
			this._topElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._focusTopCallback);
		}

		// Method to add properties to HTML elements
		private _setFocusableProperties(): void {
			// Set CSS classes
			Helper.Dom.Styles.AddClass(this._topElement, 'focus-top');
			Helper.Dom.Styles.AddClass(this._bottomElement, 'focus-bottom');

			// Hide by default the focusable elements
			this.unsetA11yProperties();

			// Add event listeneres to focusable elements
			this._setEventListeners();
		}

		// Method that unsets all the callback defined
		private _unsetCallbacks(): void {
			this._focusBottomCallback = undefined;
			this._focusTopCallback = undefined;
		}

		/**
		 * Method to remove the event listeners and unset the callbacks
		 *
		 * @memberof FocusTrap
		 */
		public dispose(): void {
			this._removeEventListeners();
			this._unsetCallbacks();
		}

		/**
		 * Add the A11Y properties to element
		 *
		 * @memberof FocusTrap
		 */
		public setA11yProperties(): void {
			// Set A11Y properties to bottom focusable element
			Helper.A11Y.TabIndexTrue(this._bottomElement);
			Helper.A11Y.AriaHiddenTrue(this._bottomElement);

			// Set A11Y properties to top focusable element
			Helper.A11Y.TabIndexTrue(this._topElement);
			Helper.A11Y.AriaHiddenTrue(this._topElement);
		}

		/**
		 *  Remove the A11Y properties of element
		 *
		 * @memberof FocusTrap
		 */
		public unsetA11yProperties(): void {
			// Unset A11Y properties from bottom focusable element
			Helper.A11Y.TabIndexFalse(this._bottomElement);
			Helper.A11Y.AriaHiddenFalse(this._bottomElement);

			// Unset A11Y properties from top focusable element
			Helper.A11Y.TabIndexFalse(this._topElement);
			Helper.A11Y.AriaHiddenFalse(this._topElement);
		}
	}
}
