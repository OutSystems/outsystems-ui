// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/IOpenable.ts
namespace OSFramework.Interface {
========
namespace OSFramework.OSUI.Interface {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/IOpenable.ts
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
		 * @memberof OSFramework.Interface.IOpenable
		 */
		close(): void;
		/**
		 * Method signature to open the pattern.
		 *
		 * @memberof OSFramework.Interface.IOpenable
		 */
		open(): void;
	}
}
