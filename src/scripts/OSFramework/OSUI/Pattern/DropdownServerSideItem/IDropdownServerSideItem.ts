// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/DropdownServerSideItem/IDropdownServerSideItem.ts
namespace OSFramework.Patterns.DropdownServerSideItem {
========
namespace OSFramework.OSUI.Patterns.DropdownServerSideItem {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/DropdownServerSideItem/IDropdownServerSideItem.ts
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
		 * @memberof OSFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		 */
		keyboardTriggeredKey: string;

		/**
		 * Getter that allows to obtain the IsSelectd status value.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		 */
		get IsSelected(): boolean;

		/**
		 * Getter that allows to obtain the ItemId value.
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem
		 */
		get ItemId(): string;
		/**
		 * Method used to update the DropdownOptionItem selected state
		 *
		 * @param triggerCallback True by default, used to block the callback when needed
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/DropdownServerSideItem/IDropdownServerSideItem.ts
		 * @memberof IDropdownServerSideItem
========
		 * @memberof OSFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/DropdownServerSideItem/IDropdownServerSideItem.ts
		 */
		toggleSelected(triggerCallback?: boolean): void;
	}
}
