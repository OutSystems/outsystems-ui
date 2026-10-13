// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	/**
	 * Defines the interface for OutSystemsUI OverflowMenu Pattern
	 */
	export interface IOverflowMenu extends Interface.IPattern, Interface.IOpenable {
		disable(): void;
		enable(): void;

		/**
		 * Overload the open method.
		 *
		 * @param [isOpenedByApi] True when the open was requested through the API, not by user interaction
		 * @param [arrowKeyPressed] Arrow key that opened the menu; moves the focus to the first (down) or last (up) item
		 */
		open(
			isOpenedByApi?: boolean,
			arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp
		): void;
	}
}
