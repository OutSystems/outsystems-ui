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
		/**
		 * Method to toggle the click on outside to close the Sidebar.
		 *
		 * @param {boolean} closeOnOutSIdeClick
		 * @memberof ISidebar
		 */
		clickOutsideToClose(closeOnOutSIdeClick: boolean): void;

		/**
		 * Method that toggle swipes on Sidebar.
		 *
		 * @param {boolean} enableSwipe
		 * @memberof ISidebar
		 */
		toggleGestures(enableSwipe: boolean): void;
	}
}
