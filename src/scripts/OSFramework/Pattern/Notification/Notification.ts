// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Notification
		extends AbstractPattern<NotificationConfig>
		implements INotification, Interface.ISwipeEvent
	{
		// Store the click event with bind(this)
		private _eventOnClick: Callbacks.Generic;
		// Store the keypress event with bind(this)
		private _eventOnKeypress: Callbacks.Generic;
		// Define the event to be applied based on device
		private _eventType: string;
		// Store focus trap instance
		private _focusTrapInstance: Behaviors.FocusTrap.FocusTrap;
		// Store the active element focused
		private _focusableActiveElement: HTMLElement;
		// Store gesture events instance
		private _gestureEventInstance: Event.GestureEvent.SwipeEvent;
		// Store if the pattern has gesture events added
		private _hasGestureEvents: boolean;
		// Store pattern visibility
		private _isOpen: boolean;
		// Store the parent element
		private _parentSelf: HTMLElement;
		// Store the platform events
		private _platformEventOnInitialize: Callbacks.OSNotificationInitializedEvent;
		private _platformEventOnToggle: Callbacks.OSNotificationToggleEvent;

		/**
		 * Get Gesture Events Instance
		 *
		 * @readonly
		 * @type {Event.GestureEvent.SwipeEvent}
		 * @memberof Notification
		 */
		public get gestureEventInstance(): Event.GestureEvent.SwipeEvent {
			return this._gestureEventInstance;
		}

		/**
		 * Get if has gesture events
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof Notification
		 */
		public get hasGestureEvents(): boolean {
			return this._hasGestureEvents;
		}

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new NotificationConfig(configs));

			// Set the pattern default values if is empty
			this.configs.Width = this.configs.Width !== '' ? this.configs.Width : Enum.Defaults.DefaultWidth;
			this.configs.Position =
				this.configs.Position !== '' ? this.configs.Position : Enum.Defaults.DefaultPosition;
			this._isOpen = this.configs.StartsOpen;
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

		// Add Focus Trap to Pattern
		private _handleFocusTrap(): void {
			const opts = {
				focusTargetElement: this._parentSelf,
			} as Behaviors.FocusTrap.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap.FocusTrap(opts);
		}

		// Method to handle the creation of the GestureEvents
		private _handleGestureEvents(): void {
			if (Helper.DeviceInfo.IsNative) {
				// Create and save gesture event instance. Created here and not on constructor,
				// as we need to pass this._selfElem, only available after super.build()
				this._gestureEventInstance = new Event.GestureEvent.SwipeEvent(this._selfElem);

				//Set event listeners and callbacks
				this.setGestureEvents(
					this.onSwipeBottom.bind(this),
					this.onSwipeLeft.bind(this),
					this.onSwipeRight.bind(this),
					this.onSwipeUp.bind(this)
				);
			}
		}

		// Hide Notification
		private _hideNotification(): void {
			this._isOpen = false;

			// Remove the A11Y states to focus trap
			this._focusTrapInstance.disableForA11y();

			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._isOpen);

			// Update accessibility properties
			this._updateA11yProperties();

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

			// Close the Notification when pressing Esc
			if (isEscapedPressed && this._isOpen) {
				this.hide();
			}
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

			// Add the A11Y states to focus trap
			this._focusTrapInstance.enableForA11y();

			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._isOpen);

			// Update accessibility properties
			this._updateA11yProperties();

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
			Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Hidden, (!this._isOpen).toString());

			Helper.Dom.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.TabIndex,
				this._isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden
			);

			// Will handle the tabindex value of the elements inside pattern
			Helper.A11Y.SetElementsTabindex(this._isOpen, this._focusTrapInstance.focusableElements);
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
			this._parentSelf = Helper.Dom.GetElementById(this._widgetId);

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
			this._parentSelf = undefined;
			this._platformEventOnInitialize = undefined;
			this._platformEventOnToggle = undefined;
		}

		public build(): void {
			super.build();

			// Add timeout to make this method call asynchronous to wait for the classes of device detection
			Helper.AsyncInvocation(this.setInitialStates.bind(this));

			this.setCallbacks();

			this.setHtmlElements();

			this._handleFocusTrap();

			this.setA11YProperties();

			this._handleGestureEvents();

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
							`${GlobalEnum.PatternName.Notification} (${this.widgetId}): changes to ${Enum.Properties.StartsOpen} parameter do not affect the ${GlobalEnum.PatternName.Notification}. Use the client actions 'NotificationShow' and 'NotificationHide' to affect the ${GlobalEnum.PatternName.Notification}.`
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
			if (this.isBuilt) {
				// Remove Callbacks
				this.unsetCallbacks();

				// Remove unused HTML elements
				this.unsetHtmlElements();

				// Remove focus trap events and callbacks
				this._focusTrapInstance.dispose();

				// Remove gestures events intances
				if (this._hasGestureEvents) {
					this.removeGestureEvents();
				}

				//Destroying the base of pattern
				super.dispose();
			}
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
		public onSwipeUp(): void {
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
		 * Removes the gesture events to open/close the Notification on Mobile Apps
		 *
		 * @memberof Notification
		 */
		public removeGestureEvents(): void {
			if (this._gestureEventInstance !== undefined) {
				this._gestureEventInstance.unsetTouchEvents();
				this._hasGestureEvents = false;

				// Unset the event instance of gesture  events
				this._gestureEventInstance = undefined;
			}
		}

		/**
		 * Sets the gesture events to open/close the Sidebar on Native Apps
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		public setGestureEvents(
			onSwipeDownCallback: Callbacks.onSwipeDown,
			onSwipeLeftCallback: Callbacks.onSwipeLeft,
			onSwipeRightCallback: Callbacks.onSwipeRight,
			onSwipeUpCallback: Callbacks.onSwipeUp
		): void {
			this._gestureEventInstance.setEvents(
				onSwipeDownCallback,
				onSwipeLeftCallback,
				onSwipeRightCallback,
				onSwipeUpCallback
			);
			this._hasGestureEvents = true;
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
