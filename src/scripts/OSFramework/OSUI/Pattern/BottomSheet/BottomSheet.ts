// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.BottomSheet {
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
		private _animateOnDragInstance: Behaviors.AnimateOnDrag;
		// HTML elements
		private _bottomSheetContentElem: HTMLElement;
		private _bottomSheetHeaderElem: HTMLElement;
		// Listener callbacks
		private _eventOnContentScroll: GlobalCallbacks.Generic;
		private _eventOnKeypress: GlobalCallbacks.Generic;
		// Store focus manager instance
		private _focusManagerInstance: Behaviors.FocusManager;
		// FocusTrap Properties
		private _focusTrapInstance: Behaviors.FocusTrap;
		// Store gesture events instance
		private _gestureEventInstance: Event.GestureEvent.DragEvent;
		// Store if the pattern has gesture events added
		private _hasGestureEvents: boolean;
		// Store if the pattern is open
		private _isOpen = false;
		// WidgetId element
		private _parentSelf: HTMLElement;
		// OnToggle event callback
		private _platformEventOnToggle: Callbacks.OSOnToggleEvent;

		// Stores SpringAnimation configs used on drag end. This is public to allow ability to change animation or even disable this effect
		public springAnimationConfigs = {
			addSpringAnimation: true,
			springAnimationProperties: {
				tension: 300,
				friction: 15,
				mass: 1,
			},
		};

		/**
		 * Method to get Gesture Events Instance
		 *
		 * @readonly
		 * @type {Event.GestureEvent.DragEvent}
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		public get gestureEventInstance(): Event.GestureEvent.DragEvent {
			return this._gestureEventInstance;
		}

		/**
		 * Method to get if has gesture events
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		public get hasGestureEvents(): boolean {
			return this._hasGestureEvents;
		}

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new BottomSheetConfig(configs));
		}

		// Method to add Focus Trap to Pattern
		private _handleFocusBehavior(): void {
			const opts = {
				focusTargetElement: this._parentSelf,
				canContainOtherPatterns: true,
			} as Behaviors.FocusTrapParams;

			this._focusTrapInstance = new Behaviors.FocusTrap(opts);

			this._focusManagerInstance = new Behaviors.FocusManager();
		}

		// Method to handle the creation of the GestureEvents
		private _handleGestureEvents(): void {
			if (!Helper.DeviceInfo.IsDesktop) {
				// Create and save gesture event instance. Created here and not on constructor,
				// as we need to pass element, only available after super.build()
				this._gestureEventInstance = new Event.GestureEvent.DragEvent(this._bottomSheetHeaderElem);

				// Apply transform on an element and perform animation
				this._animateOnDragInstance = new Behaviors.AnimateOnDrag(this.selfElement);
			}
		}

		// Method to handle the Shape config css variable
		private _handleShape(shape: GlobalEnum.ShapeTypes): void {
			Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				Enum.CssCustomProperties.Shape,
				'var(--border-radius-' + shape + ')'
			);
		}

		// Method to be called as callback on scroll event, to toggle class on BottomSheet when it has scroll active
		private _onContentScrollCallback(): void {
			if (this._bottomSheetContentElem.scrollTop === 0) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.HasSCroll);
			} else {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.HasSCroll);
			}
		}

		// Method to handle the start of a gesture
		private _onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			this._animateOnDragInstance.onDragEnd(
				offsetX,
				offsetY,
				timeTaken,
				this.close.bind(this),
				this.springAnimationConfigs
			);
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
				this.selfElement.clientHeight.toString()
			);
		}

		// Method to call open or close, based on e.key and behaviour applied
		private _onkeypressCallback(e: KeyboardEvent): void {
			switch (e.key) {
				case GlobalEnum.Keycodes.Escape:
					// Close the BottomSheet when pressing Esc
					this.close();
					break;

				case GlobalEnum.Keycodes.End:
					// Focus on last focusable item
					this._focusTrapInstance.focusableElements[
						this._focusTrapInstance.focusableElements.length - 1
					]?.focus();
					break;
				case GlobalEnum.Keycodes.Home:
					// Focus on first focusable items (in this case, its the bottom sheet itself)
					this._focusTrapInstance.focusableElements[0]?.focus();
					break;
			}
		}

		// Method to toggle the open/close the BottomSheet
		private _toggleBottomSheet(isOpen: boolean): void {
			// Cancel animation if active
			if (this._animateOnDragInstance?.dragParams.SpringAnimation) {
				this._animateOnDragInstance.dragParams.SpringAnimation.cancel();
			}

			// Toggle class
			if (isOpen) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsOpen);
				Helper.Dom.Styles.AddClass(document.body, Enum.CssClass.IsActive);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsOpen);
				Helper.Dom.Styles.RemoveClass(document.body, Enum.CssClass.IsActive);
			}

			// Update property
			this._isOpen = isOpen;

			// Update listeners and A11y properties
			this.setEventListeners();
			this.setA11YProperties();

			// Handle focus trap logic
			if (isOpen) {
				this._focusManagerInstance.storeLastFocusedElement();
				this._focusTrapInstance.enableForA11y();
				// Focus on element when pattern is open
				this.selfElement.focus();
			} else {
				this._focusTrapInstance.disableForA11y();

				// Focus on last element clicked. Async to avoid conflict with closing animation
				Helper.AsyncInvocation(() => {
					this.selfElement.blur();
					this._focusManagerInstance.setFocusToStoredElement();
				});
			}

			// Trigger platform event
			this._triggerOnToggleEvent();
		}

		// Method that toggles the showHandler config
		private _toggleHandler(ShowHandler: boolean): void {
			if (ShowHandler) {
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.HasHandler);
			} else {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.HasHandler);
			}
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(): void {
			this.triggerPlatformEventCallback(this._platformEventOnToggle, this._isOpen);
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		protected removeEventListeners(): void {
			this._bottomSheetContentElem.removeEventListener(GlobalEnum.HTMLEvent.Scroll, this._eventOnContentScroll);
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			this.removeGestureEvents();
		}

		/**
		 * Method to add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		protected setA11YProperties(): void {
			if (!this.isBuilt) {
				Helper.A11Y.RoleComplementary(this.selfElement);
			}

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
		 * Method to set the listeners and platform event callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		protected setCallbacks(): void {
			this._eventOnContentScroll = this._onContentScrollCallback.bind(this);
			this._eventOnKeypress = this._onkeypressCallback.bind(this);
		}

		/**
		 * Method to add event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		protected setEventListeners(): void {
			this._bottomSheetContentElem.addEventListener(GlobalEnum.HTMLEvent.Scroll, this._eventOnContentScroll);
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnKeypress);

			if (!Helper.DeviceInfo.IsDesktop && this.gestureEventInstance !== undefined) {
				// Set event listeners and callbacks
				this.setGestureEvents(
					this._onGestureStart.bind(this),
					this._onGestureMove.bind(this),
					this._onGestureEnd.bind(this)
				);
			}
		}

		/**
		 * Method to update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		protected setHtmlElements(): void {
			this._parentSelf = Helper.Dom.GetElementById(this.widgetId);
			this._bottomSheetContentElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternContent);
			this._bottomSheetHeaderElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternHeader);
		}

		/**
		 * Method to set initial options
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		protected setInitialOptions(): void {
			this._toggleHandler(this.configs.ShowHandler);
			this._handleShape(this.configs.Shape);
		}

		/**
		 * Method to unset callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		protected unsetCallbacks(): void {
			this._eventOnContentScroll = undefined;
			this._eventOnKeypress = undefined;
			this._platformEventOnToggle = undefined;
		}

		/**
		 * Method to remove the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		protected unsetHtmlElements(): void {
			this._parentSelf = undefined;
			this._bottomSheetContentElem = undefined;
			this._bottomSheetHeaderElem = undefined;
		}

		/**
		 * Method to build the BottomSheet.
		 *
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this._handleFocusBehavior();
			this.setInitialOptions();
			this.setCallbacks();
			this.setA11YProperties();
			this._handleGestureEvents();
			this.finishBuild();
		}

		/**
		 * Method to apply the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
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
		 * Method to close the BottomSHeet
		 *
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		public close(): void {
			if (this._isOpen) {
				this._toggleBottomSheet(false);
			}
		}

		/**
		 * Method to destroy pattern.
		 *
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
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

		/**
		 * Method to open the BottomSheet
		 *
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		public open(): void {
			if (this._isOpen === false) {
				this._toggleBottomSheet(true);
			}
		}

		/**
		 * Method to register a given callback event handler.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnToggle:
					if (this._platformEventOnToggle === undefined) {
						this._platformEventOnToggle = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
			}
		}

		/**
		 * Method to remove the gesture events to open/close the BottomSheet on Native Apps
		 *
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
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
		 * Method to set the gesture events to open/close the BottomSheet on Native Apps
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.BottomSheet.BottomSheet
		 */
		public setGestureEvents(
			onGestureStart: Event.GestureEvent.Callbacks.GestureStart,
			onGestureMove: Event.GestureEvent.Callbacks.GestureMove,
			onGestureEnd: Event.GestureEvent.Callbacks.GestureEnd
		): void {
			this._gestureEventInstance.setSwipeEvents(onGestureStart, onGestureMove, onGestureEnd);
			this._hasGestureEvents = true;
		}
	}
}
