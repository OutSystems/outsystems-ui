// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export interface IBuilder {
		/**
		 * Build object, instantiating dependencies, and maniulating DOM when necessary
		 *
		 */
		build(): void;
	}
}
