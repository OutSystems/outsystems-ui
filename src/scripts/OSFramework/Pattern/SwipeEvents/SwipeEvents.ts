// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.SwipeEvents {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class SwipeEvents extends AbstractPattern<SwipeEventsConfig> implements ISwipeEvents {
		// Stores the touch event with bind(this)
		private _gestureMoveEvent: Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _gestureStartEvent: Callbacks.Generic;

		//Stores the element that will have the swipe event
		private _swipableElement: HTMLElement;

		// Callbacks for the platform
		private _swipeDownCallback: Callbacks.Generic;
		private _swipeLeftCallback: Callbacks.Generic;
		private _swipeRightCallback: Callbacks.Generic;
		private _swipeUpCallback: Callbacks.Generic;

		//Threshold to understand if a swipe event was triggered
		private _threshold: number;
		// Velocity of the swipe event
		private _velocity: number;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SwipeEventsConfig(configs));
			this._threshold = Enum.Properties.Threshold;
			this._velocity = Enum.Properties.Velocity;
		}

		private _removeEventListeners(): void {
			if (this._swipableElement) {
				this._swipableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._gestureStartEvent);
				this._swipableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._gestureMoveEvent);
			}
		}

		private _setEventListeners(): void {
			if (this._swipableElement) {
				this._swipableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._gestureStartEvent);
				this._swipableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._gestureMoveEvent);
			}
		}

		/**
		 * Method that triggers the SwipeDown event on the platform
		 */
		private _triggerSwipeDown(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(this._swipeDownCallback);
			}
		}

		/**
		 * Method that triggers the SwipeLeft event on the platform
		 */
		private _triggerSwipeLeft(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(this._swipeLeftCallback);
			}
		}

		/**
		 * Method that triggers the SwipeRight event on the platform
		 */
		private _triggerSwipeRight(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(this._swipeRightCallback);
			}
		}

		/**
		 * Method that triggers the SwipeUp event on the platform
		 */
		private _triggerSwipeUp(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(this._swipeUpCallback);
			}
		}

		/**
		 * Sets the callbacks to be used in the pattern.
		 *
		 * @protected
		 * @memberof SwipeEvents
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
		 * @memberof SwipeEvents
		 */
		protected setHtmlElements(): void {
			this._swipableElement = document.getElementById(this.configs.WidgetId);
		}

		/**
		 * Removes event listeners and callbacks.
		 *
		 * @protected
		 * @memberof SwipeEvents
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
		 * @memberof SwipeEvents
		 */
		protected unsetHtmlElements(): void {
			this._swipableElement = undefined;
		}

		/**
		 * Based on the offset, this method triggers the methods on the platform
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} timeTaken
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
		 *
		 * @param {TouchEvent} event
		 */
		public EventGestureMove(event: TouchEvent): void {
			if (event) {
				event.preventDefault();
			}
		}

		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setCallbacks();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
			this.unsetCallbacks();
			this.unsetHtmlElements();
		}

		public registerCallback(eventName: string, callback: Callbacks.OSGeneric): void {
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
