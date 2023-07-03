// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/IDisposable.ts
namespace OSFramework.Interface {
========
namespace OSFramework.OSUI.Interface {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/IDisposable.ts
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
