// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	export interface IGestureEventPattern {
		/**
		 * Signature Method to create the gesture events instance
		 *
		 * @memberof IGestureEventPattern
		 */
		createGestureEventInstance(): void;

		/**
		 * Signature Method to remove the gesture events
		 *
		 * @memberof IGestureEventPattern
		 */
		removeGestureEvents();
	}
}
