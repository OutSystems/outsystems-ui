// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Notification extends AbstractPattern<NotificationConfig> implements INotification {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnNotification: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnNotificationClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnNotificationKeypress: any;
		// Store the first element to receive focus in the notification
		private _firstFocusableElem: HTMLElement;
		// Store focusable element inside notification
		private _focusableElems: HTMLElement[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _globalEventOnBodyClick: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _globalEventOnNotificationOpen: any;
		private _isMobile = false;
		// Store the last element to receive focus in the notification
		private _lastFocusableElem: HTMLElement;
		private _notificationContent: HTMLElement;
		private _onToggle: Callbacks.OSNotificationToggleEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new NotificationConfig(configs));

			// Set the pattern default values if is empty
			this.configs.Width = this.configs.Width !== '' ? this.configs.Width : Enum.Defaults.DefaultWidth;
			this.configs.Position =
				this.configs.Position !== '' ? this.configs.Position : Enum.Defaults.DefaultPosition;
		}

		/**
		 *
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setCallbacks(): void {
			this._eventOnNotificationClick = this._onNotificationClick.bind(this);
			this._eventOnNotificationKeypress = this._onNotificationKeypress.bind(this);
			this._globalEventOnBodyClick = this._onBodyClick.bind(this);
			this._globalEventOnNotificationOpen = this._onNotificationOpenEvent.bind(this);
		}

		// Close Notification after wait the time defined
		private _autoCloseNotification(): void {
			setTimeout(() => {
				if (this.configs.IsOpen) {
					this.hide();
				}
			}, this.configs.CloseAfterTime);
		}

		// Close Notification, when BodyOnCLick event is triggered
		private _onBodyClick(args: string, e: MouseEvent): void {
			if (!this._notificationContent.contains(e.target as HTMLElement)) {
				if (this.configs.IsOpen) {
					this.hide();
				}
			}

			e.stopPropagation();
		}

		// Trigger the notification at toggle behaviour
		private _onNotificationClick(e: MouseEvent): void {
			e.stopPropagation();
			e.preventDefault();
			this._onNotificationToggle(!this.configs.IsOpen);
		}

		// Call methods to open or close, based ok e.key and behavior applied
		private _onNotificationKeypress(e: KeyboardEvent): void {
			const _isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;
			const _isEnterPressed = e.key === GlobalEnum.Keycodes.Enter;
			const _isShiftPressed = e.key === GlobalEnum.Keycodes.Shift;
			const _isTabPressed = e.key === GlobalEnum.Keycodes.Tab;

			//Open the Notification
			if (_isEnterPressed) {
				this._onNotificationToggle(!this.configs.IsOpen);
			}
			// Close the Notification when pressing Esc
			if (_isEscapedPressed && this.configs.IsOpen) {
				this.hide();
			}

			// Focus trap to circle all buttons inside
			if (_isShiftPressed && _isTabPressed) {
				console.log('shift and tab pressed');
			} else if (_isTabPressed) {
				console.log('tab pressed');
			}

			e.stopPropagation();
		}

		// Prevent close notification based on a uniqueID validation, when his event is triggered
		private _onNotificationOpenEvent(elementId: string): void {
			if (elementId !== this.uniqueId) {
				if (this.configs.IsOpen) {
					this.hide();
				}
			}
		}

		// Toggle visibility of Notification
		private _onNotificationToggle(isOpen: boolean): void {
			this.configs.IsOpen = isOpen;

			if (this.configs.IsOpen) {
				this.show();
			} else {
				this.hide();
			}
		}
		/**
		 * Set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setInitialStates(): void {
			this._isMobile = !!(
				document.querySelector(Constants.Dot + GlobalEnum.MobileOS.Android) ||
				document.querySelector(Constants.Dot + GlobalEnum.MobileOS.IOS)
			);

			// Set event type based on device
			if (this._isMobile) {
				this._eventOnNotification = GlobalEnum.HTMLEvent.TouchStart;
			} else {
				this._eventOnNotification = GlobalEnum.HTMLEvent.Click;
			}

			// Add A11Y class to body if feature is enabled
			if (Helper.DeviceInfo.HasAccessibilityEnabled) {
				Helper.Dom.Styles.AddClass(document.body, Constants.HasAccessibilityClass);
			}

			// Set width value for Notification
			Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, this.configs.Width);

			// Set position initial class
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternPosition + this.configs.Position);

			// Set HasOverlay class
			if (this.configs.HasOverlay) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternOverlay);
			}

			if (this.configs.IsOpen) {
				this._onNotificationToggle(this.configs.IsOpen);
			}

			if (this.configs.CloseAfterTime > 0 && this.configs.IsOpen) {
				this._autoCloseNotification();
			}

			console.log('function called');

			OSUIFramework.Helper.Dom.Move(
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
				this._notificationContent.removeEventListener(
					this._eventOnNotification,
					this._eventOnNotificationClick
				);
				this._notificationContent.removeEventListener(
					GlobalEnum.HTMLEvent.keyDown,
					this._eventOnNotificationKeypress
				);
			}

			// Remove handler from EventManager
			if (this.configs.CloseOnBodyClick) {
				OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					OSUIFramework.Event.Type.BodyOnClick,
					this._globalEventOnBodyClick
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
				this._notificationContent,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Alert
			);

			// Update accessibility properties
			this._updateA11yProperties();
		}

		// Set focusable elements
		private _setFocusedElements(): void {
			this._focusableElems = [...this._selfElem.querySelectorAll(Constants.FocusableElems)] as HTMLElement[];

			// to handle focusable element's tabindex when toggling the notification
			this._firstFocusableElem = this._focusableElems[0];
			this._lastFocusableElem = this._focusableElems[this._focusableElems.length - 1];
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected setHtmlElements(): void {
			this._notificationContent = this._selfElem.querySelector(Constants.Dot + Enum.CssClass.PatternContent);
		}

		/**
		 * Reassign the HTML elements to undefined, preventing memory leaks
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected unsetHtmlElements(): void {
			this._notificationContent = undefined;
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(isOpen: boolean): void {
			setTimeout(() => {
				this._onToggle(this.widgetId, isOpen);
			}, 0);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _updateA11yProperties(): void {
			Helper.Dom.Attribute.Set(
				this._notificationContent,
				Constants.A11YAttributes.Aria.Hidden,
				(!this.configs.IsOpen).toString()
			);

			Helper.Dom.Attribute.Set(
				this._notificationContent,
				Constants.A11YAttributes.TabIndex,
				this.configs.IsOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden
			);
		}

		// Update CloseAfterTime value
		private _updateClickToClose(clickToClose: boolean): void {
			this.configs.ClickToClose = clickToClose;
		}

		// Update CloseAfterTime value
		private _updateCloseAfterTime(value: number): void {
			this.configs.CloseAfterTime = value;
			if (this.configs.IsOpen) {
				this._autoCloseNotification();
			}
		}

		// Update CloseOnBodyClick value
		private _updateCloseOnBodyClick(closeOnBodyClick: boolean): void {
			this.configs.CloseOnBodyClick = closeOnBodyClick;

			// Toggle handlers from EventManager
			if (this.configs.CloseOnBodyClick && this.configs.IsOpen) {
				OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					OSUIFramework.Event.Type.BodyOnClick,
					this._globalEventOnBodyClick
				);
			} else {
				OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					OSUIFramework.Event.Type.BodyOnClick,
					this._globalEventOnBodyClick
				);
			}
		}

		private _updateHasOverlay(overlay: boolean): void {
			this.configs.HasOverlay = overlay;
			// Reset overlay class
			if (this.configs.HasOverlay) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternOverlay);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternOverlay);
			}
		}

		private _updatePosition(position: string): void {
			// Reset direction class
			if (this.configs.Position !== '') {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternPosition + this.configs.Position);
			}

			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternPosition + position);
			this.configs.Position = position;
		}

		// Set the Notification width
		private _updateWidth(width: string): void {
			this.configs.Width = width;
			if (width !== '') {
				// Update css variable
				Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, width);
				this.configs.Width = width;
			}
		}

		public build(): void {
			super.build();

			this.setCallbacks();

			this.setHtmlElements();

			// Add timeout to make this method call asynchronous to wait for the classes of device detection
			Helper.AsyncInvocation(this.setInitialStates.bind(this));

			this.setA11YProperties();

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
					case Enum.Properties.CloseOnBodyClick:
						this._updateCloseOnBodyClick(propertyValue);
						break;
					case Enum.Properties.HasOverlay:
						this._updateHasOverlay(propertyValue);
						break;
					case Enum.Properties.IsOpen:
						this._onNotificationToggle(propertyValue);
						break;
					case Enum.Properties.Position:
						this._updatePosition(propertyValue);
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
			this.configs.IsOpen = false;

			console.log(document.querySelectorAll(Constants.FocusableElems));
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this.configs.IsOpen);

			// Update accessibility properties
			this._updateA11yProperties();

			// Remove focus when a Notification is closed
			this._notificationContent.blur();

			// Remove listeners to toggle Notification
			if (this.configs.ClickToClose) {
				this._notificationContent.removeEventListener(
					this._eventOnNotification,
					this._eventOnNotificationClick
				);
				this._notificationContent.removeEventListener(
					GlobalEnum.HTMLEvent.keyDown,
					this._eventOnNotificationKeypress
				);
			}

			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				OSUIFramework.Event.Type.BodyOnClick,
				this._globalEventOnBodyClick
			);
		}

		// Method to handle the swipe bottom
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

		// Method to handle the swipe left
		public onSwipeLeft(): void {
			if (
				this.configs.Position === GlobalEnum.Position.Left ||
				this.configs.Position === GlobalEnum.Position.BottomLeft ||
				this.configs.Position === GlobalEnum.Position.TopLeft
			) {
				this.hide();
			}
		}

		// Method to handle the swipe right
		public onSwipeRight(): void {
			if (
				this.configs.Position === GlobalEnum.Position.Right ||
				this.configs.Position === GlobalEnum.Position.BottomRight ||
				this.configs.Position === GlobalEnum.Position.TopRight
			) {
				this.hide();
			}
		}

		// Method to handle the swipe top
		public onSwipeTop(): void {
			this.hide();
		}

		/**
		 * Set callbacks for the onToggle event
		 *
		 * @param {Callbacks.OSNotificationToggleEvent} callback
		 * @memberof Notification
		 */
		public registerCallback(callback: Callbacks.OSNotificationToggleEvent): void {
			this._onToggle = callback;
		}

		/**
		 * Show Notification
		 *
		 * @memberof Notification
		 */
		public show(): void {
			this.configs.IsOpen = true;

			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this.configs.IsOpen);

			// Update accessibility properties
			this._updateA11yProperties();

			// Add listeners to toggle Notification
			if (this.configs.ClickToClose) {
				this._notificationContent.addEventListener(this._eventOnNotification, this._eventOnNotificationClick);
			}

			this._notificationContent.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnNotificationKeypress);

			// Focus on element when Notification is open
			this._notificationContent.focus();
			console.log(this._notificationContent.querySelectorAll("[tabindex='0'],a,button"));

			if (this.configs.CloseAfterTime > 0) {
				this._autoCloseNotification();
			}
			// Add handler to EventManager for body click
			if (this.configs.CloseOnBodyClick) {
				OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					OSUIFramework.Event.Type.BodyOnClick,
					this._globalEventOnBodyClick
				);
			}
		}
	}
}
