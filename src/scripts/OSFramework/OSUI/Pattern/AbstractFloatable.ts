// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns {
	export abstract class AbstractFloatable<C extends AbstractConfiguration>
		extends AbstractPattern<C>
		implements Interface.IFloatable
	{
		// Listener callbacks
		private _eventBodyClick: GlobalCallbacks.Generic;
		private _eventOnKeypress: GlobalCallbacks.Generic;
		// FocusTrap Properties
		private _focusTrapInstance: Behaviors.FocusTrap;
		private _focusableActiveElement: HTMLElement;
		// WidgetId element
		private _parentSelf: HTMLElement;
		private _patternName: string;
		private _platformEventOnToggle: GlobalCallbacks.Generic;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		protected openCSSClass: string;
		// Store if the pattern is open
		public isOpen = false;

		// Add Focus Trap to Pattern
		private _handleFocusTrap(): void {
			const opts = {
				focusTargetElement: this._parentSelf,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(): void {
			Helper.AsyncInvocation(this._platformEventOnToggle, this.widgetId, this.isOpen);
		}

		protected bodyClickCallback(_args: string, e: MouseEvent): void {
			this.close();
			e.stopPropagation();
		}

		// Call methods to open or close, based on e.key and behaviour applied
		protected onkeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			// Close the Balloon when pressing Esc
			if (isEscapedPressed && this.isOpen) {
				this.close();
			}
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Balloon.Balloon
		 */
		protected removeEventListeners(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventBodyClick
			);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected setA11YProperties(): void {
			Helper.Dom.Attribute.Set(this.selfElement, Constants.A11YAttributes.Aria.Hidden, (!this.isOpen).toString());

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.TabIndex,
				this.isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden
			);

			// Will handle the tabindex value of the elements inside pattern
			Helper.A11Y.SetElementsTabIndex(this.isOpen, this._focusTrapInstance.focusableElements);
		}

		/**
		 * Set the callbacks
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected setCallbacks(): void {
			this._eventBodyClick = this.bodyClickCallback.bind(this);
			this._eventOnKeypress = this.onkeypressCallback.bind(this);
		}

		/**
		 * Method to add event listeners
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected setEventListeners(): void {
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			if (this.isBuilt) {
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.BodyOnClick,
					this._eventBodyClick
				);
			}
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected setHtmlElements(): void {
			this._parentSelf = Helper.Dom.GetElementById(this.widgetId);
		}

		// Method to toggle the open/close the Balloon
		protected togglePattern(isOpen: boolean): void {
			// Toggle class
			if (isOpen) {
				Helper.Dom.Styles.AddClass(this.selfElement, this.openCSSClass);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, this.openCSSClass);
			}

			// Update property
			this.isOpen = isOpen;

			// Update listeners and A11y properties
			if (isOpen) {
				this.setEventListeners();
			} else {
				this.removeEventListeners();
			}

			this.setA11YProperties();

			// Handle focus trap logic
			if (isOpen) {
				this._focusableActiveElement = document.activeElement as HTMLElement;
				this._focusTrapInstance.enableForA11y();
				// Focus on element when pattern is open
				this.selfElement.focus();
			} else {
				this._focusTrapInstance.disableForA11y();

				// Focus on last element clicked. Async to avoid conflict with closing animation
				Helper.AsyncInvocation(() => {
					this.selfElement.blur();
					this._focusableActiveElement.focus();
				});
			}

			// Trigger platform event
			this._triggerOnToggleEvent();
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected unsetCallbacks(): void {
			this._eventBodyClick = undefined;
			this._eventOnKeypress = undefined;
			this._platformEventOnToggle = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof AbstractFloatable
		 */
		protected unsetHtmlElements(): void {
			this._parentSelf = undefined;
		}

		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setCallbacks();
			this._handleFocusTrap();
			this.setA11YProperties();
		}

		public close(): void {
			if (this.isOpen) {
				this.togglePattern(false);
			}
		}

		/**
		 * Destroy the AbstractFloatable.
		 *
		 * @memberof AbstractFloatable
		 */
		public dispose(): void {
			// Remove focus trap events and callbacks
			this._focusTrapInstance.dispose();

			if (this.isOpen) {
				this.removeEventListeners();
			}

			this.unsetCallbacks();
			this.unsetHtmlElements();

			super.dispose();
		}

		public open(): void {
			if (this.isOpen === false) {
				this.togglePattern(true);
			}
		}
	}
}
