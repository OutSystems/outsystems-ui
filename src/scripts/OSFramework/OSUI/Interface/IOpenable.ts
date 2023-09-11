// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	/**
	 * Defines the interface for objects that can open and close
	 *
	 * @export
	 * @interface IOpenable
	 */
	export interface IOpenable {
		isOpen?: boolean;
		/**
		 * Method signature to close the pattern.
		 *
		 * @memberof OSFramework.Interface.IOpenable
		 */
		close(): void;

		/**
		 * Method signature to open the pattern.
		 *
		 * @param {boolean} [isOpenedByApi]
		 * @memberof IOpenable
		 */
		open(isOpenedByApi?: boolean): void;
	}
}
