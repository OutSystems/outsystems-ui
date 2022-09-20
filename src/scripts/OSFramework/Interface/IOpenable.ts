// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	/**
	 * Defines the interface for objects that can open and close
	 *
	 * @export
	 * @interface IOpenable
	 */
	export interface IOpenable {
		/**
		 * Method signature to close the pattern.
		 *
		 * @memberof IOpenable
		 */
		close(): void;
		/**
		 * Method signature to open the pattern.
		 *
		 * @memberof IOpenable
		 */
		open(): void;
	}
}
