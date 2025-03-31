// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.GestureEvent {
	/**
	 * Class that represents the gesture events.
	 *
	 * @export
	 * @class SwipeEvent
	 * @extends {Event.AbstractEvent<string>}
	 */
	export class SwipeEvent extends AbstractGestureEvent {
		// Store the swipe callbacks for each direction
		private _swipeDownCallback: GlobalCallbacks.Generic;
		private _swipeLeftCallback: GlobalCallbacks.Generic;
		private _swipeRightCallback: GlobalCallbacks.Generic;
		private _swipeUpCallback: GlobalCallbacks.Generic;

		// Distance threshold expected to be considered a swipe event
		private _threshold = 10;
		// Velocity expected to be considered a swipe event
		private _velocity = 0.3;

		constructor(target: HTMLElement) {
			super(target);
		}

		// Method to set on GestureEnd callback, as this one needs an exception to detect the final direction swiped
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
		 * @param {GlobalCallbacks.Generic} swipeDownCallback
		 * @param {GlobalCallbacks.Generic} swipeLeftCallback
		 * @param {GlobalCallbacks.Generic} swipeRightCallback
		 * @param {GlobalCallbacks.Generic} swipeUpCallback
		 * @memberof OSFramework.Event.GestureEvent.SwipeEvent
		 */
		protected setSwipeCallbacks(
			swipeDownCallback: GlobalCallbacks.Generic,
			swipeLeftCallback: GlobalCallbacks.Generic,
			swipeRightCallback: GlobalCallbacks.Generic,
			swipeUpCallback: GlobalCallbacks.Generic
		): void {
			this._swipeDownCallback = swipeDownCallback;
			this._swipeLeftCallback = swipeLeftCallback;
			this._swipeRightCallback = swipeRightCallback;
			this._swipeUpCallback = swipeUpCallback;

			this.setCallbacks(undefined, undefined, this._onGestureEnd);
		}

		/**
		 * Method to set the expected callbacks and add eventListeners to the target element
		 *
		 * @param {Event.GestureEvent.swipeDown} swipeDownCallback
		 * @param {Event.GestureEvent.swipeLeft} swipeLeftCallback
		 * @param {Event.GestureEvent.swipeRight} swipeRightCallback
		 * @param {Event.GestureEvent.swipeUp} swipeUpCallback
		 * @memberof OSFramework.Event.GestureEvent.SwipeEvent
		 */
		public setSwipeEvents(
			swipeDownCallback: Event.GestureEvent.Callbacks.SwipeDown,
			swipeLeftCallback: Event.GestureEvent.Callbacks.SwipeLeft,
			swipeRightCallback: Event.GestureEvent.Callbacks.SwipeRight,
			swipeUpCallback: Event.GestureEvent.Callbacks.SwipeUp
		): void {
			this.setSwipeCallbacks(swipeDownCallback, swipeLeftCallback, swipeRightCallback, swipeUpCallback);
			this.setEventListeners();
		}
	}
}
