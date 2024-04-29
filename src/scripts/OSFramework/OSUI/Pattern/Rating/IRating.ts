// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Rating {
	/**
	 * Defines the interface for OutSystemsUI Rating Pattern
	 *
	 * @export
	 * @interface IRating
	 * @extends {Interface.IPattern}
	 */
	export interface IRating extends Interface.IPattern {
		/**
		 * Method that will set Rating as disabled
		 *
		 * @memberof IRating
		 */
		disable(): void;

		/**
		 * Method that will set Rating as enabled
		 *
		 * @memberof IRating
		 */
		enable(): void;
	}
}
