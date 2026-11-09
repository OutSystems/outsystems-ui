// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI TabsHeaderItem Pattern
	 */
	export interface ITabsHeaderItem extends Interface.IChild {
		/**
		 * Returns the value of active state
		 */
		IsActive: boolean;

		/**
		 * Method to disable TabHeaderItem
		 */
		disable(): void;

		/**
		 * Method to enable TabHeaderItem
		 */
		enable(): void;

		/**
		 * Method to get the current data-tab value
		 */
		getDataTab(): number;

		/**
		 * Method to set the aria-controls attribute
		 *
		 * @param contentItemId Element that will receive the aria-controls
		 */
		setAriaControlsAttribute(contentItemId: string): void;

		/**
		 * Method to set the data-tab attribute
		 *
		 * @param dataTab Tab that will be the active
		 */
		setDataTab(dataTab: number): void;

		/**
		 * Method to set the focus on item
		 */
		setFocus(): void;

		/**
		 * Method to set the element as active
		 */
		setIsActive(): void;

		/**
		 * Method to remove the element as active
		 */
		unsetIsActive(): void;

		/**
		 * Method to update tabs indicator size on HeaderItem onRender
		 */
		updateOnRender(): void;
	}
}
