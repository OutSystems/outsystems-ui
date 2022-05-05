// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	/**
	 * Defines the interface for OutSystemsUI Tooltip Pattern
	 */
	export interface ITooltip extends Interface.IPattern, Interface.IOpenable {
		/**
		 * Getter that allows to obtain the IsOpen status.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof IDropdownServerSideItem
		 */
		get IsOpen(): boolean;
	}
}
