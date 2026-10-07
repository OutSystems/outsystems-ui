// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI TabsContentItem Pattern
	 */
	export interface ITabsContentItem extends Interface.IChild {
		/**
		 * Returns the value of active state
		 */
		IsActive: boolean;

		/**
		 * Method to get the current data-tab value
		 */
		getDataTab(): number;

		/**
		 * Method to get the element offsetLeft value
		 */
		getOffsetLeft(): number;

		/**
		 * Method to set the aria-labelledby attribute
		 *
		 * @param headerItemId Element that will receive the aria-labelledby
		 */
		setAriaLabelledByAttribute(headerItemId: string): void;

		/**
		 * Method to set the data-tab attribute
		 *
		 * @param dataTab Tab that will be the active
		 */
		setDataTab(dataTab: number): void;

		/**
		 * Method to set the element as active
		 */
		setIsActive(): void;

		/**
		 * Method to set the intersection observer
		 *
		 * @param observer
		 */
		setOnDragObserver(observer: IntersectionObserver): void;

		/**
		 * Method to stop observing this element in the intersection observer
		 *
		 * @param observer
		 */
		unobserveDragObserver(observer: IntersectionObserver): void;

		/**
		 * Method to remove the element as active
		 */
		unsetIsActive(): void;
	}
}
