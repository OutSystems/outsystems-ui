// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.BottomSheet {
	/**
	 *  Class that implements the BottomSheet pattern.
	 *
	 * @export
	 * @class BottomSheet
	 * @extends {AbstractPattern<BottomSheetConfig>}
	 * @implements {IBottomSheet}
	 */
	export class BottomSheet extends AbstractPattern<BottomSheetConfig> implements IBottomSheet, Interface.IDragEvent {
		// Hold the animateOnDrag intance, that helps transition the sidebar on drag
		private _animateOnDragInstance: Animation.AnimateOnDrag;
		private _isOpen: boolean;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _bottomSheetOverlayElem: HTMLElement;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _bottomSheetContentElem: HTMLElement;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _bottomSheetHeaderElem: HTMLElement;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _bottomSheetTopBarElem: HTMLElement;
		private _eventOnContentScroll: Callbacks.Generic;
		private _eventOnKeypress: Callbacks.Generic;
		private _firstFocusableElement: HTMLElement;
		private _focusTrapInstance: DynamicElements.FocusTrap.FocusTrap;
		private _focusableActiveElement: HTMLElement;
		private _focusableElements: HTMLElement[];
		// Store gesture events instance
		private _gestureEventInstance: Event.GestureEvent.DragEvent;
		// Store if the pattern has gesture events added
		private _hasGestureEvents: boolean;
		private _lastFocusableElement: HTMLElement;
		private _parentSelf: HTMLElement;

		/**
		 * Get Gesture Events Instance
		 *
		 * @readonly
		 * @type {Event.GestureEvent.DragEvent}
		 * @memberof Sidebar
		 */
		public get gestureEventInstance(): Event.GestureEvent.DragEvent {
			return this._gestureEventInstance;
		}

		/**
		 * Get if has gesture events
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof Sidebar
		 */
		public get hasGestureEvents(): boolean {
			return this._hasGestureEvents;
		}

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new BottomSheetConfig(configs));
		}

		// Focus on first focusable element on Notification
		private _focusBottomCallback(): void {
			if (this._firstFocusableElement) {
				this._firstFocusableElement.focus();
			} else {
				this._selfElem.focus();
			}
		}

		// Focus on last focusable element on Notification
		private _focusTopCallback(): void {
			if (this._lastFocusableElement) {
				this._lastFocusableElement.focus();
			} else {
				this._selfElem.focus();
			}
		}

		// Add Focus Trap to Pattern
		private _handleFocusTrap(): void {
			const opts = {
				focusBottomCallback: this._focusBottomCallback.bind(this),
				focusTargetElement: this._parentSelf,
				focusTopCallback: this._focusTopCallback.bind(this),
			} as FocusTrapOpts;

			this._focusTrapInstance = new DynamicElements.FocusTrap.FocusTrap(opts);
		}

		// Method to hadnle the creation of the GestureEvents
		private _handleGestureEvents(): void {
			if (!Helper.DeviceInfo.IsDesktop) {
				// Create and save gesture event instance. Created here and not on constructor,
				// as we need to pass element, only available after super.build()
				this._gestureEventInstance = new Event.GestureEvent.DragEvent(this._bottomSheetHeaderElem);

				// Apply transform on an element and perform animation
				this._animateOnDragInstance = new Animation.AnimateOnDrag(this._selfElem);
			}
		}

		private _handleShape(shape: GlobalEnum.ShapeTypes): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssCustomProperties.Shape,
				'var(--border-radius-' + shape + ')'
			);
		}

		private _onContentScrollCallback(): void {
			if (this._bottomSheetContentElem.scrollTop === 0) {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.HasSCroll);
			} else {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.HasSCroll);
			}
		}

		// Method to handle the start of a gesture
		private _onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			this._animateOnDragInstance.onDragEnd(offsetX, offsetY, timeTaken, this.close.bind(this));
		}

		// Method to handle the gesture move
		private _onGestureMove(x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void {
			this._animateOnDragInstance.onDragMove(offsetX, offsetY, x, y, evt);
		}

		// Method to handle the end of a gesture
		private _onGestureStart(x: number, y: number): void {
			this._animateOnDragInstance.onDragStart(
				true,
				GlobalEnum.Direction.Down,
				x,
				y,
				true,
				this._selfElem.clientHeight.toString()
			);
		}

		// Call methods to open or close, based ok e.key and behavior applied
		private _onkeypressCallback(e: KeyboardEvent): void {
			const isEscapedPressed = e.key === GlobalEnum.Keycodes.Escape;

			// Close the Notification when pressing Esc
			if (isEscapedPressed && this._isOpen) {
				this.close();
			}
		}

		private _toggleHandler(ShowHandler: boolean): void {
			if (ShowHandler) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.HasHandler);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.HasHandler);
			}
		}

		protected removeEventListeners(): void {
			this._bottomSheetContentElem.removeEventListener(GlobalEnum.HTMLEvent.Scroll, this._eventOnContentScroll);
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			this.removeGestureEvents();
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected setA11yProperties(): void {
			if (!this.isBuilt) {
				Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Role.Complementary, true);
			}

			const setA11YtabIndex = this._isOpen ? Helper.A11Y.TabIndexTrue : Helper.A11Y.TabIndexFalse;

			Helper.Dom.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Hidden, (!this._isOpen).toString());

			Helper.Dom.Attribute.Set(
				this._selfElem,
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

		protected setCallbacks(): void {
			this._eventOnContentScroll = this._onContentScrollCallback.bind(this);
			this._eventOnKeypress = this._onkeypressCallback.bind(this);
		}

		protected setEventListeners(): void {
			this._bottomSheetContentElem.addEventListener(GlobalEnum.HTMLEvent.Scroll, this._eventOnContentScroll);
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			if (!Helper.DeviceInfo.IsDesktop) {
				// Set event listeners and callbacks
				this.setGestureEvents(
					this._onGestureStart.bind(this),
					this._onGestureMove.bind(this),
					this._onGestureEnd.bind(this)
				);
			}
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected setHtmlElements(): void {
			this._parentSelf = Helper.Dom.GetElementById(this._widgetId);
			this._bottomSheetOverlayElem = Helper.Dom.ClassSelector(this._parentSelf, Enum.CssClass.PatternOverlay);
			this._bottomSheetTopBarElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternTopBar);
			this._bottomSheetContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContent);
			this._bottomSheetHeaderElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternHeader);

			this._focusableElements = [...this._selfElem.querySelectorAll(Constants.FocusableElems)] as HTMLElement[];
			// to handle focusable element's tabindex when toggling the BottomSheet
			this._firstFocusableElement = this._focusableElements[0];
			this._lastFocusableElement = this._focusableElements[this._focusableElements.length - 1];
		}

		protected setInitialOptions(): void {
			this._toggleHandler(this.configs.ShowHandler);
			this._handleShape(this.configs.Shape);
		}

		protected unsetCallbacks(): void {
			this._eventOnContentScroll = undefined;
			this._eventOnKeypress = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected unsetHtmlElements(): void {
			this._parentSelf = undefined;
			this._bottomSheetOverlayElem = undefined;
			this._bottomSheetTopBarElem = undefined;
			this._bottomSheetContentElem = undefined;
			this._bottomSheetHeaderElem = undefined;
			this._focusableElements = undefined;
			// to handle focusable element's tabindex when toggling the BottomSheet
			this._firstFocusableElement = undefined;
			this._lastFocusableElement = undefined;
		}

		/**
		 *  Builds the BottomSheet.
		 *
		 * @memberof BottomSheet
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setInitialOptions();
			this.setCallbacks();
			this.setA11yProperties();
			this._handleFocusTrap();
			this._handleGestureEvents();
			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof BottomSheet
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.ShowHandler:
						this._toggleHandler(this.configs.ShowHandler);
						break;
					case Enum.Properties.Shape:
						this._handleShape(this.configs.Shape);
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof BottomSheet
		 */
		public dispose(): void {
			if (this._isOpen) {
				this.removeEventListeners();
			}

			this.unsetHtmlElements();
			this.unsetCallbacks();

			// Remove focus trap events and callbacks
			this._focusTrapInstance.dispose();

			//Destroying the base of pattern
			super.dispose();
		}

		public open(): void {
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsOpen);
			this._isOpen = true;
			this.setEventListeners();
			this.setA11yProperties();
			this._focusableActiveElement = document.activeElement as HTMLElement;
			this._focusTrapInstance.setA11yProperties();
			// Focus on element when pattern is open
			this._selfElem.focus();
		}

		// eslint-disable-next-line @typescript-eslint/member-ordering
		public close(): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsOpen);
			this._isOpen = false;
			this.removeEventListeners();
			this.setA11yProperties();
			this._focusTrapInstance.unsetA11yProperties();
			// Remove focus when a pattern is closed
			this._selfElem.blur();
			// Focus on last element clicked
			this._focusableActiveElement.focus();
		}

		public registerCallback(callback: Callbacks.Generic): void {
			console.log(callback);
		}

		/**
		 * Removes the gesture events to open/close the Sidebar on Native Apps
		 *
		 * @memberof Sidebar
		 */
		public removeGestureEvents(): void {
			if (this._gestureEventInstance !== undefined) {
				this._gestureEventInstance.unsetTouchEvents();
				this._hasGestureEvents = false;
			}
		}

		/**
		 * Sets the gesture events to open/close the Sidebar on Native Apps
		 *
		 * @protected
		 * @memberof Sidebar
		 */
		public setGestureEvents(
			onGestureStart: Callbacks.onGestureStart,
			onGestureMove: Callbacks.onGestureMove,
			onGestureEnd: Callbacks.onGestureEnd
		): void {
			this._gestureEventInstance.setEvents(onGestureStart, onGestureMove, onGestureEnd);
			this._hasGestureEvents = true;
		}
	}
}
