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
		private _notificationContentElement: HTMLElement;
		private _platformEventOnInitialize: Callbacks.OSNotificationInitializedEvent;
		private _platformEventOnToggle: Callbacks.OSNotificationToggleEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new NotificationConfig(configs));

			// Set the pattern default values if is empty
			this.configs.Width = this.configs.Width !== '' ? this.configs.Width : Enum.Defaults.DefaultWidth;
			this.configs.Position =
				this.configs.Position !== '' ? this.configs.Position : Enum.Defaults.DefaultPosition;
			this._isOpen = this.configs.StartsOpen;
		}

		/**
		 * Close Notification after wait the time defined
		 *
		 * @private
		 * @memberof Notification
		 */
		private _autoCloseNotification(): void {
			setTimeout(() => {
				if (this._isOpen) {
					this.hide();
				}
			}, this.configs.CloseAfterTime);
		}

		/**
		 * Trigger the notification at toggle behaviour
		 *
		 * @private
		 * @param {MouseEvent}
		 * @memberof Notification
		 */
		private _clickCallback(e: MouseEvent): void {
			e.stopPropagation();
			e.preventDefault();
			this._onNotificationToggle(!this._isOpen);
		}

		/**
		 * Call methods to open or close, based ok e.key and behavior applied
		 *
		 * @private
		 * @param {KeyboardEvent} e
		 * @memberof Notification
		 */
		private _keypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;
			const isShiftPressed = e.key === GlobalEnum.Keycodes.Shift;
			const isTabPressed = e.key === GlobalEnum.Keycodes.Tab;
			if (!isTabPressed && !isShiftPressed && !isEscapedPressed) {
				return;
			}

			// Prevent the focus to outside of Notification
			if (document.activeElement === this._notificationContentElement) {
				if (!this._lastFocusableElement) {
					this._notificationContentElement.focus();
				} else {
					this._lastFocusableElement.focus();
				}
				e.preventDefault();
			}

			// Close the Notification when pressing Esc
			if (isEscapedPressed && this._isOpen) {
				this.hide();
			}

			// If pressing shift + tab do a focus trap inside the notification
			if (isShiftPressed) {
				if (document.activeElement === this._firstFocusableElement) {
					this._lastFocusableElement.focus();
					e.preventDefault();
				}
			} else if (document.activeElement === this._lastFocusableElement) {
				this._firstFocusableElement.focus();
				e.preventDefault();
			}
		}

		/**
		 * Prevent close notification based on a uniqueID validation, when his event is triggered
		 *
		 * @private
		 * @param {string} elementId
		 * @memberof Notification
		 */
		private _openCallback(elementId: string): void {
			if (elementId !== this.uniqueId) {
				if (this._isOpen) {
					this.hide();
				}
			}
		}

		/**
		 * Toggle visibility of Notification
		 *
		 * @private
		 * @param {boolean} isOpen
		 * @memberof Notification
		 */
		private _onNotificationToggle(isOpen: boolean): void {
			this._isOpen = isOpen;

			if (this._isOpen) {
				this.show();
			} else {
				this.hide();
			}
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(isOpen: boolean): void {
			Helper.AsyncInvocation(this._platformEventOnToggle.bind(this), this.widgetId, isOpen);
		}

		/**
		 * Set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @private
		 * @memberof Notification
		 */
		private _updateA11yProperties(): void {
			const setA11YtabIndex = this._isOpen ? Helper.A11Y.TabIndexTrue : Helper.A11Y.TabIndexFalse;

			Helper.Dom.Attribute.Set(
				this._notificationContentElement,
				Constants.A11YAttributes.Aria.Hidden,
				(!this._isOpen).toString()
			);

			Helper.Dom.Attribute.Set(
				this._notificationContentElement,
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

		/**
		 * Update click to close
		 *
		 * @private
		 * @param {boolean} clickToClose
		 * @memberof Notification
		 */
		private _updateClickToClose(clickToClose: boolean): void {
			this.configs.ClickToClose = clickToClose;
		}

		/**
		 * Update time to apply on AutoClose
		 *
		 * @private
		 * @param {number} value
		 * @memberof Notification
		 */
		private _updateCloseAfterTime(value: number): void {
			this.configs.CloseAfterTime = value;
			if (this._isOpen) {
				this._autoCloseNotification();
			}
		}

		/**
		 * Update position
		 *
		 * @private
		 * @param {string} position
		 * @memberof Notification
		 */
		private _updatePosition(position: string): void {
			// Reset direction class
			if (this.configs.Position !== '') {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternPosition + position);
			}

			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternPosition + this.configs.Position);
		}

		/**
		 * Update width
		 *
		 * @private
		 * @param {string} width
		 * @memberof Notification
		 */
		private _updateWidth(width: string): void {
			this.configs.Width = width;
			if (width !== '') {
				// Update css variable
				Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, width);
				this.configs.Width = width;
			}
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
		 * Set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setInitialStates(): void {
			// Set event type based on device
			if (Helper.DeviceInfo.GetOperatingSystem()) {
				this._eventType = GlobalEnum.HTMLEvent.TouchStart;
			} else {
				this._eventType = GlobalEnum.HTMLEvent.Click;
			}

			// Add A11Y class to body if feature is enabled because the styles are only in the layout context and we move the notification to outside of layout
			if (Helper.DeviceInfo.HasAccessibilityEnabled) {
				Helper.Dom.Styles.AddClass(document.body, Constants.HasAccessibilityClass);
			}

			// Set width value for Notification
			Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, this.configs.Width);

			// Set position initial class
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternPosition + this.configs.Position);

			if (this._isOpen) {
				this._onNotificationToggle(this._isOpen);
			}

			if (this.configs.CloseAfterTime > 0 && this._isOpen) {
				this._autoCloseNotification();
			}

			Helper.Dom.Move(
				this._selfElem,
				document.querySelector(
					Constants.Dot + GlobalEnum.Screen.Active + Constants.Dot + GlobalEnum.Screen.Container
				)
			);
		}

		/**
		 * Remove all the assigned Events
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected unsetCallbacks(): void {
			// Remove listeners to toggle Notification
			if (this.configs.ClickToClose) {
				this._notificationContentElement.removeEventListener(this._eventType, this._eventOnClick);
				this._notificationContentElement.removeEventListener(
					GlobalEnum.HTMLEvent.keyDown,
					this._eventOnKeypress
				);
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
				this._notificationContentElement,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Alert
			);

			// Update accessibility properties
			this._updateA11yProperties();
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setHtmlElements(): void {
			this._notificationContentElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContent);

			this._focusableElements = [...this._selfElem.querySelectorAll(Constants.FocusableElems)] as HTMLElement[];

			// to handle focusable element's tabindex when toggling the Notification
			this._firstFocusableElement = this._focusableElements[0];
			this._lastFocusableElement = this._focusableElements[this._focusableElements.length - 1];

			this.setA11YProperties();

			Helper.AsyncInvocation(this._platformEventOnInitialize.bind(this), this.widgetId);
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected unsetHtmlElements(): void {
			this._notificationContentElement = undefined;
			this._focusableElements = undefined;
			this._firstFocusableElement = undefined;
			this._lastFocusableElement = undefined;
		}

		public build(): void {
			super.build();

			// Add timeout to make this method call asynchronous to wait for the classes of device detection
			Helper.AsyncInvocation(this.setInitialStates.bind(this));

			this.setCallbacks();

			this.setHtmlElements();

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
			const _oldNotificationPosition: string = this.configs.Position;
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.ClickToClose:
						this._updateClickToClose(propertyValue);
						break;
					case Enum.Properties.CloseAfterTime:
						this._updateCloseAfterTime(propertyValue);
						break;
					case Enum.Properties.StartsOpen:
						this._onNotificationToggle(propertyValue);
						break;
					case Enum.Properties.Position:
						this._updatePosition(_oldNotificationPosition);
						break;
					case Enum.Properties.Width:
						this._updateWidth(propertyValue);
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
			// Remove event listners
			this.unsetCallbacks();

			// Remove unused HTML elements
			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Hide Notification
		 *
		 * @memberof Notification
		 */
		public hide(): void {
			this._isOpen = false;

			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._isOpen);

			// Update accessibility properties
			this._updateA11yProperties();

			// Remove focus when a Notification is closed
			this._notificationContentElement.blur();

			// Focus on last element clicked
			this._focusableActiveElement.focus();

			// Remove listeners to toggle Notification
			if (this.configs.ClickToClose) {
				this._notificationContentElement.removeEventListener(this._eventType, this._eventOnClick);
				this._notificationContentElement.removeEventListener(
					GlobalEnum.HTMLEvent.keyDown,
					this._eventOnKeypress
				);
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
		 * @param {string} eventName Event name that will be assigned
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSUIDropdownServerSide
		 */
		public registerProviderCallback(eventName: string, callback: Callbacks.OSGeneric): void {
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
						`${ErrorCodes.Notification.FailRegisterCallback}:	The given '${eventName}' event name it's not defined.`
					);
			}
		}

		/**
		 * Show Notification
		 *
		 * @memberof Notification
		 */
		public show(): void {
			this._focusableActiveElement = document.activeElement as HTMLElement;
			this._isOpen = true;

			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._isOpen);

			// Update accessibility properties
			this._updateA11yProperties();

			// Add listeners to toggle Notification
			if (this.configs.ClickToClose) {
				this._notificationContentElement.addEventListener(this._eventType, this._eventOnClick);
			}

			this._notificationContentElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			// Focus on element when Notification is open
			this._notificationContentElement.focus();

			if (this.configs.CloseAfterTime > 0) {
				this._autoCloseNotification();
			}
		}
	}
}
