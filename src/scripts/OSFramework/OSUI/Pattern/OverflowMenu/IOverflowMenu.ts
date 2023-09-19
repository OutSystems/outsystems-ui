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
		 * @param {boolean} [isOpenedByApi]
		 * @param {boolean} [arrowKeyPressed]
		 * @memberof IOverflowMenu
		 */
		open(
			isOpenedByApi?: boolean,
			arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp
		): void;
	}
}
