// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DropdownServerSideItem {
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
		 * @type {string}
		 * @memberof OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		 */
		keyboardTriggeredKey: string;

		/**
		 * Getter that allows to obtain the IsSelectd status value.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		 */
		get IsSelected(): boolean;

		/**
		 * Getter that allows to obtain the ItemId value.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		 */
		get ItemId(): string;
		/**
		 * Method used to update the DropdownOptionItem selected state
		 *
		 * @param triggerCallback True by default, used to block the callback when needed
		 * @memberof OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		 */
		toggleSelected(triggerCallback?: boolean): void;
	}
}
