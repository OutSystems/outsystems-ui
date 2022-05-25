// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.DynamicElements.Trapping {
	/**
	 * Class that represents the focus trap.
	 *
	 * @export
	 * @class Trapping
	 */
	export class FocusTrap {
		private _bottomElement: HTMLElement;
		private _eventFocusBottomElement: Callbacks.Generic;
		private _eventFocusTopElement: Callbacks.Generic;
		private _focusBottomCallback: Callbacks.Generic;
		private _focusTopCallback: Callbacks.Generic;
		private _targetChildElement: HTMLElement;
		private _targetElement: HTMLElement;
		private _topElement: HTMLElement;

		constructor(target: HTMLElement, targetChild: HTMLElement) {
			this._targetElement = target;
			this._targetChildElement = targetChild;
		}

		// Method that removes the added event listeners
		private _removeEventListeners(): void {
			// code goes here
			this._bottomElement.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._focusBottomCallback.bind(this));
			this._topElement.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._focusTopCallback.bind(this));
		}

		// Method to create elements
		private _setHtmlElements(): void {
			// Set elements
			this._topElement = document.createElement('span');
			this._bottomElement = document.createElement('span');

			// Set CSS classes
			Helper.Dom.Styles.AddClass(this._topElement, 'focus-top');
			Helper.Dom.Styles.AddClass(this._bottomElement, 'focus-bottom');

			// Set A11Y to elements
			this.setFocusA11y(this._topElement);
			this.setFocusA11y(this._bottomElement);

			// Add elements to DOM
			this._targetElement.insertBefore(this._topElement, this._targetChildElement);
			this._targetElement.appendChild(this._bottomElement);
		}

		// Method that unsets all the callback defined
		private _unsetCallbacks(): void {
			this._focusBottomCallback = undefined;
			this._focusTopCallback = undefined;
		}

		/**
		 * Method to add the event listeners to the created elements
		 *
		 * @protected
		 * @memberof Trapping
		 */
		protected setEventListeners(): void {
			this._bottomElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._focusBottomCallback.bind(this));
			this._topElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._focusTopCallback.bind(this));
		}

		/**
		 * Method to set the expected callbacks
		 *
		 * @protected
		 * @param {Callbacks.Generic} focusBottomCallback
		 * @param {Callbacks.Generic} focusTopCallback
		 * @memberof Trapping
		 */
		protected setFocusCallbacks(focusBottomCallback: Callbacks.Generic, focusTopCallback: Callbacks.Generic): void {
			this._focusBottomCallback = focusBottomCallback;
			this._focusTopCallback = focusTopCallback;
		}

		/**
		 * Method to set the expected callbacks and add eventListeners
		 *
		 * @param {Callbacks.Generic} focusBottomCallback
		 * @param {Callbacks.Generic} focusTopCallback
		 * @memberof Trapping
		 */
		public setEvents(focusBottomCallback: Callbacks.Generic, focusTopCallback: Callbacks.Generic): void {
			this.setFocusCallbacks(focusBottomCallback, focusTopCallback);
		}

		/**
		 * Add the A11Y properties to element
		 *
		 * @memberof FocusTrap
		 */
		public setFocusA11y(element: HTMLElement): void {
			Helper.A11Y.TabIndexTrue(element);
			Helper.A11Y.AriaHiddenTrue(element);
		}

		/**
		 *  Remove the A11Y properties of element
		 *
		 * @memberof FocusTrap
		 */
		public unsetFocusA11y(element: HTMLElement): void {
			Helper.A11Y.TabIndexFalse(element);
			Helper.A11Y.AriaHiddenFalse(element);
		}

		/**
		 * Get the targetElement
		 *
		 * @type {HTMLElement}
		 * @memberof Trapping
		 */
		public get targetElement(): HTMLElement {
			return this._targetElement;
		}

		/**
		 * Get the targetChildElement
		 *
		 * @type {HTMLElement}
		 * @memberof Trapping
		 */
		public get targetChildElement(): HTMLElement {
			return this._targetChildElement;
		}

		/**
		 * Method to remove the event listeners and unset the callbacks
		 *
		 * @memberof Trapping
		 */
		public unsetTouchEvents(): void {
			this._removeEventListeners();
			this._unsetCallbacks();
		}
	}
}
