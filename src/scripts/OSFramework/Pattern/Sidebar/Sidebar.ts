// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Sidebar {
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
		// Store the Sidebar direction
		private _currentDirectionCssClass: string;
		// Store the click event with bind(this)
		private _eventOverlayClick: GlobalCallbacks.Generic;
		// Store the keypress event with bind(this)
		private _eventSidebarKeypress: GlobalCallbacks.Generic;
		// Store focus trap instance
		private _focusTrapInstance: Behaviors.FocusTrap;
		// Store gesture events instance
		private _gestureEventInstance: Event.GestureEvent.DragEvent;
		// Store if the pattern has gesture events added
		private _hasGestureEvents: boolean;
		// Stores the current status of the sidebar
		private _isOpen: boolean;
		// Store if the Sidebar is Open
		private _onToggle: Callbacks.OSOnToggleEvent;
		// Store the parent element
		private _parentSelf: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SidebarConfig(configs));
			this._isOpen = this.configs.StartsOpen;
			this._currentDirectionCssClass = Enum.CssClass.ClassModifier + this.configs.Direction;
		}

		// Actual method that knows what is to close the sidebar
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

				if (this.configs.HasOverlay) {
					Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
				}
			}
		}

		// Add Focus Trap to Pattern
		private _handleFocusTrap(): void {
			const opts = {
				focusTargetElement: this._parentSelf,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);
		}

		// Method to hadnle the creation of the GestureEvents
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

		// Method to handle the start of a gesture
		private _onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			this._animateOnDragInstance.onDragEnd(offsetX, offsetY, timeTaken, this._toggle.bind(this));

			if (this.configs.HasOverlay) {
				Behaviors.OverlayTransitionOnDrag.UnSet(this.selfElement);
			}
		}

		// Method to handle the gesture move
		private _onGestureMove(x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void {
			this._animateOnDragInstance.onDragMove(offsetX, offsetY, x, y, evt);

			if (this.configs.HasOverlay) {
				Behaviors.OverlayTransitionOnDrag.Set(this.selfElement, x, this.configs.Direction, this.configs.Width);
			}
		}

		// Method to handle the end of a gesture
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

		// Actual method that knows what is to open the sidebar
		private _openSidebar() {
			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsOpen);
			Helper.A11Y.TabIndexTrue(this.selfElement);
			Helper.A11Y.AriaHiddenFalse(this.selfElement);

			// Add the A11Y states to focus trap
			this._focusTrapInstance.enableForA11y();

			if (this.isBuilt) {
				//let's only change the property and trigger the OS event IF the pattern is already built.
				this._isOpen = true;
				this._triggerOnToggleEvent();

				if (this.configs.HasOverlay) {
					Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
				}
			}

			this.selfElement.focus();
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);

			// Will handle the tabindex value of the elements inside pattern
			Helper.A11Y.SetElementsTabIndex(this._isOpen, this._focusTrapInstance.focusableElements);
		}

		// Overlay onClick event to close the Sidebar
		private _overlayClickCallback(_args: string, e: MouseEvent): void {
			if (this.selfElement === e.target) {
				if (this._isOpen) {
					this.close();
				}
			}

			e.stopPropagation();
		}

		// Method to remove the event listeners
		private _removeEvents(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);
			Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
		}

		// Set the Sidebar opening/closing direction
		private _setDirection(): void {
			// Reset direction class
			if (this._currentDirectionCssClass !== '') {
				Helper.Dom.Styles.RemoveClass(this.selfElement, this._currentDirectionCssClass);
			}
			this._currentDirectionCssClass = Enum.CssClass.ClassModifier + this.configs.Direction;
			Helper.Dom.Styles.AddClass(this.selfElement, this._currentDirectionCssClass);
		}

		// Sets the Sidebar overlay
		private _setHasOverlay(): void {
			const alreadyHasOverlayClass = Helper.Dom.Styles.ContainsClass(this.selfElement, Enum.CssClass.HasOverlay);

			if (this.configs.HasOverlay && alreadyHasOverlayClass === false) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.HasOverlay);
				if (this._isOpen) {
					Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
				}
			} else if (this.isBuilt) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.HasOverlay);
				if (this._isOpen) {
					Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
				}
			}
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			this._setDirection();
			this._setWidth();
			this._setHasOverlay();
			// Set IsOpen class
			if (this._isOpen) {
				this._openSidebar();
			}
		}

		// Set the Sidebar width
		private _setWidth(): void {
			Helper.Dom.Styles.SetStyleAttribute(this.selfElement, Enum.CssProperty.Width, this.configs.Width);
		}

		// Method that will handle the tab navigation and sidebar closing on Escape
		private _sidebarKeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			// Close the sidebar when pressing Esc
			if (isEscapedPressed) {
				this.close();
			}
		}

		// Method to toggle the Sidebar
		private _toggle(): void {
			if (this._isOpen) {
				this.close();
			} else {
				this.open();
			}
		}

		// Method to toggle gestures on Sidebar
		private _toggleGesturesSidebar(enableSwipes: boolean): void {
			if (enableSwipes && this._hasGestureEvents === false) {
				if (this._gestureEventInstance === undefined) {
					this._handleGestureEvents();
				}
			} else if (enableSwipes === false && this._hasGestureEvents) {
				this.removeGestureEvents();
			}
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(): void {
			Helper.AsyncInvocation(this._onToggle, this.widgetId, this._isOpen);
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
		}

		/**
		 * Release references to HTML elements.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		protected unsetHtmlElements(): void {
			this._parentSelf = undefined;
		}

		/**
		 * Method to build the pattern.
		 *
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public build(): void {
			super.build();

			this.setCallbacks();

			this.setHtmlElements();

			this._handleFocusTrap();

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
		 * Set callbacks for the onToggle event
		 *
		 * @param {Callbacks.OSOnToggleEvent} callback
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
		 */
		public registerCallback(callback: Callbacks.OSOnToggleEvent): void {
			if (this._onToggle === undefined) {
				this._onToggle = callback;
			} else {
				console.warn(`The ${GlobalEnum.PatternName.Sidebar} already has the toggle callback set.`);
			}
		}

		/**
		 * Removes the gesture events to open/close the Sidebar on Native Apps
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
		 * Sets the gesture events to open/close the Sidebar on Native Apps
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
		 * @memberof OSFramework.Patterns.Sidebar.Sidebar
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
