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
		// Store gesture events instance
		private _gestureEventInstance: Event.GestureEvent.DragEvent;
		// Store if the pattern has gesture events added
		private _hasGestureEvents: boolean;

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

		private _toggleHandler(ShowHandler: boolean): void {
			if (ShowHandler) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.HasHandler);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.HasHandler);
			}
		}

		protected removeEventListeners(): void {
			this._bottomSheetContentElem.removeEventListener(GlobalEnum.HTMLEvent.Scroll, this._eventOnContentScroll);

			this.removeGestureEvents();
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected setA11yProperties(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		protected setCallbacks(): void {
			this._eventOnContentScroll = this._onContentScrollCallback.bind(this);
		}

		protected setEventListeners(): void {
			this._bottomSheetContentElem.addEventListener(GlobalEnum.HTMLEvent.Scroll, this._eventOnContentScroll);

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
			this._bottomSheetOverlayElem = Helper.Dom.ClassSelector(
				Helper.Dom.GetElementById(this._widgetId),
				Enum.CssClass.PatternOverlay
			);
			this._bottomSheetTopBarElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternTopBar);
			this._bottomSheetContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContent);
			this._bottomSheetHeaderElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternHeader);
		}

		protected setInitialCssClasses(): void {
			//
		}

		protected setInitialOptions(): void {
			this._toggleHandler(this.configs.ShowHandler);
			this._handleShape(this.configs.Shape);
		}

		protected unsetCallbacks(): void {
			this._eventOnContentScroll = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected unsetHtmlElements(): void {
			this._bottomSheetOverlayElem = undefined;
			this._bottomSheetTopBarElem = undefined;
			this._bottomSheetContentElem = undefined;
			this._bottomSheetHeaderElem = undefined;
		}

		/**
		 *  Builds the BottomSheet.
		 *
		 * @memberof BottomSheet
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setInitialCssClasses();
			this.setInitialOptions();
			this.setCallbacks();
			this.setA11yProperties();
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

			//Destroying the base of pattern
			super.dispose();
		}

		public open(): void {
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsOpen);
			this._isOpen = true;
			this.setEventListeners();
		}

		// eslint-disable-next-line @typescript-eslint/member-ordering
		public close(): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsOpen);
			this._isOpen = false;
			this.removeEventListeners();
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
