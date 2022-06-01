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
		// Store gesture events instance
		private _gestureEventInstance: Event.GestureEvent.DragEvent;
		// Store if the pattern has gesture events added
		private _hasGestureEvents: boolean;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _height: number;

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
				// as we need to pass this._selfElem, only available after super.build()
				this._gestureEventInstance = new Event.GestureEvent.DragEvent(this._selfElem);

				// Set event listeners and callbacks
				this.setGestureEvents(
					this._onGestureStart.bind(this),
					this._onGestureMove.bind(this),
					this._onGestureEnd.bind(this)
				);
				// Apply transform on an element and perform animation
				this._animateOnDragInstance = new Animation.AnimateOnDrag(this._selfElem);
			}
		}

		// Method to handle the start of a gesture
		private _onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			this._animateOnDragInstance.onDragEnd(offsetX, offsetY, timeTaken, this.close.bind(this));
			Animation.OverlayTransitionOnDrag.UnSet(this._selfElem);
		}

		// Method to handle the gesture move
		private _onGestureMove(x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void {
			this._animateOnDragInstance.onDragMove(offsetX, offsetY, x, y, evt);
			Animation.OverlayTransitionOnDrag.Set(
				this._selfElem,
				x,
				GlobalEnum.Direction.Left,
				this._height.toString()
			);
		}

		// Method to handle the end of a gesture
		private _onGestureStart(x: number, y: number): void {
			this._animateOnDragInstance.onDragStart(
				false,
				GlobalEnum.Direction.Up,
				x,
				y,
				this._isOpen,
				this._height.toString()
			);
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

		protected setListeners(): void {
			this._bottomSheetContentElem.addEventListener('scroll', () => {
				if (this._bottomSheetContentElem.scrollTop === 0) {
					this._selfElem.classList.remove('osui-bottom-sheet--has-scroll');
				} else {
					this._selfElem.classList.add('osui-bottom-sheet--has-scroll');
				}
			});
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected setHtmlElements(): void {
			this._bottomSheetOverlayElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternOverlay);
			this._bottomSheetTopBarElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternTopBar);
			this._bottomSheetContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContent);
			this._bottomSheetHeaderElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternHeader);
		}

		protected setInitialCssClasses(): void {
			if (this.configs.ShowHandler) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.HasHandler);
			}
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected unsetHtmlElements(): void {
			// TODO (by CreateNewPattern) Update or Remove
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
			this.setA11yProperties();
			this._height = this._selfElem.clientHeight;
			this.setListeners();
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
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof BottomSheet
		 */
		public dispose(): void {
			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		public open(): void {
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsOpen);
			Helper.Dom.Styles.AddClass(this._bottomSheetOverlayElem, Enum.CssClass.IsOpen);
			this._isOpen = true;
		}

		// eslint-disable-next-line @typescript-eslint/member-ordering
		public close(): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsOpen);
			Helper.Dom.Styles.RemoveClass(this._bottomSheetOverlayElem, Enum.CssClass.IsOpen);
			this._isOpen = false;
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
