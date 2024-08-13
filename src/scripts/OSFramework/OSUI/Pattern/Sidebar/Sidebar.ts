// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 *
	 * @export
	 * @class Sidebar
	 * @extends {AbstractPattern<SidebarConfig>}
	 * @implements {ISidebar}
	 */
	export class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar, Interface.IDragEvent {
		// Hold the animateOnDrag intance, that helps transition the sidebar on drag
		private _animateOnDragInstance: Behaviors.AnimateOnDrag;
		// Hold the value to toggle the outside click to close behavior
		private _clickOutsideToClose: boolean;
		// Store if the click was outside the sidebar
		private _clickedOutsideElement: boolean;
		// Store the Sidebar direction
		private _currentDirectionCssClass: string;
		// Store the click event with bind(this)
		private _eventOverlayClick: GlobalCallbacks.Generic;
		// Store the mousedown event with bind(this)
		private _eventOverlayMouseDown: GlobalCallbacks.Generic;
		// Store the keypress event with bind(this)
		private _eventSidebarKeypress: GlobalCallbacks.Generic;
		// Store focus manager instance
		private _focusManagerInstance: Behaviors.FocusManager;
		// Store focus trap instance
		private _focusTrapInstance: Behaviors.FocusTrap;
		// Store gesture events instance
		private _gestureEventInstance: Event.GestureEvent.DragEvent;
		// Store if the pattern has gesture events added
		private _hasGestureEvents: boolean;
		// Stores the current status of the sidebar
		private _isOpen: boolean;
		// Store the parent element
		private _parentSelf: HTMLElement;
		// Store the platform events
		private _platformEventOnToggle: Callbacks.OSOnToggleEvent;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SidebarConfig(configs));
			this._isOpen = this.configs.StartsOpen;
			this._currentDirectionCssClass = Enum.CssClass.ClassModifier + this.configs.Direction;
		}

		/**
		 * Method to close Sidebar
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _closeSidebar(): void {
			this._isOpen = false;

			// Remove the A11Y states to focus trap
			this._focusTrapInstance.disableForA11y();

			if (this.isBuilt) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsOpen);
				Helper.A11Y.TabIndexFalse(this.selfElement);
				Helper.A11Y.AriaHiddenTrue(this.selfElement);

				this._triggerOnToggleEvent();
				this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);

				// Will handle the tabindex value of the elements inside pattern
				Helper.A11Y.SetElementsTabIndex(this._isOpen, this._focusTrapInstance.focusableElements);

				if (this._clickOutsideToClose || (this.configs.HasOverlay && this._clickOutsideToClose === undefined)) {
					Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
						Event.DOMEvents.Listeners.Type.BodyOnMouseDown,
						this._eventOverlayMouseDown
					);
					Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
						Event.DOMEvents.Listeners.Type.BodyOnClick,
						this._eventOverlayClick
					);
				}
			}
			this._focusManagerInstance.setFocusToStoredElement();
		}

		/**
		 * Method to add Focus Trap to Pattern
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _handleFocusBehavior(): void {
			const opts = {
				focusTargetElement: this._parentSelf,
				canContainOtherPatterns: true,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);

			this._focusManagerInstance = new Behaviors.FocusManager();

			// Disable tabIndex to the inner focusable elements if its start closed!
			if (this._isOpen === false) {
				// Will handle the tabindex value of the elements inside pattern
				Helper.A11Y.SetElementsTabIndex(false, this._focusTrapInstance.focusableElements);
			}
		}

		/**
		 * Method to handle the creation of the GestureEvents
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _handleGestureEvents(): void {
			if (Helper.DeviceInfo.IsNative) {
				// Create and save gesture event instance. Created here and not on constructor,
				// as we need to pass this.selfElement, only available after super.build()
				this._gestureEventInstance = new Event.GestureEvent.DragEvent(this.selfElement);

				// Set event listeners and callbacks
				this.setGestureEvents(
					this._onGestureStart.bind(this),
					this._onGestureMove.bind(this),
					this._onGestureEnd.bind(this)
				);
				// Apply transform on an element and perform animation
				this._animateOnDragInstance = new Behaviors.AnimateOnDrag(this.selfElement);
			}
		}

		/**
		 * Method to handle the start of a gesture
		 *
		 * @private
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} timeTaken
		 * @memberof Sidebar
		 */
		private _onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			this._animateOnDragInstance.onDragEnd(offsetX, offsetY, timeTaken, this._toggle.bind(this));

			if (this.configs.HasOverlay) {
				Behaviors.OverlayTransitionOnDrag.UnSet(this.selfElement);
			}
		}

		/**
		 * Method to handle the gesture move
		 *
		 * @private
		 * @param {number} x
		 * @param {number} y
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {TouchEvent} evt
		 * @memberof Sidebar
		 */
		private _onGestureMove(x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void {
			this._animateOnDragInstance.onDragMove(offsetX, offsetY, x, y, evt);

			if (this.configs.HasOverlay) {
				Behaviors.OverlayTransitionOnDrag.Set(this.selfElement, x, this.configs.Direction, this.configs.Width);
			}
		}

		/**
		 * Method to handle the end of a gesture
		 *
		 * @private
		 * @param {number} x
		 * @param {number} y
		 * @memberof Sidebar
		 */
		private _onGestureStart(x: number, y: number): void {
			this._animateOnDragInstance.onDragStart(
				false,
				this.configs.Direction,
				x,
				y,
				this._isOpen,
				this.configs.Width
			);
		}

		/**
		 * Method to open Sidebar
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _openSidebar() {
			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsOpen);
			Helper.A11Y.TabIndexTrue(this.selfElement);
			Helper.A11Y.AriaHiddenFalse(this.selfElement);

			// Add the A11Y states to focus trap
			this._focusTrapInstance.enableForA11y();

			this._focusManagerInstance.storeLastFocusedElement();

			if (this.isBuilt) {
				//let's only change the property and trigger the OS event IF the pattern is already built.
				this._isOpen = true;
				this._triggerOnToggleEvent();

				if (this._clickOutsideToClose || (this.configs.HasOverlay && this._clickOutsideToClose === undefined)) {
					Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
						Event.DOMEvents.Listeners.Type.BodyOnMouseDown,
						this._eventOverlayMouseDown
					);
					Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
						Event.DOMEvents.Listeners.Type.BodyOnClick,
						this._eventOverlayClick
					);
				}
			}

			this.selfElement.focus();
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);

			// Will handle the tabindex value of the elements inside pattern
			Helper.A11Y.SetElementsTabIndex(this._isOpen, this._focusTrapInstance.focusableElements);
		}

		/**
		 * Method to close Sidebar on an overlay click
		 *
		 * @private
		 * @param {string} _args
		 * @param {MouseEvent} e
		 * @memberof Sidebar
		 */
		private _overlayClickCallback(_args: string, e: MouseEvent): void {
			// If the sidebar is opened and the mouse down event occured outside the sidebar, close it.
			if (
				this._isOpen &&
				this._clickedOutsideElement &&
				(e.target === this.selfElement || this._clickOutsideToClose)
			) {
				this.close();
			}
			e.stopPropagation();
		}

		/**
		 * Method to check if the mouse down event happened outside the sidebar
		 * This is required to cover the cases when selecting text and moving the cursor to the sidebar's overlay.
		 *
		 * @private
		 * @param {string} _args
		 * @param {MouseEvent} e
		 * @memberof Sidebar
		 */
		private _overlayMouseDownCallback(_args: string, e: MouseEvent): void {
			const targetElem = e.target as HTMLElement;
			this._clickedOutsideElement = true;
			if (
				targetElem.closest(`${Constants.Dot}${Enum.CssClass.Header}`) ||
				targetElem.closest(`${Constants.Dot}${Enum.CssClass.Content}`)
			) {
				// If the click was inside the side bar, then change the flag to false.
				this._clickedOutsideElement = false;
			}
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _removeEvents(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnMouseDown,
				this._eventOverlayMouseDown
			);
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.BodyOnClick,
				this._eventOverlayClick
			);
		}

		/**
		 * Method to set the Sidebar opening/closing direction
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setDirection(): void {
			// Reset direction class
			if (this._currentDirectionCssClass !== '') {
				Helper.Dom.Styles.RemoveClass(this.selfElement, this._currentDirectionCssClass);
			}
			this._currentDirectionCssClass = Enum.CssClass.ClassModifier + this.configs.Direction;
			Helper.Dom.Styles.AddClass(this.selfElement, this._currentDirectionCssClass);
		}

		/**
		 * Method to sets the Sidebar overlay
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setHasOverlay(): void {
			const alreadyHasOverlayClass = Helper.Dom.Styles.ContainsClass(this.selfElement, Enum.CssClass.HasOverlay);

			if (this.configs.HasOverlay && alreadyHasOverlayClass === false) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.HasOverlay);
			} else if (this.isBuilt) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.HasOverlay);
			}
		}

		/**
		 * Method to set the cssClasses that should be assigned to the element on it's initialization
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setInitialCssClasses(): void {
			this._setDirection();
			this._setWidth();
			this._setHasOverlay();
			// Set IsOpen class
			if (this._isOpen) {
				this._openSidebar();
			}
		}

		/**
		 * Method to set the Sidebar width
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setWidth(): void {
			Helper.Dom.Styles.SetStyleAttribute(this.selfElement, Enum.CssProperty.Width, this.configs.Width);
		}

		/**
		 * Method that will handle the tab navigation and sidebar closing on Escape
		 *
		 * @private
		 * @param {KeyboardEvent} e
		 * @memberof Sidebar
		 */
		private _sidebarKeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			// Close the sidebar when pressing Esc
			if (isEscapedPressed) {
				this.close();
			}

			e.stopPropagation();
		}

		/**
		 * Method to toggle the Sidebar
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _toggle(): void {
			if (this._isOpen) {
				this.close();
			} else {
				this.open();
			}
		}

		/**
		 * Method to toggle gestures on Sidebar
		 *
		 * @private
		 * @param {boolean} enableSwipes
		 * @memberof Sidebar
		 */
		private _toggleGesturesSidebar(enableSwipes: boolean): void {
			if (enableSwipes && this._hasGestureEvents === false) {
				if (this._gestureEventInstance === undefined) {
					this._handleGestureEvents();
				}
			} else if (enableSwipes === false && this._hasGestureEvents) {
				this.removeGestureEvents();
			}
		}

		/**
		 * Method that triggers the OnToggle event
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _triggerOnToggleEvent(): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggle, this._isOpen);
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		protected setA11YProperties(): void {
			Helper.A11Y.RoleComplementary(this.selfElement);
			Helper.A11Y.AriaHasPopupTrue(this.selfElement);
			// Set the attr that will be used to define the default tabindex element
			Helper.Dom.Attribute.Set(this.selfElement, Constants.FocusableTabIndexDefault, Constants.EmptyString);

			if (this._isOpen) {
				Helper.A11Y.TabIndexTrue(this.selfElement);
				Helper.A11Y.AriaHiddenFalse(this.selfElement);
			} else {
				Helper.A11Y.TabIndexFalse(this.selfElement);
				Helper.A11Y.AriaHiddenTrue(this.selfElement);
			}
		}

		/**
		 * Sets the callbacks to be used in the pattern.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		protected setCallbacks(): void {
			this._eventSidebarKeypress = this._sidebarKeypressCallback.bind(this);
			this._eventOverlayClick = this._overlayClickCallback.bind(this);
			this._eventOverlayMouseDown = this._overlayMouseDownCallback.bind(this);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		protected setHtmlElements(): void {
			this._parentSelf = Helper.Dom.GetElementById(this.widgetId);

			this._setWidth();
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();

			this._eventSidebarKeypress = undefined;
			this._eventOverlayClick = undefined;
			this._eventOverlayMouseDown = undefined;
		}

		/**
		 * Release references to HTML elements.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		protected unsetHtmlElements(): void {
			this._parentSelf = undefined;
			this._platformEventOnToggle = undefined;
		}

		/**
		 * Method to build the Sidebar
		 *
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public build(): void {
			super.build();

			this.setCallbacks();

			this.setHtmlElements();

			this._handleFocusBehavior();

			this._setInitialCssClasses();

			this.setA11YProperties();

			this._handleGestureEvents();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.StartsOpen:
						console.warn(
							`Sidebar (${this.widgetId}): changes to ${Enum.Properties.StartsOpen} parameter do not affect the sidebar. Use the client actions 'SidebarOpen' and 'SidebarClose' to affect the Sidebar.`
						);
						break;
					case Enum.Properties.Direction:
						this._setDirection();
						break;
					case Enum.Properties.Width:
						this._setWidth();
						break;
					case Enum.Properties.HasOverlay:
						this._setHasOverlay();
						break;
				}
			}
		}

		/**
		 * Public method to toggle the click on outside to close the sidebar.
		 *
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public clickOutsideToClose(closeOnOutSideClick: boolean): void {
			this._clickOutsideToClose = closeOnOutSideClick;
		}

		/**
		 * Public method to close the sidebar, if it's open.
		 *
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public close(): void {
			if (this._isOpen) {
				this._closeSidebar();
			}
		}

		/**
		 * Method to remove event listener and destroy sidebar instance
		 *
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public dispose(): void {
			this.unsetCallbacks();

			this.unsetHtmlElements();

			// Remove focus trap events and callbacks
			this._focusTrapInstance.dispose();

			// Remove gesture events
			if (this._hasGestureEvents) {
				this.removeGestureEvents();
			}

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Method that opens the sidebar.
		 *
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public open(): void {
			if (this._isOpen === false) {
				this._openSidebar();
			}
		}

		/**
		 * Method to set the callbacks for the pattern
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Patterns.Sidebar.Enum.Events.OnToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					} else {
						console.warn(`The ${GlobalEnum.PatternName.Sidebar} already has the toggle callback set.`);
					}
					break;

				default:
					super.registerCallback(eventName, callback);
			}
		}

		/**
		 * Method that removes the gesture events to open/close the Sidebar on Native Apps
		 *
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
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
		 * Method that sets the gesture events to open/close the Sidebar on Native Apps
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public setGestureEvents(
			onGestureStartCallback: Event.GestureEvent.Callbacks.GestureStart,
			onGestureMoveCallback: Event.GestureEvent.Callbacks.GestureMove,
			onGestureEndCallback: Event.GestureEvent.Callbacks.GestureEnd
		): void {
			this._gestureEventInstance.setSwipeEvents(
				onGestureStartCallback,
				onGestureMoveCallback,
				onGestureEndCallback
			);
			this._hasGestureEvents = true;
		}

		/**
		 * Method that toggle swipes on sidebar.
		 *
		 * @param {boolean} enableSwipe
		 * @memberof Sidebar
		 */
		public toggleGestures(enableSwipe: boolean): void {
			this._toggleGesturesSidebar(enableSwipe);
		}

		/**
		 * Get Gesture Events Instance
		 *
		 * @readonly
		 * @type {Event.GestureEvent.DragEvent}
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public get gestureEventInstance(): Event.GestureEvent.DragEvent {
			return this._gestureEventInstance;
		}

		/**
		 * Get if has gesture events
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public get hasGestureEvents(): boolean {
			return this._hasGestureEvents;
		}
	}
}
