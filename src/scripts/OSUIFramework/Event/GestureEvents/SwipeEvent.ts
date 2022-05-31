// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event.GestureEvent {
	/**
	 * Class that represents the gesture events.
	 *
	 * @export
	 * @class SwipeEvent
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class SwipeEvent extends Event.GestureEvent.AbstractGestureEvent {
		// Store the swipe callbacks for each direction
		private _swipeDownCallback: Callbacks.Generic;
		private _swipeLeftCallback: Callbacks.Generic;
		private _swipeRightCallback: Callbacks.Generic;
		private _swipeUpCallback: Callbacks.Generic;

		// Distance threshold expected to be considered a swipe event
		private _threshold = 10;
		// Velocity expected to be considered a swipe event
		private _velocity = 0.3;

		constructor(target: HTMLElement) {
			super(target);
		}

		/**
		 * Method to set on GestureEnd callback, as this one needs an exception to detect the final direction swiped
		 *
		 * @private
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} timeTaken
		 * @memberof SwipeEvent
		 */
		private _onGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void {
			// CHeck if this a swipe
			if (
				// CHeck if the gesture done inside the bounds of the expected threshold
				(Math.abs(offsetX) > this._threshold || Math.abs(offsetY) > this._threshold) &&
				// Check if the gesture fast enough (this._velocity) to be considered a swipe
				(Math.abs(offsetX) / timeTaken > this._velocity || Math.abs(offsetY) / timeTaken > this._velocity)
			) {
				// Check if the swipe is horizontal
				if (Math.abs(offsetX) > Math.abs(offsetY)) {
					// Check if is swipe right
					if (offsetX > 0) {
						this._swipeRightCallback();
					} else {
						this._swipeLeftCallback();
					}
				} else if (offsetY > 0) {
					// Check if the swipe is down
					this._swipeDownCallback();
				} else {
					this._swipeUpCallback();
				}
			}
		}

		/**
		 * Method to set the expected callbacks
		 *
		 * @protected
		 * @param {Callbacks.Generic} swipeDownCallback
		 * @param {Callbacks.Generic} swipeLeftCallback
		 * @param {Callbacks.Generic} swipeRightCallback
		 * @param {Callbacks.Generic} swipeUpCallback
		 * @memberof SwipeEvent
		 */
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

			super.setCallbacks(undefined, undefined, this._onGestureEnd);
		}

		/**
		 * Method to set the expected callbacks and add eventListeners to the target element
		 *
		 * @param {Callbacks.onSwipeDown} swipeDownCallback
		 * @param {Callbacks.onSwipeLeft} swipeLeftCallback
		 * @param {Callbacks.onSwipeRight} swipeRightCallback
		 * @param {Callbacks.onSwipeUp} swipeUpCallback
		 * @memberof SwipeEvent
		 */
		public setEvents(
			swipeDownCallback: Callbacks.onSwipeDown,
			swipeLeftCallback: Callbacks.onSwipeLeft,
			swipeRightCallback: Callbacks.onSwipeRight,
			swipeUpCallback: Callbacks.onSwipeUp
		): void {
			this.setSwipeCallbacks(swipeDownCallback, swipeLeftCallback, swipeRightCallback, swipeUpCallback);
			super.setEventListeners();
		}
	}
}
