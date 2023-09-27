// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI TabsHeaderItem Pattern
	 *
	 * @export
	 * @interface ITabsHeaderItem
	 * @extends {Interface.IChild}
	 */
	export interface ITabsHeaderItem extends Interface.IChild {
		/**
		 * Returns the value of active state
		 *
		 * @type {boolean}
		 * @memberof ITabsHeaderItem
		 */
		IsActive: boolean;

		/**
		 * Method to disable TabHeaderItem
		 *
		 * @memberof ITabsHeaderItem
		 */
		disable(): void;

		/**
		 * Method to enable TabHeaderItem
		 *
		 * @memberof ITabsHeaderItem
		 */
		enable(): void;

		/**
		 * Method to get the current data-tab value
		 *
		 * @return {*}  {number}
		 * @memberof ITabsHeaderItem
		 */
		getDataTab(): number;

		/**
		 * Method to set the aria-controls attribute
		 *
		 * @param {string} contentItemId Element that will receive the aria-controls
		 * @memberof ITabsHeaderItem
		 */
		setAriaControlsAttribute(contentItemId: string): void;

		/**
		 * Method to set the data-tab attribute
		 *
		 * @param {number} dataTab Tab that will be the active
		 * @memberof ITabsHeaderItem
		 */
		setDataTab(dataTab: number): void;

		/**
		 * Method to set the focus on item
		 *
		 * @memberof ITabsHeaderItem
		 */
		setFocus(): void;

		/**
		 * Method to set the element as active
		 *
		 * @memberof ITabsHeaderItem
		 */
		setIsActive(): void;

		/**
		 * Method to remove the element as active
		 *
		 * @memberof ITabsHeaderItem
		 */
		unsetIsActive(): void;

		/**
		 * Method to update tabs indicator size on HeaderItem onRender
		 *
		 * @memberof ITabsHeaderItem
		 */
		updateOnRender(): void;
	}
}
