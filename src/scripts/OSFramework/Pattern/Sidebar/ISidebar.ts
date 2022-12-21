// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Sidebar Pattern
	 *
	 * @export
	 * @interface ISidebar
	 * @extends {Interface.IPattern}
	 * @extends {Interface.ICallback}
	 */
	export interface ISidebar extends Interface.IPattern, Interface.ICallback, Interface.IOpenable {
		/**
		 * Method signature to enable or disable the gestures on the pattern.
		 *
		 * @memberof ISidebar
		 */
		toggleGestures(enableSwipe: boolean): void;
	}
}
