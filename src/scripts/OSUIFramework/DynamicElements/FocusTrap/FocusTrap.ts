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

			// Create the elements needed!
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
			Helper.Dom.Styles.AddClass(this._bottomElement, GlobalEnum.FocusTrapClasses.FocusTrapBottom);
			Helper.Dom.Styles.AddClass(this._bottomElement, Constants.AccessibilityHideElementClass);
			Helper.Dom.Styles.AddClass(this._topElement, GlobalEnum.FocusTrapClasses.FocusTrapTop);
			Helper.Dom.Styles.AddClass(this._topElement, Constants.AccessibilityHideElementClass);

			// Hide by default the focusable elements
			this.disableForA11y();

			// Add event listeneres to focusable elements
			this._setEventListeners();
		}

		// Method that unsets all the callback defined
		private _unsetCallbacks(): void {
			this._focusBottomCallback = undefined;
			this._focusTopCallback = undefined;
		}

		/**
		 *  Set elemet disabled for A11Y
		 *
		 * @memberof FocusTrap
		 */
		public disableForA11y(): void {
			// Unset A11Y properties from bottom & top focusable element
			Helper.A11Y.TabIndexFalse(this._bottomElement);
			Helper.A11Y.TabIndexFalse(this._topElement);

			// Set A11Y AriaHidden as true
			Helper.A11Y.AriaHiddenTrue(this._bottomElement);
			Helper.A11Y.AriaHiddenTrue(this._topElement);
		}

		/**
		 * Method to remove the event listeners and unset the callbacks
		 *
		 * @memberof FocusTrap
		 */
		public dispose(): void {
			// remove events added
			this._removeEventListeners();
			// unset defined callback
			this._unsetCallbacks();

			// ensure we also remove the html elements
			this._topElement.remove();
			this._bottomElement.remove();
		}

		/**
		 *  Set elemet enabled for A11Y
		 *
		 * @memberof FocusTrap
		 */
		public enableForA11y(): void {
			// Set A11Y properties to bottom & top focusable element
			Helper.A11Y.TabIndexTrue(this._bottomElement);
			Helper.A11Y.TabIndexTrue(this._topElement);

			// Set A11Y AriaHidden as false
			Helper.A11Y.AriaHiddenFalse(this._bottomElement);
			Helper.A11Y.AriaHiddenFalse(this._topElement);
		}

		/**
		 * Getter that allows to obtain the bottomElement reference
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof FocusTrap
		 */
		public get bottomElement(): HTMLElement {
			return this._bottomElement;
		}

		/**
		 * Getter that allows to obtain the bottomElement reference
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof FocusTrap
		 */
		public get topElement(): HTMLElement {
			return this._topElement;
		}
	}
}
