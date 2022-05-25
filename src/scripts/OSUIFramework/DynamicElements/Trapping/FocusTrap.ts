// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.DynamicElements.Trapping {
	/**
	 * Class that represents the focus trap.
	 *
	 * @export
	 * @class Trapping
	 */
	export class FocusTrap implements Interface.IFocusTrap {
		private _bottomElement: HTMLElement;
		private _eventFocusBottomElement: Callbacks.Generic;
		private _eventFocusTopElement: Callbacks.Generic;
		private _focusBottomCallback: Callbacks.Generic;
		private _focusTopCallback: Callbacks.Generic;
		private _targetElement: HTMLElement;
		private _topElement: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		focusTrapInstance: FocusTrap;

		constructor(target: HTMLElement) {
			this._targetElement = target;
		}

		// Method that removes the added event listeners
		private _removeEventListeners(): void {
			// code goes here
			this._bottomElement.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._focusBottomCallback.bind(this));
			this._topElement.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._focusTopCallback.bind(this));
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

		setFocusTrap(
			focusBottomCallback: Callbacks.FocusTrapBottomEvent,
			focusTopCallback: Callbacks.FocusTrapTopEvent
		) {
			throw new Error('Method not implemented.');
		}

		/**
		 * Get the targetElement
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof Trapping
		 */
		public get targetElement(): HTMLElement {
			return this._targetElement;
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
