// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SwipeEvents {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class SwipeEvents extends AbstractPattern<SwipeEventsConfig> implements ISwipeEvents {
		// Stores the touch event with bind(this)
		private _gestureMoveEvent: Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _gestureStartEnd: Callbacks.Generic;

		//Stores the element that will have the swipe event
		private _swipableElement: HTMLElement;
		private _swipeDownCallback: OSUIFramework.Callbacks.Generic;
		private _swipeLeftCallback: OSUIFramework.Callbacks.Generic;
		private _swipeRightCallback: OSUIFramework.Callbacks.Generic;
		private _swipeUpCallback: OSUIFramework.Callbacks.Generic;
		//Threshold to understand if a swipe event was triggered
		private _threshold: number;
		// Velocity of the swipe event
		private _velocity: number;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SwipeEventsConfig(configs));
			this._threshold = Enum.Properties.Threshold;
			this._velocity = Enum.Properties.Velocity;

			this._gestureStartEnd = this.EventGestureEnd.bind(this);
			this._gestureMoveEvent = this.EventGestureMove.bind(this);
		}

		private _removeEventListeners(): void {
			if (this._swipableElement) {
				this._swipableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._gestureStartEnd);
				this._swipableElement.removeEventListener(GlobalEnum.HTMLEvent.TouchMove, this._gestureMoveEvent);
			}
		}

		private _setEventListeners(): void {
			this._swipableElement = document.getElementById(this.configs.WidgetId);
			if (this._swipableElement) {
				this._swipableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._gestureStartEnd);
				this._swipableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._gestureMoveEvent);
			}
		}

		// Method that triggers the SwipeDown event on the platform
		private _triggerSwipeDown(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(() => {
					this._swipeDownCallback();
				});
			}
		}

		// Method that triggers the SwipeLeft event on the platform
		private _triggerSwipeLeft(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(() => {
					this._swipeLeftCallback();
				});
			}
		}

		// Method that triggers the SwipeRight event on the platform
		private _triggerSwipeRight(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(() => {
					this._swipeRightCallback();
				});
			}
		}

		// Method that triggers the SwipeUp event on the platform
		private _triggerSwipeUp(): void {
			if (this._swipeRightCallback) {
				Helper.AsyncInvocation(() => {
					this._swipeUpCallback();
				});
			}
		}
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

		public EventGestureMove(event: TouchEvent): void {
			if (event) {
				event.preventDefault();
			}
		}

		public build(): void {
			super.build();
			this._setEventListeners();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
			this._removeEventListeners();
		}

		public registerCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.SwipeEvents.Enum.Events.SwipeDown:
					this._swipeDownCallback = callback;
					break;
				case OSUIFramework.Patterns.SwipeEvents.Enum.Events.SwipeUp:
					this._swipeUpCallback = callback;
					break;
				case OSUIFramework.Patterns.SwipeEvents.Enum.Events.SwipeRight:
					this._swipeRightCallback = callback;
					break;
				case OSUIFramework.Patterns.SwipeEvents.Enum.Events.SwipeLeft:
					this._swipeLeftCallback = callback;
					break;
			}
		}
	}
}
