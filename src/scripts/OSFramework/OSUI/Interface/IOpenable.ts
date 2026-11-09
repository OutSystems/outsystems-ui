// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	/**
	 * Defines the interface for objects that can open and close
	 */
	export interface IOpenable {
		isOpen?: boolean;
		/**
		 * Method signature to close the pattern.
		 */
		close(): void;

		/**
		 * Method signature to open the pattern.
		 *
		 * @param [isOpenedByApi] True when the open was requested through the API, not by user interaction
		 */
		open(isOpenedByApi?: boolean): void;
	}
}
