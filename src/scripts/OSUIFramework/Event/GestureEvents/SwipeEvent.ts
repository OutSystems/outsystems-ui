// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	/**
	 * Class that represents the gesture events.
	 *
	 * @export
	 * @class GestureEvent
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class SwipeEvent extends Event.GestureEvent implements IGestureEvent {
		private _swipeDownCallback: Callbacks.Generic;
		private _swipeLeftCallback: Callbacks.Generic;
		private _swipeRightCallback: Callbacks.Generic;
		private _swipeUpCallback: Callbacks.Generic;

		//Threshold to understand if a swipe event was triggered
		private _threshold: number;
		// Velocity of the swipe event
		private _velocity: number;

		constructor(target: HTMLElement) {
			super(target);
			this._threshold = 10;
			this._velocity = 0.3;
			console.log('swipe constructor');
		}

		private _setEventListeners(): void {
			super.setEventListeners();
		}

		protected setSwipeCallbacks(
			swipeDownCallback: Callbacks.Generic,
			swipeLeftCallback: Callbacks.Generic,
			swipeRightCallback: Callbacks.Generic,
			swipeUpCallback: Callbacks.Generic
		): void {
			this._swipeDownCallback = swipeDownCallback;
			this._swipeLeftCallback = swipeLeftCallback;
			this._swipeRightCallback = swipeRightCallback;
			this._swipeUpCallback = swipeUpCallback;

			super.setCallbacks(this.onGestureStart, this.onGestureMove, this.onGestureEnd);
		}

		public onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			console.log('onGestureEnd');
			if (
				(Math.abs(offsetX) > this._threshold || Math.abs(offsetY) > this._threshold) &&
				(Math.abs(offsetX) / timeTaken > this._velocity || Math.abs(offsetY) / timeTaken > this._velocity)
			) {
				//Is the gesture horizontal?
				if (Math.abs(offsetX) > Math.abs(offsetY)) {
					// Is the gesture a swipe right?
					if (offsetX > 0) {
						console.log('right');
						this._swipeRightCallback();
					} else {
						console.log('left');
						this._swipeLeftCallback();
					}
				} else if (offsetY > 0) {
					console.log('down');
					//Is the gesture a swipe down?
					this._swipeDownCallback();
				} else {
					console.log('up');
					this._swipeUpCallback();
				}
			}
		}

		public onGestureMove(event: TouchEvent): void {
			//super.eventTouchMove(event);
		}

		public onGestureStart(event: TouchEvent): void {
			//super.eventTouchStart(event);
		}

		public setSwipeEvents(
			swipeDownCallback: Callbacks.Generic,
			swipeLeftCallback: Callbacks.Generic,
			swipeRightCallback: Callbacks.Generic,
			swipeUpCallback: Callbacks.Generic
		): void {
			console.log('swipe setEvents');
			this.setSwipeCallbacks(swipeDownCallback, swipeLeftCallback, swipeRightCallback, swipeUpCallback);
			this._setEventListeners();
		}
	}
}
