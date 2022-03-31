// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Interface {
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
		 * @memberof IRenderUpdate
		 */
		updateOnRender(): void;
	}
}
