// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.BottomSheet {
	/**
	 * Defines the interface for OutSystemsUI BottomSheet Pattern
	 *
	 * @export
	 * @interface IBottomSheet
	 * @extends {Interface.IPattern}
	 */
	export interface IBottomSheet extends Interface.IPattern {
		close();
		open();
		registerCallback(callback: GlobalCallbacks.Generic);
	}
}
