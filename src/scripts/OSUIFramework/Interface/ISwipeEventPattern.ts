// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	export interface ISwipeEventPattern extends IGestureEventPattern {
		/**
		 * Signature Method to act as callback for swipe bottom event
		 *
		 * @memberof ISwipeEventPattern
		 */
		onSwipeBottom(): void;

		/**
		 * Signature Method to act as callback for swipe left event
		 *
		 * @memberof ISwipeEventPattern
		 */
		onSwipeLeft(): void;

		/**
		 * Signature Method to act as callback for swipe right event
		 *
		 * @memberof ISwipeEventPattern
		 */
		onSwipeRight(): void;

		/**
		 * Signature Method to act as callback for swipe up event
		 *
		 * @memberof ISwipeEventPattern
		 */
		onSwipeUp(): void;

		/**
		 * Signature Method to add swipe events
		 *
		 * @param {Callbacks.Generic} swipeDownCallback
		 * @param {Callbacks.Generic} swipeLeftCallback
		 * @param {Callbacks.Generic} swipeRightCallback
		 * @param {Callbacks.Generic} swipeUpCallback
		 * @memberof ISwipeEventPattern
		 */
		setGestureEvents(
			swipeDownCallback: Callbacks.Generic,
			swipeLeftCallback: Callbacks.Generic,
			swipeRightCallback: Callbacks.Generic,
			swipeUpCallback: Callbacks.Generic
		);
	}
}
