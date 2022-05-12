// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	export interface IDragEventPattern extends IGestureEventPattern {
		/**
		 * Signature Method to handle on gesture event end
		 *
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} timeTaken
		 * @memberof IGestureEventPattern
		 */
		onGestureEnd(offsetX: number, offsetY: number, timeTaken: number);

		/**
		 * Signature Method to handle on gesture event move
		 *
		 * @param {number} x
		 * @param {number} y
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {TouchEvent} evt
		 * @memberof IGestureEventPattern
		 */
		onGestureMove(x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent);

		/**
		 * Signature Method to handle on gesture event start
		 *
		 * @param {number} x
		 * @param {number} y
		 * @memberof IGestureEventPattern
		 */
		onGestureStart(x: number, y: number);

		/**
		 * Signature Method to add drag events
		 *
		 * @param {Callbacks.Generic} onGestureStart
		 * @param {Callbacks.Generic} onGestureMove
		 * @param {Callbacks.Generic} onGestureEnd
		 * @memberof IDragEventPattern
		 */
		setGestureEvents(
			onGestureStart: Callbacks.Generic,
			onGestureMove: Callbacks.Generic,
			onGestureEnd: Callbacks.Generic
		);
	}
}
