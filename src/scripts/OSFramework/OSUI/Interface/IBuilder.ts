// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/IBuilder.ts
namespace OSFramework.Interface {
========
namespace OSFramework.OSUI.Interface {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/IBuilder.ts
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
