// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	export interface IGestureEventPattern {
		/**
		 * Store if the pattern has gesture events
		 *
		 * @type {boolean}
		 * @memberof IGestureEventPattern
		 */
		hasGestureEvents: boolean;

		/**
		 * Signature Method to remove the gesture events
		 *
		 * @memberof IGestureEventPattern
		 */
		removeGestureEvents(): void;
	}
}
