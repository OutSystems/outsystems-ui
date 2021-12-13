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
	export class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar {
		// Store the Sidebar direction
		private _currentDirectionCssClass: string;
		// Store current drag direction
		private _dragOrientation: string;
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
		// Store the last element to receive focus in the sidebar
		private _lastFocusableElem: HTMLElement;
		// Store the values used between gesture methods
		private readonly _nativeGesturesParams = {
			LastX: 0,
			LastY: 0,
			MoveX: 0,
			InvalidX: false,
		};
		// Store if the Sidebar is Open
		private _onToggle: Callbacks.OSSidebarToggleEvent;
		// Store the Sidebar Aside element
		private _sidebarAsideElem: HTMLElement;
		// Store the minimal speed for a swipe to be triggered
		private readonly _swipeTriggerSpeed = 0.3;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SidebarConfig(configs));

			this._currentDirectionCssClass = Enum.CssClass.ClassModifier + this.configs.Direction;
		}

		/**
		 * Method to check if current gesture is withing sidebar boundaries
		 *
		 * @private
		 * @param {number} x
		 * @return {*}  {boolean}
		 * @memberof Sidebar
		 */
		private _checkIsDraggingInsideBounds(x: number): boolean {
			const isLeft = this._currentDirectionCssClass === GlobalEnum.Direction.Left;

			const baseThreshold = this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX);

			// Check correct threshold for each direction
			const directionThreshold = isLeft
				? baseThreshold > -parseInt(this.configs.Width) &&
				  this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX) <= 0
				: baseThreshold < parseInt(this.configs.Width) &&
				  this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX) >= 0;

			return directionThreshold;
		}

		/**
		 * Actual method that knows what is to close the sidebar.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _closeSidebar(): void {
			this.configs.StartsOpen = false;

			if (this.isBuilt) {
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.IsOpen);
				Helper.A11Y.TabIndexFalse(this._sidebarAsideElem);
				Helper.A11Y.AriaHiddenTrue(this._sidebarAsideElem);

				this._triggerOnToggleEvent();
				this._sidebarAsideElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);

				this._setFocusableElementsTabindex();

				if (this._configs.HasOverlay) {
					Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
				}
			}
		}

		/**
		 * Actual method that knows what is to open the sidebar.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _openSidebar() {
			Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsOpen);
			Helper.A11Y.TabIndexTrue(this._sidebarAsideElem);
			Helper.A11Y.AriaHiddenFalse(this._sidebarAsideElem);

			if (this.build) {
				//let's only change the property and trigger the OS event IF the pattern is already built.
				this.configs.StartsOpen = true;
				this._triggerOnToggleEvent();
			}

			this._sidebarAsideElem.focus();
			this._sidebarAsideElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);

			if (this.configs.HasOverlay) {
				Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._eventOverlayClick);
			}

			this._setFocusableElementsTabindex();
		}

		/**
		 * Overlay onClick event to close the Sidebar
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _overlayClickCallback(args: string, e: MouseEvent): void {
			if (!this._sidebarAsideElem.contains(e.target as HTMLElement)) {
				if (this._configs.StartsOpen) {
					this.close();
				}
			}

			e.stopPropagation();
		}

		/**
		 * Set the Sidebar opening/closing direction.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setDirection(): void {
			// Reset direction class
			if (this._currentDirectionCssClass !== '') {
				Helper.Dom.Styles.RemoveClass(this._selfElem, this._currentDirectionCssClass);
			}
			this._currentDirectionCssClass = Enum.CssClass.ClassModifier + this.configs.Direction;
			Helper.Dom.Styles.AddClass(this._selfElem, this._currentDirectionCssClass);
		}

		/**
		 * Method that will handle the tabindex value of the elements inside the Sidebar.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setFocusableElementsTabindex(): void {
			const setA11YtabIndex = this.configs.StartsOpen ? Helper.A11Y.TabIndexTrue : Helper.A11Y.TabIndexFalse;

			// On each element, toggle the tabindex value, depending if sidebar is open or closed
			this._focusableElems.slice().forEach((item: HTMLElement) => {
				setA11YtabIndex(item);
			});
		}

		/**
		 * Sets the Sidebar overlay.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setHasOverlay(): void {
			const alreadyHasOverlayClass = Helper.Dom.Styles.ContainsClass(this._selfElem, Enum.CssClass.HasOverlay);

			if (this.configs.HasOverlay && alreadyHasOverlayClass === false) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.HasOverlay);
			} else if (this.isBuilt) {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.HasOverlay);
			}
		}

		/**
		 * Set the cssClasses that should be assigned to the element on it's initialization.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setInitialCssClasses(): void {
			this._setDirection();
			this._setWidth();
			this._setHasOverlay();
			// Set IsOpen class
			if (this.configs.StartsOpen) {
				this._openSidebar();
			}
		}

		/**
		 * Method to handle the overlay transition on gestures.
		 *
		 * @private
		 * @param {number} x
		 * @memberof Sidebar
		 */
		private _setOverlayTransition(x: number): void {
			const isLeft = this.configs.Direction === GlobalEnum.Direction.Left;
			const currentOpacity = parseInt(this._selfElem.style.getPropertyValue('--overlay-opacity'));

			const percentageBeforeDif = (Math.abs(x) * 100) / parseInt(this.configs.Width);
			const percentage = isLeft ? 0 + percentageBeforeDif : 100 - percentageBeforeDif;

			const newOpacity = Math.floor(percentage) / 100;

			if (currentOpacity !== newOpacity && newOpacity % 1 !== 0) {
				Helper.Style.SetStyleAttribute(this._selfElem, '--overlay-opacity', newOpacity);
			}
		}

		/**
		 * Set the Sidebar width.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _setWidth(): void {
			Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, this.configs.Width);
		}

		/**
		 * Method that will handle the tab navigation and sidebar closing on Escape.
		 *
		 * @private
		 * @param {KeyboardEvent} e
		 * @return {*}  {void}
		 * @memberof Sidebar
		 */
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

		/**
		 * Method that triggers the OnToggle event.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		private _triggerOnToggleEvent(): void {
			Helper.AsyncInvocation(this._onToggle, this.widgetId, this.configs.StartsOpen);
		}

		/**
		 * Method that updates the last positions on a gesture move.
		 *
		 * @private
		 * @param {number} x
		 * @param {number} y
		 * @memberof Sidebar
		 */
		private _updateLastPositions(x: number, y: number): void {
			this._nativeGesturesParams.LastX = x;
			this._nativeGesturesParams.LastY = y;
		}

		/**
		 * Method to update the UI when doing a gesture.
		 *
		 * @private
		 * @memberof Sidebar
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _updateUI(): void {
			if (this._isMoving) {
				this._sidebarAsideElem.style.transform = `translateX(${this._nativeGesturesParams.MoveX}px)`;
				requestAnimationFrame(this._updateUI.bind(this));
			}
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		protected setA11YProperties(): void {
			Helper.A11Y.RoleComplementary(this._sidebarAsideElem);
			Helper.A11Y.AriaHasPopupTrue(this._sidebarAsideElem);

			if (this.configs.StartsOpen) {
				Helper.A11Y.TabIndexTrue(this._sidebarAsideElem);
				Helper.A11Y.AriaHiddenFalse(this._sidebarAsideElem);
			} else {
				Helper.A11Y.TabIndexFalse(this._sidebarAsideElem);
				Helper.A11Y.AriaHiddenTrue(this._sidebarAsideElem);
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
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		protected setHtmlElements(): void {
			this._sidebarAsideElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.Aside);

			this._focusableElems = [
				...this._sidebarAsideElem.querySelectorAll(Constants.FocusableElems),
			] as HTMLElement[];

			// to handle focusable element's tabindex when toggling the sidebar
			this._firstFocusableElem = this._focusableElems[0];
			this._lastFocusableElem = this._focusableElems[this._focusableElems.length - 1];

			this._setWidth();
		}

		/**
		 * Removes event listeners and callbacks.
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		protected unsetCallbacks(): void {
			this._sidebarAsideElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventSidebarKeypress);
			Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._eventOverlayClick);

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
			this._sidebarAsideElem = undefined;
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
							`Sidebar (${this.widgetId}): changes to ${Enum.Properties.StartsOpen} parameter do not affect the sidebar. Use the cliend actions 'SidebarOpen' and 'SidebarClose' to affect the Sidebar.`
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
			if (this.configs.StartsOpen) {
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
		 * //TODO: Make this method private when touchEvent block becomes available in TypeScript.
		 *
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} timeTaken
		 * @return {*}  {void}
		 * @memberof Sidebar
		 */
		public onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			this._isMoving = false;

			// Remove transitions
			Helper.Style.RemoveClass(this._sidebarAsideElem, Constants.NoTransition);

			// Just clicked or swiped in invalid direction?
			if ((offsetX === 0 && offsetY === 0) || this._nativeGesturesParams.InvalidX) {
				return;
			}

			const checkSwipeSpeed = Math.abs(offsetX) / timeTaken > this._swipeTriggerSpeed;

			const sizeThreshold = -parseInt(this.configs.Width) / 2;

			// Define a interval for later checks, depending on Sidebar visibility
			const swipedHalfWidth = this.configs.StartsOpen
				? this._nativeGesturesParams.MoveX < sizeThreshold
				: this._nativeGesturesParams.MoveX > sizeThreshold;

			// If swipe was fast enough or with sufficient move, procede to toggleSidebar
			const isReadyToToggle = swipedHalfWidth || checkSwipeSpeed;

			this._sidebarAsideElem.style.transform = '';

			if (isReadyToToggle) {
				if (this.configs.StartsOpen) {
					this.close();
				} else {
					this.open();
				}
			}

			if (this.configs.HasOverlay) {
				Helper.Style.SetStyleAttribute(this._selfElem, '--overlay-opacity', 0);
			}
		}

		/**
		 * Method to handle the gesture move
		 * //TODO: Make this method private when touchEvent block becomes available in TypeScript.
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
			// Check X axis direction
			const _dragDirection = offsetX > 0 ? GlobalEnum.Direction.Right : GlobalEnum.Direction.Left;
			// Set direction as invalid if isOpen and swipe is on opposite direction
			this._nativeGesturesParams.InvalidX = this.configs.StartsOpen && _dragDirection !== this.configs.Direction;

			// Swiped in wrong direction?
			if (this._nativeGesturesParams.InvalidX) {
				this._updateLastPositions(x, y);
				return;
			}

			// No orientation set?
			if (this._dragOrientation === '') {
				const isHorizontal = Math.abs(offsetX) >= Math.abs(offsetY);

				this._dragOrientation = isHorizontal
					? GlobalEnum.Orientation.Horizontal
					: GlobalEnum.Orientation.Vertical;

				requestAnimationFrame(this._updateUI.bind(this));
			}

			// Is Scrolling?
			if (this._dragOrientation === GlobalEnum.Orientation.Vertical) {
				this._updateLastPositions(x, y);
				return;
			}

			// Prevent scrolling the page while doing gesture
			evt.preventDefault();

			const IsDraggingInsideBounds = this._checkIsDraggingInsideBounds(x);

			// Dragging inside bounds?
			if (IsDraggingInsideBounds) {
				const updateXaxis = this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX);
				// Update x axis offset
				this._nativeGesturesParams.MoveX = updateXaxis;
			}

			this._updateLastPositions(x, y);

			if (this.configs.HasOverlay) {
				this._setOverlayTransition(x);
			}
		}

		/**
		 * Method to handle the end of a gesture
		 * //TODO: Make this method private when touchEvent block becomes available in TypeScript.
		 *
		 * @param {number} x
		 * @param {number} y
		 * @memberof Sidebar
		 */
		public onGestureStart(x: number, y: number): void {
			// Set defaults
			this._isMoving = true;
			this._dragOrientation = '';
			this._nativeGesturesParams.LastX = x;
			this._nativeGesturesParams.LastY = y;

			if (this.configs.StartsOpen) {
				this._nativeGesturesParams.MoveX = 0;
			} else if (this._currentDirectionCssClass === GlobalEnum.Direction.Left) {
				this._nativeGesturesParams.MoveX = -parseInt(this.configs.Width);
			} else {
				this._nativeGesturesParams.MoveX = parseInt(this.configs.Width);
			}

			Helper.Dom.Styles.AddClass(this._sidebarAsideElem, Constants.NoTransition);
		}

		/**
		 * Method that opens the sidebar.
		 *
		 * @memberof Sidebar
		 */
		public open(): void {
			if (this.configs.StartsOpen === false) {
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
