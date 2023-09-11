// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Sidebar Pattern
	 *
	 * @export
	 * @interface ISidebar
	 * @extends {Interface.IPattern}
	 * @extends {Interface.ICallback}
	 */
	export interface ISidebar extends Interface.IPattern, Interface.IOpenable {
		clickOutsideToClose(closeOnOutSIdeClick: boolean): void;
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		toggleGestures(enableSwipe: boolean): void;
	}
}
