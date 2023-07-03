// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	export interface IGestureEvent {
		/**
		 * Store if the pattern has gesture events
		 *
		 * @type {boolean}
		 * @memberof IGestureEvent
		 */
		hasGestureEvents: boolean;

		/**
		 * Signature Method to remove the gesture events
		 *
		 * @memberof OSFramework.Interface.IGestureEventPattern
		 */
		removeGestureEvents(): void;
	}
}
