// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DropdownServerSideItem {
	/**
	 * Defines the interface for OutSystemsUI DropdownServerSideItem Pattern
	 *
	 * @export
	 * @interface IDropdownServerSideItem
	 * @extends {Interface.IPattern}
	 */
	export interface IDropdownServerSideItem extends Interface.IPattern {
		/**
		 * Key used to trigger the notification into Dropdown parent
		 *
		 * @memberof IDropdownServerSideItem
		 */
		keyordTriggerdKey: GlobalEnum.Keycodes;

		/**
		 * Method used to set the tabindex attribute
		 *
		 * @memberof IDropdownServerSideItem
		 */
		setA11yTabindex(): void;

		/**
		 * Method used to set item as focus state
		 *
		 * @memberof IDropdownServerSideItem
		 */
		setBlur(): void;

		/**
		 * Method used to set item as blur state
		 *
		 * @memberof IDropdownServerSideItem
		 */
		setFocus(): void;

		/**
		 * Method used to unset the tabindex attribute
		 *
		 * @memberof IDropdownServerSideItem
		 */
		unsetA11yTabindex(): void;
	}
}
