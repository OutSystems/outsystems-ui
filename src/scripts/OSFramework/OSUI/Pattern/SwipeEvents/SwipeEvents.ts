// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SwipeEvents {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class SwipeEvents extends AbstractPattern<SwipeEventsConfig> implements ISwipeEvents {
		// Stores the touch event with bind(this)
		private _gestureMoveEvent: GlobalCallbacks.Generic;
		// Stores the touch event with bind(this)
		private _gestureStartEvent: GlobalCallbacks.Generic;

		//Stores the element that will have the swipe event
		private _swipableElement: HTMLElement;

		// Callbacks for the platform
		private _swipeDownCallback: GlobalCallbacks.Generic;
		private _swipeLeftCallback: GlobalCallbacks.Generic;
		private _swipeRightCallback: GlobalCallbacks.Generic;
		private _swipeUpCallback: GlobalCallbacks.Generic;

		//Threshold to understand if a swipe event was triggered
		private _threshold: number;
		// Velocity of the swipe event
		private _velocity: number;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SwipeEventsConfig(configs));
			this._threshold = Enum.Properties.Threshold;
			this._velocity = Enum.Properties.Velocity;
		}

		// Remove Events
		private _removeEventListeners(): void {
			if (this._swipableElement) {
				this._swipableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._gestureStartEvent);
				this._swipableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._gestureMoveEvent);
			}
		}

		// Set Events
		private _setEventListeners(): void {
			if (this._swipableElement) {
				this._swipableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._gestureStartEvent);
				this._swipableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._gestureMoveEvent);
			}
		}

		// Method that triggers the SwipeDown event on the platform
		private _triggerSwipeDown(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(this._swipeDownCallback);
			}
		}

		// Method that triggers the SwipeLeft event on the platform
		private _triggerSwipeLeft(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(this._swipeLeftCallback);
			}
		}

		// Method that triggers the SwipeRight event on the platform
		private _triggerSwipeRight(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(this._swipeRightCallback);
			}
		}

		// Method that triggers the SwipeUp event on the platform
		private _triggerSwipeUp(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(this._swipeUpCallback);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		protected setA11YProperties(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Sets the callbacks to be used in the pattern.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		protected setCallbacks(): void {
			this._gestureStartEvent = this.EventGestureEnd.bind(this);
			this._gestureMoveEvent = this.EventGestureMove.bind(this);

			this._setEventListeners();
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		protected setHtmlElements(): void {
			this._swipableElement = document.getElementById(this.configs.WidgetId);
		}

		/**
		 * Removes event listeners and callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		protected unsetCallbacks(): void {
			this._removeEventListeners();

			this._gestureStartEvent = undefined;
			this._gestureMoveEvent = undefined;
		}

		/**
		 * Release references to HTML elements.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		protected unsetHtmlElements(): void {
			this._swipableElement = undefined;
		}

		/**
		 * Based on the offset, this method triggers the methods on the platform
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} timeTaken
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		public EventGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			if (
				(Math.abs(offsetX) > this._threshold || Math.abs(offsetY) > this._threshold) &&
				(Math.abs(offsetX) / timeTaken > this._velocity || Math.abs(offsetY) / timeTaken > this._velocity)
			) {
				//Is the gesture horizontal?
				if (Math.abs(offsetX) > Math.abs(offsetY)) {
					// Is the gesture a swipe right?
					if (offsetX > 0) {
						this._triggerSwipeRight();
					} else {
						this._triggerSwipeLeft();
					}
				} else if (offsetY > 0) {
					//Is the gesture a swipe down?
					this._triggerSwipeDown();
				} else {
					this._triggerSwipeUp();
				}
			}
		}

		/**
		 * Block the default behaviour of the GestureMove
		 *
		 * @param {TouchEvent} event
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		public EventGestureMove(event: TouchEvent): void {
			if (event) {
				event.preventDefault();
			}
		}

		/**
		 * Method to build the SwipeEvents
		 *
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setCallbacks();
			this.finishBuild();
		}

		/**
		 * Destroy SwipeEvents
		 *
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		public dispose(): void {
			super.dispose();
			this.unsetCallbacks();
			this.unsetHtmlElements();
		}

		/**
		 * Method used to register the provider callback
		 *
		 * @param {string} eventName Event name that will be assigned
		 * @param {GlobalCallbacks.OSGeneric} callback Function name that will be passed as a callback function to the event above
		 * @memberof OSFramework.Patterns.SwipeEvents.SwipeEvents
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Patterns.SwipeEvents.Enum.Events.SwipeDown:
					this._swipeDownCallback = callback;
					break;
				case Patterns.SwipeEvents.Enum.Events.SwipeUp:
					this._swipeUpCallback = callback;
					break;
				case Patterns.SwipeEvents.Enum.Events.SwipeRight:
					this._swipeRightCallback = callback;
					break;
				case Patterns.SwipeEvents.Enum.Events.SwipeLeft:
					this._swipeLeftCallback = callback;
					break;
			}
		}
	}
}
