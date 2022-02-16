// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DropdownServerSideItem {
	/**
	 * Defines the interface for OutSystemsUI DropdownServerSideItem Pattern
	 *
	 * @export
	 * @interface IDropdownServerSideItem
	 * @extends {Interface.IPattern}
	 */
	export interface IDropdownServerSideItem
		extends Interface.IChild<Providers.Dropdown.OSUIComponents.IDropdownServerSide> {
		/**
		 * Key used to trigger the notification into Dropdown parent
		 *
		 * @memberof IDropdownServerSideItem
		 */
		keybordTriggerdKey: GlobalEnum.Keycodes;
	}
}
