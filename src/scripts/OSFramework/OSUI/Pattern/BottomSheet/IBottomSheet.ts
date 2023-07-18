// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.BottomSheet {
	/**
	 * Defines the interface for OutSystemsUI BottomSheet Pattern
	 *
	 * @export
	 * @interface IBottomSheet
	 * @extends {Interface.IPattern}
	 */
	export interface IBottomSheet extends Interface.IPattern {
		/**
		 * Method to close the BottomSheet
		 *
		 * @memberof IBottomSheet
		 */
		close(): void;

		/**
		 * Method to open the BottomSheet
		 *
		 * @memberof IBottomSheet
		 */
		open(): void;
	}
}
