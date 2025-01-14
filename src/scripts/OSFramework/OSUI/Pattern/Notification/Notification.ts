// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Notification {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Notification
		extends AbstractPattern<NotificationConfig>
		implements INotification, Interface.ISwipeEvent
	{
		// Store the auto close timeout id
		private _autoCloseTimeoutId: number;
		// Store the click event with bind(this)
		private _eventOnClick: GlobalCallbacks.Generic;
		// Store the keypress event with bind(this)
		private _eventOnKeypress: GlobalCallbacks.Generic;
		// Define the event to be applied based on device
		private _eventType: string;
		// Store focus manager instance
		private _focusManagerInstance: Behaviors.FocusManager;
		// Store focus trap instance
		private _focusTrapInstance: Behaviors.FocusTrap;
		// Store gesture events instance
		private _gestureEventInstance: Event.GestureEvent.SwipeEvent;
		// Store if the pattern has gesture events added
		private _hasGestureEvents: boolean;
		// Store pattern visibility
		private _isOpen: boolean;
		// Store the parent element
		private _parentSelf: HTMLElement;
		// Store the platform events
		private _platformEventOnToggle: Callbacks.OSOnToggleEvent;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new NotificationConfig(configs));

			// Set the pattern default values if is empty
			this.configs.Width = this.configs.Width !== '' ? this.configs.Width : Enum.Defaults.DefaultWidth;
			this.configs.Position =
				this.configs.Position !== '' ? this.configs.Position : Enum.Defaults.DefaultPosition;
			this._isOpen = this.configs.StartsOpen;
		}

		/**
		 * Method to close Notification after wait the time defined
		 *
		 * @private
		 * @memberof Notification
		 */
		private _autoCloseNotification(): void {
			this._autoCloseTimeoutId = Helper.ApplySetTimeOut(() => {
				this.hide();
			}, this.configs.CloseAfterTime);
		}

		/**
		 * Method to trigger the notification at toggle behaviour
		 *
		 * @private
		 * @param {MouseEvent} e
		 * @memberof Notification
		 */
		private _clickCallback(e: MouseEvent): void {
			e.preventDefault();
			this.hide();
		}

		/**
		 * Method to add Focus Trap to Pattern
		 *
		 * @private
		 * @memberof Notification
		 */
		private _handleFocusBehavior(): void {
			const opts = {
				focusTargetElement: this._parentSelf,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);

			this._focusManagerInstance = new Behaviors.FocusManager();
		}

		/**
		 * Method to handle the creation of the GestureEvents
		 *
		 * @private
		 * @memberof Notification
		 */
		private _handleGestureEvents(): void {
			if (Helper.DeviceInfo.IsNative) {
				// Create and save gesture event instance. Created here and not on constructor,
				// as we need to pass this.selfElement, only available after super.build()
				this._gestureEventInstance = new Event.GestureEvent.SwipeEvent(this.selfElement);

				//Set event listeners and callbacks
				this.setGestureEvents(
					this.onSwipeBottom.bind(this),
					this.onSwipeLeft.bind(this),
					this.onSwipeRight.bind(this),
					this.onSwipeUp.bind(this)
				);
			}
		}

		/**
		 * Method to hide Notification
		 *
		 * @private
		 * @memberof Notification
		 */
		private _hideNotification(): void {
			this._isOpen = false;

			// Remove the A11Y states to focus trap
			this._focusTrapInstance.disableForA11y();

			Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._isOpen);

			// Update accessibility properties
			this._updateA11yProperties();

			// Remove focus when a Notification is closed
			this.selfElement.blur();

			// Focus on last element clicked
			this._focusManagerInstance.setFocusToStoredElement();

			// Remove listeners to toggle Notification
			if (Helper.DeviceInfo.IsNative === false && this.configs.InteractToClose) {
				this.selfElement.removeEventListener(this._eventType, this._eventOnClick);
				this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
			}
		}

		/**
		 * Method to call open or close, based ok e.key and behavior applied
		 *
		 * @private
		 * @param {KeyboardEvent} e
		 * @memberof Notification
		 */
		private _keypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			// Close the Notification when pressing Esc
			if (isEscapedPressed && this._isOpen) {
				this.hide();
			}
		}

		/**
		 * Method to remove all the assigned events
		 *
		 * @private
		 * @memberof Notification
		 */
		private _removeEvents(): void {
			this.selfElement.removeEventListener(this._eventType, this._eventOnClick);
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);
		}

		/**
		 * Method to show Notification
		 *
		 * @private
		 * @memberof Notification
		 */
		private _showNotification(): void {
			this._focusManagerInstance.storeLastFocusedElement();
			this._isOpen = true;

			// Add the A11Y states to focus trap
			this._focusTrapInstance.enableForA11y();

			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternIsOpen);

			// Trigger Notification event with new status
			this._triggerOnToggleEvent(this._isOpen);

			// Update accessibility properties
			this._updateA11yProperties();

			// Add listeners to toggle Notification
			if (Helper.DeviceInfo.IsNative === false && this.configs.InteractToClose) {
				this.selfElement.addEventListener(this._eventType, this._eventOnClick);
			}

			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			// Focus on element when Notification is open
			this.selfElement.focus();

			if (this.configs.CloseAfterTime > 0) {
				this._autoCloseNotification();
			}
		}

		/**
		 * Method to trigger the OnToggle event
		 *
		 * @private
		 * @param {boolean} isOpen
		 * @memberof Notification
		 */
		private _triggerOnToggleEvent(isOpen: boolean): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggle, isOpen);
		}

		/**
		 * Method to set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @private
		 * @memberof Notification
		 */
		private _updateA11yProperties(): void {
			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.Aria.Hidden,
				(!this._isOpen).toString()
			);

			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.TabIndex,
				this._isOpen
					? Constants.A11YAttributes.States.TabIndexShow
					: Constants.A11YAttributes.States.TabIndexHidden
			);

			// Will handle the tabindex value of the elements inside pattern
			Helper.A11Y.SetElementsTabIndex(this._isOpen, this._focusTrapInstance.focusableElements);
		}

		/**
		 * Method to update time to apply on AutoClose
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
		 * Method to update time to apply on AutoClose
		 *
		 * @private
		 * @param {boolean} value
		 * @memberof Notification
		 */
		private _updateInteractToClose(value: boolean): void {
			if (this.configs.InteractToClose !== value) {
				this.configs.InteractToClose = value;
				if (Helper.DeviceInfo.IsNative === false) {
					if (this.configs.InteractToClose) {
						this.selfElement.addEventListener(this._eventType, this._eventOnClick);
					} else {
						this.selfElement.removeEventListener(this._eventType, this._eventOnClick);
					}
				}
			}
		}

		/**
		 * Method to update position
		 *
		 * @private
		 * @param {string} position
		 * @memberof Notification
		 */
		private _updatePosition(position: string): void {
			// Only change classes if are different
			if (this.configs.Position !== position) {
				// Reset direction class
				if (this.configs.Position !== '') {
					Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.PatternPosition + position);
				}

				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternPosition + this.configs.Position);
			}
		}

		/**
		 * Method to update width
		 *
		 * @private
		 * @param {string} width
		 * @memberof Notification
		 */
		private _updateWidth(width: string): void {
			this.configs.Width = width;
			if (width !== '') {
				// Update css variable
				Helper.Dom.Styles.SetStyleAttribute(this.selfElement, Enum.CssProperty.Width, width);
				this.configs.Width = width;
			}
		}

		/**
		 *	Method to clear timeouts
		 *
		 * @protected
		 * @memberof Notification
		 */
		protected clearTimeouts(): void {
			if (this.configs.CloseAfterTime > 0) {
				clearTimeout(this._autoCloseTimeoutId);
			}
		}

		/**
		 * Method to set the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		protected setA11YProperties(): void {
			Helper.Dom.Attribute.Set(
				this.selfElement,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.AlertDialog
			);

			// Update accessibility properties
			this._updateA11yProperties();
		}

		/**
		 *  Method to set the callbacks to be used in the pattern.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._clickCallback.bind(this);
			this._eventOnKeypress = this._keypressCallback.bind(this);
		}

		/**
		 * Method to set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		protected setHtmlElements(): void {
			this._parentSelf = Helper.Dom.GetElementById(this.widgetId);
		}

		/**
		 * Method to set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		protected setInitialStates(): void {
			// Set event if device is touch
			if (Helper.DeviceInfo.IsTouch) {
				this._eventType = GlobalEnum.HTMLEvent.TouchStart;
			} else {
				this._eventType = GlobalEnum.HTMLEvent.Click;
			}

			// Set width value for Notification
			Helper.Dom.Styles.SetStyleAttribute(this.selfElement, Enum.CssProperty.Width, this.configs.Width);

			// Set position initial class
			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.PatternPosition + this.configs.Position);

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
		 * @memberof OSFramework.Patterns.Notification.Notification
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
		 * Method to reassign the HTML elements to undefined, preventing memory leaks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		protected unsetHtmlElements(): void {
			this._parentSelf = undefined;
			this._platformEventOnToggle = undefined;
		}

		/**
		 * Method to build the Notification
		 *
		 * @memberof Notification
		 */
		public build(): void {
			super.build();

			// Add timeout to make this method call asynchronous to wait for the classes of device detection
			Helper.AsyncInvocation(this.setInitialStates.bind(this));

			this.setCallbacks();

			this.setHtmlElements();

			this._handleFocusBehavior();

			this.setA11YProperties();

			this._handleGestureEvents();

			this.finishBuild();
		}

		/**
		 * Method to update value when a parameters changed occurs
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.Notification.Notification
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
							this.selfElement,
							this.configs.ExtendedClass,
							propertyValue as string
						);
						break;
				}
			}
		}

		/**
		 * Method to destroy the Notification
		 *
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		public dispose(): void {
			if (this.isBuilt) {
				// Remove Callbacks
				this.unsetCallbacks();

				// Clear Timeouts
				this.clearTimeouts();

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
		 * Method to hide the notification, if it's visible.
		 *
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		public hide(): void {
			if (this._isOpen) {
				this._hideNotification();
				this.clearTimeouts();
			}
		}

		/**
		 * Method to handle the platform swipe bottom gesture
		 *
		 * @memberof OSFramework.Patterns.Notification.Notification
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
		 * Method to handle the platform swipe left gesture
		 *
		 * @memberof OSFramework.Patterns.Notification.Notification
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
		 * Method to handle the platform swipe right gesture
		 *
		 * @memberof OSFramework.Patterns.Notification.Notification
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
		 * Method to handle the platform swipe top gesture
		 *
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		public onSwipeUp(): void {
			this.hide();
		}

		/**
		 * Method to register the provider callback
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Patterns.Notification.Enum.Events.OnToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					}
					break;

				default:
					super.registerCallback(eventName, callback);
			}
		}

		/**
		 * Method to remove the gesture events to open/close the Notification on Mobile Apps
		 *
		 * @memberof OSFramework.Patterns.Notification.Notification
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
		 * Method to set the gesture events to open/close the Notification on Native Apps
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		public setGestureEvents(
			onSwipeDownCallback: Event.GestureEvent.Callbacks.SwipeDown,
			onSwipeLeftCallback: Event.GestureEvent.Callbacks.SwipeLeft,
			onSwipeRightCallback: Event.GestureEvent.Callbacks.SwipeRight,
			onSwipeUpCallback: Event.GestureEvent.Callbacks.SwipeUp
		): void {
			this._gestureEventInstance.setSwipeEvents(
				onSwipeDownCallback,
				onSwipeLeftCallback,
				onSwipeRightCallback,
				onSwipeUpCallback
			);
			this._hasGestureEvents = true;
		}

		/**
		 * Method to show the notification, if it's closed.
		 *
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		public show(): void {
			if (this._isOpen === false) {
				this._showNotification();
			}
		}

		/**
		 * Method to get Gesture Events Instance
		 *
		 * @readonly
		 * @type {Event.GestureEvent.SwipeEvent}
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		public get gestureEventInstance(): Event.GestureEvent.SwipeEvent {
			return this._gestureEventInstance;
		}

		/**
		 * Method to check if gesture events is applied
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.Notification.Notification
		 */
		public get hasGestureEvents(): boolean {
			return this._hasGestureEvents;
		}
	}
}
