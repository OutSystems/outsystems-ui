// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Interface {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 *
	 * @export
	 * @interface IBuilder
	 */
	export interface IBuilder {
		/**
		 * Build object, instantiating dependencies, and manipulating DOM when necessary
		 *
		 * @memberof OSFramework.Interface.IBuilder
		 */
		build(): void;
	}
}
