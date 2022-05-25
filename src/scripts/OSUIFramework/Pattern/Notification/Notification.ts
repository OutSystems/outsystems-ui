// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Notification extends AbstractPattern<NotificationConfig> implements INotification {
		private _eventOnClick: Callbacks.Generic;
		private _eventOnKeypress: Callbacks.Generic;
		// Define the event to be applied based on device
		private _eventType: string;
		private _firstFocusableElement: HTMLElement;
		private _focusableActiveElement: HTMLElement;
		private _focusableElements: HTMLElement[];
		private _isOpen: boolean;
		private _lastFocusableElement: HTMLElement;
		private _platformEventOnInitialize: Callbacks.OSNotificationInitializedEvent;
		private _platformEventOnToggle: Callbacks.OSNotificationToggleEvent;

		// Focus trap elements
		private _bottomElement: HTMLElement;
		private _topElement: HTMLElement;
		private _parentSelf: HTMLElement;
		private _eventFocusBottomElement: Callbacks.FocusTrapBottomEvent;
		private _eventFocusTopElement: Callbacks.FocusTrapTopEvent;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new NotificationConfig(configs));

			// Set the pattern default values if is empty
			this.configs.Width = this.configs.Width !== '' ? this.configs.Width : Enum.Defaults.DefaultWidth;
			this.configs.Position =
				this.configs.Position !== '' ? this.configs.Position : Enum.Defaults.DefaultPosition;
			this._isOpen = this.configs.StartsOpen;
		}

		private _addElementsFocusTrap(): void {
			// Set elements
			this._parentSelf = Helper.Dom.GetElementById(this._widgetId);
			this._topElement = document.createElement('span');
			this._bottomElement = document.createElement('span');

			// Add CSS classes
			Helper.Dom.Styles.AddClass(this._topElement, 'focus-top');
			Helper.Dom.Styles.AddClass(this._bottomElement, 'focus-bottom');

			// Add A11Y to elements created
			this._toggleA11yOnFocus(this._topElement);
			this._toggleA11yOnFocus(this._bottomElement);

			// Add elements to DOM
			this._parentSelf.insertBefore(this._topElement, this._selfElem);
			this._parentSelf.appendChild(this._bottomElement);

			// Add callbacks
			this._eventFocusBottomElement = this._focusBottomCallback.bind(this);
			this._eventFocusTopElement = this._focusTopCallback.bind(this);

			// Add events
			this._topElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocusTopElement);
			this._bottomElement.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventFocusBottomElement);

			console.log(this._selfElem, this._parentSelf);
		}

		// Create enable and disable methods
		private _toggleA11yOnFocus(element: HTMLElement): void {
			if (this._isOpen) {
				Helper.A11Y.TabIndexTrue(element);
			} else {
				Helper.A11Y.TabIndexFalse(element);
			}
			Helper.A11Y.AriaHidden(element, (!this._isOpen).toString());
		}

		private _focusBottomCallback(e: MouseEvent): void {
			this._firstFocusableElement.focus();
			console.log('Focus Bottom element');
		}

		private _focusTopCallback(e: MouseEvent): void {
			this._lastFocusableElement.focus();
			console.log('Focus Top element');
		}

		// Close Notification after wait the time defined
		private _autoCloseNotification(): void {
			setTimeout(() => {
				if (this._isOpen) {
					this.hide();
				}
			}, this.configs.CloseAfterTime);
		}

		// Trigger the notification at toggle behaviour
		private _clickCallback(e: MouseEvent): void {
			e.stopPropagation();
			e.preventDefault();
			this.hide();
		}

		// Hide Notification
		private _hideNotification(): void {
			this._isOpen = false;

			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._isOpen);

			// Update accessibility properties
			this._updateA11yProperties();

			// Add trap focus a11y
			this._toggleA11yOnFocus(this._topElement);
			this._toggleA11yOnFocus(this._bottomElement);

			// Remove focus when a Notification is closed
			this._selfElem.blur();

			// Focus on last element clicked
			this._focusableActiveElement.focus();

			// Remove listeners to toggle Notification
			if (Helper.DeviceInfo.IsNative === false && this.configs.InteractToClose) {
				this._selfElem.removeEventListener(this._eventType, this._eventOnClick);
				this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			}
		}

		// Call methods to open or close, based ok e.key and behavior applied
		private _keypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;
			const isShiftPressed = e.key === GlobalEnum.Keycodes.Shift;
			const isTabPressed = e.key === GlobalEnum.Keycodes.Tab;
			if (!isTabPressed && !isShiftPressed && !isEscapedPressed) {
				return;
			}

			/* // Prevent the focus to outside of Notification
			if (document.activeElement === this._selfElem) {
				if (!this._lastFocusableElement) {
					this._selfElem.focus();
				} else {
					this._lastFocusableElement.focus();
				}
				e.preventDefault();
			} */

			// Close the Notification when pressing Esc
			if (isEscapedPressed && this._isOpen) {
				this.hide();
			}

			// If pressing shift + tab do a focus trap inside the notification
			/* if (isShiftPressed) {
				if (document.activeElement === this._firstFocusableElement) {
					this._lastFocusableElement.focus();
					e.preventDefault();
				}
			} else if (document.activeElement === this._lastFocusableElement) {
				this._firstFocusableElement.focus();
				e.preventDefault();
			} */
		}

		// Remove all the assigned Events
		private _removeEvents(): void {
			this._selfElem.removeEventListener(this._eventType, this._eventOnClick);
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
		}

		// Show Notification
		private _showNotification(): void {
			this._focusableActiveElement = document.activeElement as HTMLElement;
			this._isOpen = true;

			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._isOpen);

			// Update accessibility properties
			this._updateA11yProperties();

			// Add trap focus a11y
			this._toggleA11yOnFocus(this._topElement);
			this._toggleA11yOnFocus(this._bottomElement);

			// Add listeners to toggle Notification
			if (Helper.DeviceInfo.IsNative === false && this.configs.InteractToClose) {
				this._selfElem.addEventListener(this._eventType, this._eventOnClick);
			}

			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			// Focus on element when Notification is open
			this._selfElem.focus();

			if (this.configs.CloseAfterTime > 0) {
				this._autoCloseNotification();
			}
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(isOpen: boolean): void {
			Helper.AsyncInvocation(this._platformEventOnToggle, this.widgetId, isOpen);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _updateA11yProperties(): void {
			const setA11YtabIndex = this._isOpen ? Helper.A11Y.TabIndexTrue : Helper.A11Y.TabIndexFalse;

			Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Hidden, (!this._isOpen).toString());

			Helper.Dom.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.TabIndex,
				this._isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden
			);

			// On each element, toggle the tabindex value, depending if notification is open or closed
			for (const item of this._focusableElements) {
				setA11YtabIndex(item);
			}
		}

		// Update time to apply on AutoClose
		private _updateCloseAfterTime(value: number): void {
			this.configs.CloseAfterTime = value;
			if (this._isOpen) {
				this._autoCloseNotification();
			}
		}

		// Update time to apply on AutoClose
		private _updateInteractToClose(value: boolean): void {
			if (this.configs.InteractToClose !== value) {
				this.configs.InteractToClose = value;
				if (Helper.DeviceInfo.IsNative === false) {
					if (this.configs.InteractToClose) {
						this._selfElem.addEventListener(this._eventType, this._eventOnClick);
					} else {
						this._selfElem.removeEventListener(this._eventType, this._eventOnClick);
					}
				}
			}
		}

		// Update position
		private _updatePosition(position: string): void {
			// Only change classes if are different
			if (this.configs.Position !== position) {
				// Reset direction class
				if (this.configs.Position !== '') {
					Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternPosition + position);
				}

				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternPosition + this.configs.Position);
			}
		}

		// Update width
		private _updateWidth(width: string): void {
			this.configs.Width = width;
			if (width !== '') {
				// Update css variable
				Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, width);
				this.configs.Width = width;
			}
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setA11YProperties(): void {
			Helper.Dom.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Alert
			);

			// Update accessibility properties
			this._updateA11yProperties();
		}

		/**
		 *  Sets the callbacks to be used in the pattern.
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._clickCallback.bind(this);
			this._eventOnKeypress = this._keypressCallback.bind(this);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setHtmlElements(): void {
			this._focusableElements = [...this._selfElem.querySelectorAll(Constants.FocusableElems)] as HTMLElement[];

			// to handle focusable element's tabindex when toggling the Notification
			this._firstFocusableElement = this._focusableElements[0];
			this._lastFocusableElement = this._focusableElements[this._focusableElements.length - 1];

			this.setA11YProperties();

			Helper.AsyncInvocation(this._platformEventOnInitialize, this.widgetId);
		}

		/**
		 * Set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setInitialStates(): void {
			// Set event if device is touch
			if (Helper.DeviceInfo.IsTouch) {
				this._eventType = GlobalEnum.HTMLEvent.TouchStart;
			} else {
				this._eventType = GlobalEnum.HTMLEvent.Click;
			}

			// Set width value for Notification
			Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, this.configs.Width);

			// Set position initial class
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternPosition + this.configs.Position);

			if (this._isOpen) {
				this._showNotification();
			}

			if (this.configs.CloseAfterTime > 0 && this._isOpen) {
				this._autoCloseNotification();
			}
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected unsetCallbacks(): void {
			// Reassign the elements to undefined, preventing memory leaks and remove events
			if (Helper.DeviceInfo.IsNative === false && this.configs.InteractToClose) {
				this._removeEvents();

				this._eventOnClick = undefined;
				this._eventOnKeypress = undefined;
			}
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected unsetHtmlElements(): void {
			this._firstFocusableElement = undefined;
			this._focusableElements = undefined;
			this._lastFocusableElement = undefined;
			this._platformEventOnInitialize = undefined;
			this._platformEventOnToggle = undefined;
		}

		public build(): void {
			super.build();

			// Add timeout to make this method call asynchronous to wait for the classes of device detection
			Helper.AsyncInvocation(this.setInitialStates.bind(this));

			this.setCallbacks();

			this.setHtmlElements();

			this._addElementsFocusTrap();

			this.finishBuild();
		}

		/**
		 * Update value when a parameters changed occurs
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof Notification
		 */
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		public changeProperty(propertyName: string, propertyValue: any): void {
			const _oldNotificationPosition = this.configs.Position;

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.InteractToClose:
						this._updateInteractToClose(propertyValue);
						break;
					case Enum.Properties.CloseAfterTime:
						this._updateCloseAfterTime(propertyValue);
						break;
					case Enum.Properties.StartsOpen:
						console.warn(
							`${GlobalEnum.PatternsNames.Notification} (${this.widgetId}): changes to ${Enum.Properties.StartsOpen} parameter do not affect the ${GlobalEnum.PatternsNames.Notification}. Use the client actions 'NotificationShow' and 'NotificationHide' to affect the ${GlobalEnum.PatternsNames.Notification}.`
						);
						break;
					case Enum.Properties.Position:
						this._updatePosition(_oldNotificationPosition);
						break;
					case Enum.Properties.Width:
						this._updateWidth(propertyValue);
						break;
					case GlobalEnum.CommonPatternsProperties.ExtendedClass:
						Helper.Dom.Styles.ExtendedClass(
							this._selfElem,
							this.configs.ExtendedClass,
							propertyValue as string
						);
						break;
				}
			}
		}

		/**
		 * Destroy the Notification
		 *
		 * @memberof Notification
		 */
		public dispose(): void {
			// Remove Callbacks
			this.unsetCallbacks();

			// Remove unused HTML elements
			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Public method to hide the notification, if it's visible.
		 *
		 * @memberof Notification
		 */
		public hide(): void {
			if (this._isOpen) {
				this._hideNotification();
			}
		}

		/**
		 * Handle the platform swipe bottom gesture
		 *
		 * @memberof Notification
		 */
		public onSwipeBottom(): void {
			if (
				this.configs.Position === GlobalEnum.Position.Bottom ||
				this.configs.Position === GlobalEnum.Position.BottomLeft ||
				this.configs.Position === GlobalEnum.Position.BottomRight ||
				this.configs.Position === GlobalEnum.Position.Center
			) {
				this.hide();
			}
		}

		/**
		 * Handle the platform swipe left gesture
		 *
		 * @memberof Notification
		 */
		public onSwipeLeft(): void {
			if (
				this.configs.Position === GlobalEnum.Position.Left ||
				this.configs.Position === GlobalEnum.Position.BottomLeft ||
				this.configs.Position === GlobalEnum.Position.TopLeft
			) {
				this.hide();
			}
		}

		/**
		 * Handle the platform swipe right gesture
		 *
		 * @memberof Notification
		 */
		public onSwipeRight(): void {
			if (
				this.configs.Position === GlobalEnum.Position.Right ||
				this.configs.Position === GlobalEnum.Position.BottomRight ||
				this.configs.Position === GlobalEnum.Position.TopRight
			) {
				this.hide();
			}
		}

		/**
		 * Handle the platform swipe top gesture
		 *
		 * @memberof Notification
		 */
		public onSwipeTop(): void {
			this.hide();
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName
		 * @param {Callbacks.OSGeneric} callback
		 * @memberof Notification
		 */
		public registerCallback(eventName: string, callback: Callbacks.OSGeneric): void {
			switch (eventName) {
				case Patterns.Notification.Enum.Events.OnInitialize:
					if (this._platformEventOnInitialize === undefined) {
						this._platformEventOnInitialize = callback;
					}
					break;

				case Patterns.Notification.Enum.Events.OnToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					}
					break;

				default:
					throw new Error(
						`${ErrorCodes.Notification.FailRegisterCallback}:	The given '${eventName}' event name is not defined.`
					);
			}
		}

		/**
		 * Public method to show the notification, if it's closed.
		 *
		 * @memberof Notification
		 */
		public show(): void {
			if (this._isOpen === false) {
				this._showNotification();
			}
		}
	}
}
