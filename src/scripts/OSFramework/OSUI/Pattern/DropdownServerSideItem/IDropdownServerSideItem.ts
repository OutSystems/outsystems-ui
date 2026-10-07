// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DropdownServerSideItem {
	/**
	 * Defines the interface for OutSystemsUI DropdownServerSideItem Pattern
	 */
	export interface IDropdownServerSideItem extends Interface.IChild {
		/**
		 * Key used to trigger the notification into Dropdown parent
		 */
		keyboardTriggeredKey: string;

		/**
		 * Getter that allows to obtain the IsSelectd status value.
		 *
		 * @readonly
		 */
		get IsSelected(): boolean;

		/**
		 * Getter that allows to obtain the ItemId value.
		 *
		 * @readonly
		 */
		get ItemId(): string;
		/**
		 * Method used to update the DropdownOptionItem selected state
		 *
		 * @param triggerCallback True by default, used to block the callback when needed
		 */
		toggleSelected(triggerCallback?: boolean): void;
	}
}
