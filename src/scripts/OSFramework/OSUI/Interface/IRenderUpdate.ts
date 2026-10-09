// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Interface {
	/**
	 * Defines the interface for objects that are required to update onRender
	 */
	export interface IRenderUpdate {
		/**
		 * Method that is invoked by the Platform OnRender event.
		 */
		updateOnRender(): void;
	}
}
