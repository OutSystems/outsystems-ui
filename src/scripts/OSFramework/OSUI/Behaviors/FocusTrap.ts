// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Behaviors {
	// FocusTrap type
	export type FocusTrapParams = {
		canContainOtherPatterns?: boolean;
		focusBottomCallback?: GlobalCallbacks.Generic;
		focusTargetElement: HTMLElement;
		focusTopCallback?: GlobalCallbacks.Generic;
	};

	/**
	 * Class that represents the focus trap.
	 *
	 * @export
	 * @class FocusTrap
	 */
	export class FocusTrap {
		private _canTargetContainOtherPatts = false;
		private _firstFocusableElement: HTMLElement;
		private _focusBottomCallback: GlobalCallbacks.Generic;
		private _focusTopCallback: GlobalCallbacks.Generic;
		private _focusableElements: HTMLElement[];
		private _hasBeenPassThoughFirstOne = false;
		private _lastFocusableElement: HTMLElement;
		private _predictableBottomElement: HTMLElement;
		private _predictableTopElement: HTMLElement;
		private _targetElement: HTMLElement;

		/**
		 * Creates an instance of FocusTrap.
		 *
		 * @param {FocusTrapParams} opts
		 * @memberof FocusTrap
		 */
		constructor(opts: FocusTrapParams) {
			this._focusableElements = [];

			// Store the focus target element
			this._targetElement = opts.focusTargetElement;

			// Set the callbacks to focusable elements
			this._focusBottomCallback = opts.focusBottomCallback;
			this._focusTopCallback = opts.focusTopCallback;

			// Set the indicator that will reflect if the target element is capable to have other patterns inside
			this._canTargetContainOtherPatts = opts.canContainOtherPatterns || false;

			// Create the elements needed!
			this._buildPredictableElements();
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

			// Set focusable elements
			this._setFocusableElements();
		}

		// Handler for bottom on top element
		private _focusBottomHandler(): void {
			this._focusHandler(this._predictableBottomElement, this._focusBottomCallback);
		}

		// Method that will handle the focus behaviour
		private _focusHandler(focusableElement: HTMLElement, callback: GlobalCallbacks.Generic): void {
			// Ensure the list of focusable elements is updated!
			this._setFocusableElements();

			// Ensure callback has been not defined in order to manage the focus trap.
			if (callback === undefined) {
				if (focusableElement === this._predictableTopElement && this._hasBeenPassThoughFirstOne === false) {
					this._firstFocusableElement.focus();
					this._hasBeenPassThoughFirstOne = true;
				} else {
					this._lastFocusableElement.focus();
				}

				if (focusableElement === this._predictableBottomElement) {
					this._firstFocusableElement.focus();
					this._hasBeenPassThoughFirstOne = true;
				}
			} else {
				// If a callback has been defined, the focus will be managed on the context of that callback (pattern)
				callback();
			}
		}

		// Handler for focus on top element
		private _focusTopHandler(): void {
			this._focusHandler(this._predictableTopElement, this._focusTopCallback);
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

		// Method to set the focusable elements to be used
		private _setFocusableElements(includeTabIndexHidden = false): void {
			// Ensure the list of focusable elements is empty
			this._focusableElements = [];

			// Get all the possible focusable
			const possibleFocusableElements = Helper.Dom.GetFocusableElements(
				this._targetElement,
				includeTabIndexHidden
			);

			// Ensure we get the proper list of focusable elements
			for (const element of possibleFocusableElements) {
				// Get the closest data block from the element
				const closestDataBlock = element.closest(GlobalEnum.DataBlocksTag.DataBlock);
				// Check if the element is a child of the given targetElement
				if (closestDataBlock === this._targetElement || closestDataBlock.contains(this._targetElement)) {
					// Check if element is not a predictable element
					if (element !== this._predictableTopElement && element !== this._predictableBottomElement) {
						this._focusableElements.push(element);
					}
					// If the targetElement is a "special" element, we need to ensure that the focusable elements are not part of the inner patterns
					// Example of having an OverflowMenu inside the Sidebar and also get all the focusable elements from it as a part of the ones at the sideBar context
				} else if (this._canTargetContainOtherPatts) {
					// Ensure the element we bring from the inner pattern is the default tabindex element for it!
					if (Helper.Dom.Attribute.Has(element, Constants.FocusableTabIndexDefault)) {
						this._focusableElements.push(element);
					}
				}
			}

			// Remove the first element from array, because of predictable top element added for trapping
			this._firstFocusableElement = this._focusableElements[0];
			// Remove the last element from array, because of predictable bottom element added for trapping
			this._lastFocusableElement = this._focusableElements[this._focusableElements.length - 1];
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
			this._hasBeenPassThoughFirstOne = false;

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

			// Ensure the list of focusable elements is updated, predictable elements starts with TabIndex Hidden
			this._setFocusableElements(true);
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
