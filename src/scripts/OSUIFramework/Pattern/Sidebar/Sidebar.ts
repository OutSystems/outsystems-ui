// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar {
		// Store the Sidebar direction
		private _direction: string;
		// Store current drag direction
		private _dragDirection: string;
		// Store if the Sidebar has Overlay
		private _hasOverlay: boolean;
		// Store the if the Sidebar is moving on Native Gestures
		private _isMoving: boolean;
		// Store if the Sidebar is Open
		private _isOpen: boolean;
		// Store if it's RTL
		private _isRtl: boolean;
		// Store if the Sidebar is Open
		private _onToggle: Callbacks.OSSidebarToggleEvent;
		// Store the Sidebar Aside element
		private _sidebarAsideElem: HTMLElement;
		// Store the Sidebar Content element
		private _sidebarContentElem: HTMLElement;
		// Store the Sidebar Header element
		private _sidebarHeaderElem: HTMLElement;
		// Store the Sidebar Overlay element
		private _sidebarOverlayElem: HTMLElement;
		// Store the minimal speed for a swipe to be triggered
		private _swipeSpeed = 0.3;
		// Store the Sidebar width
		private _width: string;

		private _zNativeGestures = {
			LastX: 0,
			LastY: 0,
			MoveX: 0,
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SidebarConfig(configs));

			this._isOpen = this._configs.IsOpen;
			this._direction = this._configs.Direction;
			this._hasOverlay = this._configs.HasOverlay;
			this._width = this._configs.Width;
		}

		private _checkIsDraggingInsideBounds(x: number): boolean {
			const isRtlOrDirectionLeft = this._isRtl || this._direction === GlobalEnum.Direction.left;
			let IsDraggingInsideBounds: boolean;

			if (isRtlOrDirectionLeft) {
				IsDraggingInsideBounds =
					this._zNativeGestures.MoveX + (x - this._zNativeGestures.LastX) > -parseInt(this._width) &&
					this._zNativeGestures.MoveX + (x - this._zNativeGestures.LastX) < 0;
			} else {
				IsDraggingInsideBounds =
					this._zNativeGestures.MoveX + (x - this._zNativeGestures.LastX) < -parseInt(this._width) &&
					this._zNativeGestures.MoveX + (x - this._zNativeGestures.LastX) > 0;
			}

			return IsDraggingInsideBounds;
		}

		// Manage the Overlay click event
		private _handleOverlayClick(hasOverlay: boolean): void {
			if (hasOverlay) {
				this._sidebarOverlayElem.addEventListener('click', this._overlayOnClick.bind(this));
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
			this._sidebarHeaderElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Header);
			this._sidebarContentElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Content);
			this._sidebarOverlayElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Overlay);
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
			this._zNativeGestures.LastX = x;
			this._zNativeGestures.LastY = y;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention
		private _updateUI(): any {
			if (this._isMoving) {
				this._sidebarAsideElem.style.transform = 'translateX(' + this._zNativeGestures.MoveX + 'px)';
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
			let intervalExpressionForClose: boolean;
			let intervalExpressionForOpen: boolean;
			let offsetExpression: boolean;

			this._isMoving = false;

			Helper.Style.RemoveClass(this._sidebarAsideElem, Constants.noTransition);

			// Just clicked?
			if (offsetX === 0 && offsetY === 0) {
				return;
			}

			if (this._isRtl || this._direction === GlobalEnum.Direction.left) {
				intervalExpressionForClose = this._zNativeGestures.MoveX < -parseInt(this._width) / 2;
				intervalExpressionForOpen = this._zNativeGestures.MoveX > -parseInt(this._width) / 2;
				offsetExpression = offsetX < 0;
			} else {
				intervalExpressionForClose = this._zNativeGestures.MoveX > -parseInt(this._width) / 2;
				intervalExpressionForOpen = this._zNativeGestures.MoveX < -parseInt(this._width) / 2;
				offsetExpression = offsetX > 0;
			}

			if (this._isOpen) {
				this._sidebarAsideElem.style.transform = '';
				// Closed one third?
				if (
					intervalExpressionForClose &&
					Math.abs(offsetX) / timeTaken > this._swipeSpeed &&
					offsetExpression
				) {
					// Close Sidebar
					this.toggleSidebar(false);
				} else {
					// Open Sidebar
					this.toggleSidebar(true);
				}
			} else {
				this._sidebarAsideElem.style.transform = '';
				// Opened two thirds?
				if (intervalExpressionForOpen || Math.abs(offsetX) / timeTaken > this._swipeSpeed) {
					// Open Sidebar
					this.toggleSidebar(true);
				} else {
					// Close Sidebar
					this.toggleSidebar(false);
				}
			}
		}

		public onGestureMove(x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void {
			// No direction set?
			if (this._dragDirection === '') {
				this._dragDirection =
					Math.abs(offsetX) >= Math.abs(offsetY)
						? GlobalEnum.Orientation.horizontal
						: GlobalEnum.Orientation.vertical;
				requestAnimationFrame(() => {
					this._updateUI();
				});
			}

			// Is Scrolling?
			if (this._dragDirection === GlobalEnum.Orientation.vertical) {
				this._updateLastPositions(x, y);
				return;
			}

			evt.preventDefault();
			const IsDraggingInsideBounds = this._checkIsDraggingInsideBounds(x);

			// Dragging inside bounds?
			if (IsDraggingInsideBounds) {
				this._updateLastPositions(x, y);
			} else {
				// Update x axis offset
				this._zNativeGestures.MoveX = this._zNativeGestures.MoveX + (x - this._zNativeGestures.LastX);
				this._updateLastPositions(x, y);
			}
		}

		public onGestureStart(x: number, y: number): void {
			this._isRtl = OutSystems.OSUI.Utils.GetIsRTL();
			this._isMoving = true;
			this._dragDirection = '';
			this._zNativeGestures.LastX = x;
			this._zNativeGestures.LastY = y;
			this._zNativeGestures.MoveX = this._isOpen
				? 0
				: this._isRtl
				? -parseInt(this._width)
				: parseInt(this._width);

			Helper.Style.AddClass(this._sidebarAsideElem, Constants.noTransition);
			this._sidebarAsideElem.offsetHeight;
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

			this._isOpen = isOpen;
			this._configs.IsOpen = isOpen;
		}
	}
}
