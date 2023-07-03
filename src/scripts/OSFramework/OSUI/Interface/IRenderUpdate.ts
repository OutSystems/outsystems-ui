// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Interface/IRenderUpdate.ts
namespace OSFramework.Interface {
========
namespace OSFramework.OSUI.Interface {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Interface/IRenderUpdate.ts
	/**
	 * Defines the interface for objects that are required to update onRender
	 *
	 * @export
	 * @interface IRenderUpdate
	 */
	export interface IRenderUpdate {
		/**
		 * Method that is invoked by the Platform OnRender event.
		 *
		 * @memberof OSFramework.Interface.IRenderUpdate
		 */
		updateOnRender(): void;
	}
}
