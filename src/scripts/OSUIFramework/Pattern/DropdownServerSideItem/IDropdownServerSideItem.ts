// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DropdownServerSideItem {
	/**
	 * Defines the interface for OutSystemsUI DropdownServerSideItem Pattern
	 *
	 * @export
	 * @interface IDropdownServerSideItem
	 * @extends {Interface.IPattern}
	 */
	export interface IDropdownServerSideItem extends Interface.IChild {
		/**
		 * Key used to trigger the notification into Dropdown parent
		 *
		 * @memberof IDropdownServerSideItem
		 */
		keybordTriggerdKey: string;

		/**
		 * Method used to update the DropdownOptionItem selected state
		 *
		 * @memberof IDropdownServerSideItem
		 */
		updateSelected(): void;
	}
}
