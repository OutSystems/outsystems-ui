// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Behaviors {
	// FocusTrap type
	export type FocusTrapParams = {
		focusBottomCallback: GlobalCallbacks.Generic;
		focusTargetElement: HTMLElement;
		focusTopCallback: GlobalCallbacks.Generic;
		focusTrapEnabled: boolean;
	};

	/**
	 * Class that represents the focus trap.
	 *
	 * @export
	 * @class FocusTrap
	 */
	export class FocusTrap {
		private _firstFocusableElement: HTMLElement;
		private _focusBottomCallback: GlobalCallbacks.Generic;
		private _focusTopCallback: GlobalCallbacks.Generic;
		private _focusableElements: HTMLElement[];
		private _isFocusTrap: boolean;
		private _lastFocusableElement: HTMLElement;
		private _predictableBottomElement: HTMLElement;
		private _predictableTopElement: HTMLElement;
		private _targetElement: HTMLElement;

		constructor(opts: FocusTrapParams) {
			// Store the focus target element
			this._targetElement = opts.focusTargetElement;

			// Toggle the focus trap behavior
			this._isFocusTrap = opts.focusTrapEnabled || true;

			// Set the callbacks to focusable elements
			this._focusBottomCallback = opts.focusBottomCallback;
			this._focusTopCallback = opts.focusTopCallback;

			// Create the elements needed!
			this._buildPredictableElements();

			// Set focusable elements
			this._setFocusableElements();
		}

		// Method to create elements
		private _buildPredictableElements(): void {
			// Create the focusable elements
			this._predictableTopElement = document.createElement(GlobalEnum.HTMLElement.Span);
			this._predictableBottomElement = document.createElement(GlobalEnum.HTMLElement.Span);

			// Add the created elements to DOM
			this._targetElement.prepend(this._predictableTopElement);
			this._targetElement.append(this._predictableBottomElement);

			// Set the default properties of focusable elements
			this._setFocusableProperties();
		}

		// Handler for bottom on top element
		private _focusBottomHandler(): void {
			this._focusHandler(false, this._focusBottomCallback);
		}

		private _focusHandler(isTopHandler: boolean, callback: GlobalCallbacks.Generic): void {
			if (this._isFocusTrap) {
				// Update focusable elements
				this._setFocusableElements();
				// Focus on element
				this._setFocusOnElement(
					isTopHandler ? this._lastFocusableElement : this._firstFocusableElement,
					this._targetElement
				);
			}

			// Trigger the methods on pattern
			if (callback !== undefined) {
				callback();
			}
		}

		// Handler for focus on top element
		private _focusTopHandler(): void {
			this._focusHandler(true, this._focusTopCallback);
		}

		// Method that removes the added event listeners
		private _removeEventListeners(): void {
			this._predictableBottomElement.removeEventListener(
				GlobalEnum.HTMLEvent.Focus,
				this._focusBottomHandler.bind(this)
			);
			this._predictableTopElement.removeEventListener(
				GlobalEnum.HTMLEvent.Focus,
				this._focusTopHandler.bind(this)
			);
		}

		// Method to add the event listeners to the created elements
		private _setEventListeners(): void {
			this._predictableBottomElement.addEventListener(
				GlobalEnum.HTMLEvent.Focus,
				this._focusBottomHandler.bind(this)
			);
			this._predictableTopElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._focusTopHandler.bind(this));
		}

		//Method to focus on element inside the block
		private _setFocusOnElement(focusableElement: HTMLElement, selfElement: HTMLElement): void {
			if (focusableElement) {
				focusableElement.focus();
			} else {
				selfElement?.focus();
			}
		}

		// Method to set the focusable elements to be used
		private _setFocusableElements(): void {
			this._focusableElements = Helper.Dom.GetFocusableElements(this._targetElement);

			// Remove the first element from array, because of predictable top element added for trapping
			this._firstFocusableElement = this._focusableElements[1];
			// Remove the last element from array, because of predictable bottom element added for trapping
			this._lastFocusableElement = this._focusableElements[this._focusableElements.length - 2];
		}

		// Method to add properties to HTML elements
		private _setFocusableProperties(): void {
			// Set CSS classes
			Helper.Dom.Styles.AddClass(this._predictableBottomElement, GlobalEnum.FocusTrapClasses.FocusTrapBottom);
			Helper.Dom.Styles.AddClass(this._predictableBottomElement, Constants.AccessibilityHideElementClass);
			Helper.Dom.Styles.AddClass(this._predictableTopElement, GlobalEnum.FocusTrapClasses.FocusTrapTop);
			Helper.Dom.Styles.AddClass(this._predictableTopElement, Constants.AccessibilityHideElementClass);

			// Hide by default the focusable elements
			this.disableForA11y();

			// Add event listeneres to focusable elements
			this._setEventListeners();
		}

		// Method that unsets all the callback defined
		private _unsetCallbacks(): void {
			this._focusBottomCallback = undefined;
			this._focusBottomHandler = undefined;
			this._focusTopCallback = undefined;
			this._focusTopHandler = undefined;
		}

		/**
		 *  Set element disabled for A11Y
		 *
		 * @memberof OSFramework.Behaviors.FocusTrap
		 */
		public disableForA11y(): void {
			// Unset A11Y properties from bottom & top focusable element
			Helper.A11Y.TabIndexFalse(this._predictableBottomElement);
			Helper.A11Y.TabIndexFalse(this._predictableTopElement);

			// Set A11Y AriaHidden as true
			Helper.A11Y.AriaHiddenTrue(this._predictableBottomElement);
			Helper.A11Y.AriaHiddenTrue(this._predictableTopElement);
		}

		/**
		 * Method to remove the event listeners and unset the callbacks
		 *
		 * @memberof OSFramework.Behaviors.FocusTrap
		 */
		public dispose(): void {
			// remove events added
			this._removeEventListeners();
			// unset defined callback
			this._unsetCallbacks();

			// ensure we also remove the html elements
			this._predictableTopElement.remove();
			this._predictableBottomElement.remove();
		}

		/**
		 *  Set element enabled for A11Y
		 *
		 * @memberof OSFramework.Behaviors.FocusTrap
		 */
		public enableForA11y(): void {
			// Set A11Y properties to bottom & top focusable element
			Helper.A11Y.TabIndexTrue(this._predictableBottomElement);
			Helper.A11Y.TabIndexTrue(this._predictableTopElement);

			// Set A11Y AriaHidden as false
			Helper.A11Y.AriaHiddenFalse(this._predictableBottomElement);
			Helper.A11Y.AriaHiddenFalse(this._predictableTopElement);
		}

		/**
		 * Getter that allows to obtain the bottomElement reference
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof OSFramework.Behaviors.FocusTrap
		 */
		public get bottomElement(): HTMLElement {
			return this._predictableBottomElement;
		}

		/**
		 * Getter that allows to obtain the bottomElement reference
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof OSFramework.Behaviors.FocusTrap
		 */
		public get topElement(): HTMLElement {
			return this._predictableTopElement;
		}

		/**
		 * Getter that allows to obtain the list of focusable elements
		 *
		 * @readonly
		 * @type {HTMLElement}
		 * @memberof OSFramework.Behaviors.FocusTrap
		 */
		public get focusableElements(): HTMLElement[] {
			return this._focusableElements;
		}
	}
}
