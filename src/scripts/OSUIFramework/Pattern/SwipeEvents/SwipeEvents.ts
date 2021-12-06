// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SwipeEvents {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class SwipeEvents extends AbstractPattern<SwipeEventsConfig> implements ISwipeEvents {
		private _swipeDownCallback: OSUIFramework.Callbacks.Generic;
		private _swipeLeftCallback: OSUIFramework.Callbacks.Generic;
		private _swipeRightCallback: OSUIFramework.Callbacks.Generic;
		private _swipeUpCallback: OSUIFramework.Callbacks.Generic;
		private _trackableElement: HTMLElement;

		//Threshold to understand if a swipe event was triggered
		private _threshold: number;
		// Velocity of the swipe event
		private _velocity: number;

		// Stores the touch event with bind(this)
		private _eventGestureMove: Callbacks.Generic;
		// Stores the touch event with bind(this)
		private _eventGestureStart: Callbacks.Generic;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SwipeEventsConfig(configs));
			this._threshold = Enum.Properties.Threshold;
			this._velocity = Enum.Properties.Velocity;

			this._eventGestureStart = this.EventGestureEnd.bind(this);
			this._eventGestureMove = this.EventGestureMove.bind(this);
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

		private _setEventListeners(): void {
			this._trackableElement = document.getElementById(this.configs.WidgetId);
			if (this._trackableElement) {
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._eventGestureStart);
				this._trackableElement.addEventListener(GlobalEnum.HTMLEvent.TouchMove, this._eventGestureMove);
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

		public build(): void {
			super.build();
			//this._setEventListeners();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
			//this._removeEventListeners();
		}

		public EventGestureMove(event: TouchEvent): void {
			if (event) {
				event.preventDefault();
			}
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
