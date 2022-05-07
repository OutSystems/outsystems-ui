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
		private _threshold = 10;
		// Velocity of the swipe event
		private _velocity = 0.3;

		constructor(target: HTMLElement) {
			super(target);
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

			super.setCallbacks(undefined, undefined, this.onGestureEnd);
		}

		public onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			if (
				(Math.abs(offsetX) > this._threshold || Math.abs(offsetY) > this._threshold) &&
				(Math.abs(offsetX) / timeTaken > this._velocity || Math.abs(offsetY) / timeTaken > this._velocity)
			) {
				//Is the gesture horizontal?
				if (Math.abs(offsetX) > Math.abs(offsetY)) {
					// Is the gesture a swipe right?
					if (offsetX > 0) {
						this._swipeRightCallback();
					} else {
						this._swipeLeftCallback();
					}
				} else if (offsetY > 0) {
					//Is the gesture a swipe down?
					this._swipeDownCallback();
				} else {
					this._swipeUpCallback();
				}
			}
		}

		public setEvents(
			swipeDownCallback: Callbacks.Generic,
			swipeLeftCallback: Callbacks.Generic,
			swipeRightCallback: Callbacks.Generic,
			swipeUpCallback: Callbacks.Generic
		): void {
			this.setSwipeCallbacks(swipeDownCallback, swipeLeftCallback, swipeRightCallback, swipeUpCallback);
			super.setEventListeners();
		}
	}
}
