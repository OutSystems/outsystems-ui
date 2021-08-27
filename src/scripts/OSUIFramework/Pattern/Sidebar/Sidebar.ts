// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar {
		// Store the Sidebar direction
		private _direction: string;
		// Store current drag direction
		private _dragOrientation: string;
		// Store the click event with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnOverlayClick: any;
		// Store the keypress event with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnSidebarKeypress: any;
		// Store the first element to receive focus in the sidebar
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _firstFocusableElem: any;
		// Store focusable element inside sidebar
		private _focusableElems: NodeList;
		// Store if the Sidebar has Overlay
		private _hasOverlay: boolean;
		// Store the if the Sidebar is moving on Native Gestures
		private _isMoving: boolean;
		// Store if the Sidebar is Open
		private _isOpen: boolean;
		// Store if it's RTL
		private _isRtl: boolean;
		// Store the last element to receive focus in the sidebar
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _lastFocusableElem: any;
		// Store the values used between gesture methods
		private _nativeGesturesParams = {
			LastX: 0,
			LastY: 0,
			MoveX: 0,
			InvalidX: false,
		};
		// Store if the Sidebar is Open
		private _onToggle: Callbacks.OSSidebarToggleEvent;
		// Store the Sidebar Aside element
		private _sidebarAsideElem: HTMLElement;
		// Store the Sidebar Overlay element
		private _sidebarOverlayElem: HTMLElement;
		// Store the minimal speed for a swipe to be triggered
		private _swipeTriggerSpeed = 0.3;
		// Store the Sidebar width
		private _width: string;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SidebarConfig(configs));

			this._isOpen = this._configs.IsOpen;
			this._direction = this._configs.Direction;
			this._hasOverlay = this._configs.HasOverlay;
			this._width = this._configs.Width;
			this._eventOnSidebarKeypress = this._sidebarOnKeypress.bind(this);
			this._eventOnOverlayClick = this._overlayOnClick.bind(this);
		}

		private _checkIsDraggingInsideBounds(x: number): boolean {
			let IsDraggingInsideBounds: boolean;

			if (this._direction === GlobalEnum.Direction.left) {
				IsDraggingInsideBounds =
					this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX) >
						-parseInt(this._width) &&
					this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX) <= 0;
			} else {
				IsDraggingInsideBounds =
					this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX) < parseInt(this._width) &&
					this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX) >= 0;
			}
			return IsDraggingInsideBounds;
		}

		private _handleFocusableElemsTabindex(): void {
			this._focusableElems = [].slice.call(this._focusableElems);

			this._focusableElems.forEach((item: HTMLElement) => {
				item.setAttribute('tabindex', this._isOpen ? '0' : '-1');
			});
		}

		// Manage the aside keypress event
		private _handleKeypressEvent(): void {
			if (this._isOpen) {
				this._sidebarAsideElem.addEventListener('keydown', this._eventOnSidebarKeypress);
			} else {
				this._sidebarAsideElem.removeEventListener('keydown', this._eventOnSidebarKeypress);
			}
		}

		// Manage the Overlay click event
		private _handleOverlayClick(hasOverlay: boolean): void {
			if (hasOverlay) {
				this._sidebarOverlayElem.addEventListener('click', this._eventOnOverlayClick);
			} else if (!this._isOpen && this._sidebarOverlayElem) {
				this._sidebarOverlayElem.removeEventListener('click', this._eventOnOverlayClick);
			}
		}

		// Overlay onClick event to close the Sidebar
		private _overlayOnClick(): void {
			this.toggleSidebar(false);
		}

		// Set accessibility atrributes on html elements
		private _setAccessibilityProps(isOpen: boolean): void {
			Helper.Attribute.Set(this._sidebarAsideElem, 'role', 'complementary');
			Helper.Attribute.Set(this._sidebarAsideElem, 'aria-haspopup', 'true');
			Helper.Attribute.Set(this._sidebarAsideElem, 'tabindex', isOpen ? '0' : '-1');
			Helper.Attribute.Set(this._sidebarAsideElem, 'aria-hidden', isOpen ? 'false' : 'true');

			if (this._sidebarOverlayElem) {
				Helper.Attribute.Set(this._sidebarOverlayElem, 'aria-hidden', 'true');
			}
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._sidebarAsideElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Aside);
			this._sidebarOverlayElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Overlay);
			this._focusableElems = this._sidebarAsideElem.querySelectorAll(Constants.focusableElems);
			this._firstFocusableElem = this._focusableElems[0];
			this._lastFocusableElem = this._focusableElems[this._focusableElems.length - 1];
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set IsOpen class
			if (this._isOpen) {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.IsOpen);
			}

			// Set the direction class
			if (this._direction !== '') {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.Direction + this._configs.Direction);
			}

			if (this._width !== '') {
				Helper.Style.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, this._configs.Width);
			}

			// Set the overlay class
			if (this._hasOverlay) {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.HasOverlay);
			}

			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.updateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}
		}

		private _sidebarOnKeypress(e: KeyboardEvent): void {
			const isTabPressed = e.key === GlobalEnum.Keycodes.tab;
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.escape;
			const isShiftPressed = e.shiftKey;

			if (!isTabPressed && !isEscapedPressed) {
				return;
			}

			if (isEscapedPressed && this._isOpen) {
				this.toggleSidebar(false);
			}

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

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(isOpen: boolean): void {
			if (this._onToggle !== undefined) {
				setTimeout(() => {
					this._onToggle(this.widgetId, isOpen);
				}, 0);
			}
		}

		// Method that updates the last positions on a gesture move
		private _updateLastPositions(x: number, y: number): void {
			this._nativeGesturesParams.LastX = x;
			this._nativeGesturesParams.LastY = y;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention
		private _updateUI(): any {
			if (this._isMoving) {
				this._sidebarAsideElem.style.transform = `translateX(${this._nativeGesturesParams.MoveX}px)`;

				requestAnimationFrame(() => {
					this._updateUI();
				});
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps(this._isOpen);

			this.setWidth(this._width);

			this._handleOverlayClick(this._hasOverlay);

			this._handleKeypressEvent();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Properties[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.IsOpen:
						this.toggleSidebar(propertyValue);

						this._configs.IsOpen = propertyValue;
						break;
					case Enum.Properties.Direction:
						this.setDirection(propertyValue);

						this._configs.Direction = propertyValue;
						break;
					case Enum.Properties.Width:
						this.setWidth(propertyValue);

						this._configs.Width = propertyValue;
						break;
					case Enum.Properties.HasOverlay:
						this.setHasOverlay(propertyValue);

						this._hasOverlay = propertyValue;
						break;
					case Enum.Properties.ExtendedClass:
						this.updateExtendedClass(this._configs.ExtendedClass, propertyValue);

						this._configs.ExtendedClass = propertyValue;
						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		public onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			this._isMoving = false;

			Helper.Style.RemoveClass(this._sidebarAsideElem, Constants.noTransition);

			// Just clicked or swiped in invalid direction?
			if ((offsetX === 0 && offsetY === 0) || this._nativeGesturesParams.InvalidX) {
				return;
			}

			const checkSwipeSpeed = Math.abs(offsetX) / timeTaken > this._swipeTriggerSpeed;

			const sizeThreshold = -parseInt(this._width) / 2;

			const swipeInterval = this._isOpen
				? this._nativeGesturesParams.MoveX > sizeThreshold
				: this._nativeGesturesParams.MoveX < sizeThreshold;

			const isReadyToToggle = swipeInterval || checkSwipeSpeed;

			this._sidebarAsideElem.style.transform = '';

			isReadyToToggle ? this.toggleSidebar(!this._isOpen) : this.toggleSidebar(this._isOpen);
		}

		public onGestureMove(x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void {
			// Check X axis direction
			const _dragDirection = offsetX > 0 ? GlobalEnum.Direction.right : GlobalEnum.Direction.left;
			// Set direction as invalid if isOpen and swipe is on opposite direction
			this._nativeGesturesParams.InvalidX = this._isOpen && _dragDirection !== this._direction;

			// Swiped in wrong direction?
			if (this._nativeGesturesParams.InvalidX) {
				this._updateLastPositions(x, y);
				return;
			}

			// No orientation set?
			if (this._dragOrientation === '') {
				const isHorizontal = Math.abs(offsetX) >= Math.abs(offsetY);

				this._dragOrientation = isHorizontal
					? GlobalEnum.Orientation.horizontal
					: GlobalEnum.Orientation.vertical;

				requestAnimationFrame(() => {
					this._updateUI();
				});
			}

			// Is Scrolling?
			if (this._dragOrientation === GlobalEnum.Orientation.vertical) {
				this._updateLastPositions(x, y);
				return;
			}

			evt.preventDefault();
			const IsDraggingInsideBounds = this._checkIsDraggingInsideBounds(x);

			// Dragging inside bounds?
			if (IsDraggingInsideBounds) {
				const updateXaxis = this._nativeGesturesParams.MoveX + (x - this._nativeGesturesParams.LastX);
				// Update x axis offset
				this._nativeGesturesParams.MoveX = updateXaxis;
			}

			this._updateLastPositions(x, y);
		}

		public onGestureStart(x: number, y: number): void {
			this._isMoving = true;
			this._dragOrientation = '';
			this._nativeGesturesParams.LastX = x;
			this._nativeGesturesParams.LastY = y;
			this._nativeGesturesParams.MoveX = this._isOpen
				? 0
				: this._direction === GlobalEnum.Direction.left
				? -parseInt(this._width)
				: parseInt(this._width);

			Helper.Style.AddClass(this._sidebarAsideElem, Constants.noTransition);
		}

		// Set callbacks for the onToggle event
		public registerCallback(callback: Callbacks.OSSidebarToggleEvent): void {
			this._onToggle = callback;
		}

		// Set the Sidebar direction
		public setDirection(direction: string): void {
			if (this._direction !== '') {
				Helper.Style.RemoveClass(this._selfElem, Enum.SidebarCssClass.Direction + this._configs.Direction);
			}

			Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.Direction + direction);
			this._direction = direction;
		}

		// Toggle the Sidebar overlay
		public setHasOverlay(hasOverlay: boolean): void {
			const alreadyHasOverlayClass = Helper.Style.ContainsClass(this._selfElem, Enum.SidebarCssClass.HasOverlay);

			if (hasOverlay && !alreadyHasOverlayClass) {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.HasOverlay);
			} else {
				Helper.Style.RemoveClass(this._selfElem, Enum.SidebarCssClass.HasOverlay);
			}

			// Make async so that the platform updates the DIV visibility on the DOM
			setTimeout(() => {
				this._sidebarOverlayElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Overlay);
				this._handleOverlayClick(hasOverlay);
			}, 0);

			this._hasOverlay = hasOverlay;
		}

		// Set the Sidebar width
		public setWidth(width: string): void {
			Helper.Style.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, width);
			this._width = width;
		}

		// Toggle the Sidebar and trigger toggle event
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public toggleSidebar(isOpen: boolean): any {
			// Toggle event listeners missing
			isOpen
				? Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.IsOpen)
				: Helper.Style.RemoveClass(this._selfElem, Enum.SidebarCssClass.IsOpen);

			this._setAccessibilityProps(isOpen);

			if (isOpen !== this._isOpen) {
				this._triggerOnToggleEvent(isOpen);
			}

			if (isOpen) {
				this._sidebarAsideElem.focus();
			}

			this._isOpen = isOpen;
			this._configs.IsOpen = isOpen;

			this._handleKeypressEvent();
			this._handleFocusableElemsTabindex();
		}
	}
}
