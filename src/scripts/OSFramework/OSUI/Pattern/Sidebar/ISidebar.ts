// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Sidebar/ISidebar.ts
namespace OSFramework.Patterns.Sidebar {
========
namespace OSFramework.OSUI.Patterns.Sidebar {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Sidebar/ISidebar.ts
	/**
	 * Defines the interface for OutSystemsUI Sidebar Pattern
	 *
	 * @export
	 * @interface ISidebar
	 * @extends {Interface.IPattern}
	 * @extends {Interface.ICallback}
	 */
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Sidebar/ISidebar.ts
	export interface ISidebar extends Interface.IPattern, Interface.ICallback, Interface.IOpenable {
		/**
		 * Method signature to enable or disable the gestures on the pattern.
		 *
		 * @memberof ISidebar
		 */
		toggleGestures(enableSwipe): void;
========
	export interface ISidebar extends Interface.IPattern, Interface.IOpenable {
		clickOutsideToClose(closeOnOutSIdeClick: boolean): void;
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		toggleGestures(enableSwipe: boolean): void;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Sidebar/ISidebar.ts
	}
}
