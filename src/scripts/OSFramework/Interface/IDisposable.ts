// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	/**
	 * Defines the interface for disposable objects
	 *
	 * @export
	 * @interface IDisposable
	 */
	export interface IDisposable {
		/**
		 * Dispose object and free up its used resources
		 *
		 * @memberof OSFramework.Interface.IDisposable
		 */
		dispose(): void;
	}
}
