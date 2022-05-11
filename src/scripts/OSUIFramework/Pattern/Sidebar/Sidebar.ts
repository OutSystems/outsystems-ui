// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 *
	 * @export
	 * @class Sidebar
	 * @extends {AbstractPattern<SidebarConfig>}
	 * @implements {ISidebar}
	 */
	export class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar, Interface.IGestureEventPattern {
		// Store the Sidebar direction
		private _currentDirectionCssClass: string;
		// Store the click event with bind(this)
		private _eventOverlayClick: Callbacks.Generic;
		// Store the keypress event with bind(this)
		private _eventSidebarKeypress: Callbacks.Generic;
		// Store the first element to receive focus in the sidebar
		private _firstFocusableElem: HTMLElement;
		// Store focusable element inside sidebar
		private _focusableElems: HTMLElement[];
		// Store the if the Sidebar is moving on Native Gestures
		private _isMoving: boolean;
		// Stores the current status of the sidebar
		private _isOpen: boolean;
		// Store the last element to receive focus in the sidebar
		private _lastFocusableElem: HTMLElement;
		// Store if the Sidebar is Open
		private _onToggle: Callbacks.OSSidebarToggleEvent;

		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _animateOnDrag: any;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SidebarConfig(configs));
			this._isOpen = this.configs.StartsOpen;
			this._currentDirectionCssClass = Enum.CssClass.ClassModifier + this.configs.Direction;
		}

		// Actual method that knows what is to close the sidebar
		private _closeSidebar(): void {
			this._isOpen = false;

			if (this.isBuilt) {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsOpen);
				Helper.A11Y.TabIndexFalse(this._selfElem);
				Helper.A11Y.AriaHiddenTrue(this._selfElem);

				this._triggerOnToggleEvent();
				this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);

				this._setFocusableElementsTabindex();

				if (this.configs.HasOverlay) {
					Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
				}
			}
		}

		// Actual method that knows what is to open the sidebar
		private _openSidebar() {
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsOpen);
			Helper.A11Y.TabIndexTrue(this._selfElem);
			Helper.A11Y.AriaHiddenFalse(this._selfElem);

			if (this.isBuilt) {
				//let's only change the property and trigger the OS event IF the pattern is already built.
				this._isOpen = true;
				this._triggerOnToggleEvent();

				if (this.configs.HasOverlay) {
					Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
				}
			}

			this._selfElem.focus();
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);

			this._setFocusableElementsTabindex();
		}

		// Overlay onClick event to close the Sidebar
		private _overlayClickCallback(args: string, e: MouseEvent): void {
			if (this._selfElem === e.target) {
				if (this._isOpen) {
					this.close();
				}
			}

			e.stopPropagation();
		}

		// Method to remove the event listeners
		private _removeEvents(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);
			Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
		}

		// Set the Sidebar opening/closing direction
		private _setDirection(): void {
			// Reset direction class
			if (this._currentDirectionCssClass !== '') {
				Helper.Dom.Styles.RemoveClass(this._selfElem, this._currentDirectionCssClass);
			}
			this._currentDirectionCssClass = Enum.CssClass.ClassModifier + this.configs.Direction;
			Helper.Dom.Styles.AddClass(this._selfElem, this._currentDirectionCssClass);
		}

		// Method that will handle the tabindex value of the elements inside the Sidebar
		private _setFocusableElementsTabindex(): void {
			const setA11YtabIndex = this._isOpen ? Helper.A11Y.TabIndexTrue : Helper.A11Y.TabIndexFalse;

			// On each element, toggle the tabindex value, depending if sidebar is open or closed
			this._focusableElems.slice().forEach((item: HTMLElement) => {
				setA11YtabIndex(item);
			});
		}

		// Sets the Sidebar overlay
		private _setHasOverlay(): void {
			const alreadyHasOverlayClass = Helper.Dom.Styles.ContainsClass(this._selfElem, Enum.CssClass.HasOverlay);

			if (this.configs.HasOverlay && alreadyHasOverlayClass === false) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.HasOverlay);
				if (this._isOpen) {
					Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
				}
			} else if (this.isBuilt) {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.HasOverlay);
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

		// Method to handle the overlay transition on gestures
		private _setOverlayTransition(x: number): void {
			const isLeft = this.configs.Direction === GlobalEnum.Direction.Left;
			const currentOpacity = parseInt(this._selfElem.style.getPropertyValue('--overlay-opacity'));

			const percentageBeforeDif = (Math.abs(x) * 100) / parseInt(this.configs.Width);
			const percentage = isLeft ? 0 + percentageBeforeDif : 100 - percentageBeforeDif;

			const newOpacity = Math.floor(percentage) / 100;

			if (currentOpacity !== newOpacity && newOpacity % 1 !== 0) {
				Helper.Dom.Styles.SetStyleAttribute(this._selfElem, '--overlay-opacity', newOpacity);
			}
		}

		// Set the Sidebar width
		private _setWidth(): void {
			Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, this.configs.Width);
		}

		// Method that will handle the tab navigation and sidebar closing on Escape
		private _sidebarKeypressCallback(e: KeyboardEvent): void {
			const isTabPressed = e.key === GlobalEnum.Keycodes.Tab;
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;
			const isShiftPressed = e.shiftKey;

			if (!isTabPressed && !isEscapedPressed) {
				return;
			}

			// Close the sidebar when pressing Esc
			if (isEscapedPressed) {
				this.close();
			}

			// If pressing shift + tab do a focus trap inside the sidebar
			if (isShiftPressed) {
				if (document.activeElement === this._firstFocusableElem) {
					this._lastFocusableElem.focus();
					e.preventDefault();
				}
			} else if (document.activeElement === this._lastFocusableElem) {
				this._firstFocusableElem.focus();
				e.preventDefault();
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

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(): void {
			Helper.AsyncInvocation(this._onToggle, this.widgetId, this._isOpen);
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		protected setA11YProperties(): void {
			Helper.A11Y.RoleComplementary(this._selfElem);
			Helper.A11Y.AriaHasPopupTrue(this._selfElem);

			if (this._isOpen) {
				Helper.A11Y.TabIndexTrue(this._selfElem);
				Helper.A11Y.AriaHiddenFalse(this._selfElem);
			} else {
				Helper.A11Y.TabIndexFalse(this._selfElem);
				Helper.A11Y.AriaHiddenTrue(this._selfElem);
			}
		}

		/**
		 * Sets the callbacks to be used in the pattern.
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		protected setCallbacks(): void {
			this._eventSidebarKeypress = this._sidebarKeypressCallback.bind(this);
			this._eventOverlayClick = this._overlayClickCallback.bind(this);
		}

		/**
		 * Sets the gesture events to open/close the Sidebar on Native Apps
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		protected setGestureEvents(): void {
			super.addDragEvents(this._selfElem, this.onGestureStart, this.onGestureMove, this.onGestureEnd);
			this._animateOnDrag = new Helper.AnimateOnDrag(this._selfElem);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		protected setHtmlElements(): void {
			this._focusableElems = [...this._selfElem.querySelectorAll(Constants.FocusableElems)] as HTMLElement[];

			// to handle focusable element's tabindex when toggling the sidebar
			this._firstFocusableElem = this._focusableElems[0];
			this._lastFocusableElem = this._focusableElems[this._focusableElems.length - 1];

			this._setWidth();
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof Sidebar
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
		 * @memberof Sidebar
		 */
		protected unsetHtmlElements(): void {
			this._focusableElems = undefined;
			// to handle focusable element's tabindex when toggling the sidebar
			this._firstFocusableElem = undefined;
			this._lastFocusableElem = undefined;
		}

		/**
		 * Method to build the pattern.
		 *
		 * @memberof Sidebar
		 */
		public build(): void {
			super.build();

			this.setCallbacks();

			this.setHtmlElements();

			this._setInitialCssClasses();

			this.setA11YProperties();

			if (Helper.DeviceInfo.IsNative) {
				this.setGestureEvents();
			}

			this.setGestureEvents();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof Sidebar
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
		 * @memberof Sidebar
		 */
		public close(): void {
			if (this._isOpen) {
				this._closeSidebar();
			}
		}

		/**
		 * Method to remove event listener and destroy sidebar instance
		 *
		 * @memberof Sidebar
		 */
		public dispose(): void {
			this.unsetCallbacks();
			this.unsetHtmlElements();
			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Method to handle the start of a gesture
		 *
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} timeTaken
		 * @return {*}  {void}
		 * @memberof Sidebar
		 */
		public onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			this._animateOnDrag.onDragEnd(offsetX, offsetY, timeTaken, this._toggle.bind(this));

			if (this.configs.HasOverlay) {
				Helper.Dom.Styles.SetStyleAttribute(this._selfElem, '--overlay-opacity', 0);
			}
		}

		/**
		 * Method to handle the gesture move
		 *
		 * @param {number} x
		 * @param {number} y
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {TouchEvent} evt
		 * @return {*}  {void}
		 * @memberof Sidebar
		 */
		public onGestureMove(x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void {
			this._animateOnDrag.onDragMove(offsetX, offsetY, x, y, evt);

			if (this.configs.HasOverlay) {
				this._setOverlayTransition(x);
			}
		}

		/**
		 * Method to handle the end of a gesture
		 *
		 * @param {number} x
		 * @param {number} y
		 * @memberof Sidebar
		 */
		public onGestureStart(x: number, y: number): void {
			this._animateOnDrag.onDragStart(false, GlobalEnum.Direction.Right, x, y, this._isOpen, this.configs.Width);
		}

		/**
		 * Method that opens the sidebar.
		 *
		 * @memberof Sidebar
		 */
		public open(): void {
			if (this._isOpen === false) {
				this._openSidebar();
			}
		}

		/**
		 * Set callbacks for the onToggle event
		 *
		 * @param {Callbacks.OSSidebarToggleEvent} callback
		 * @memberof Sidebar
		 */
		public registerCallback(callback: Callbacks.OSSidebarToggleEvent): void {
			if (this._onToggle === undefined) {
				this._onToggle = callback;
			} else {
				console.warn(`The ${GlobalEnum.PatternsNames.Sidebar} already has the toggle callback set.`);
			}
		}
	}
}
