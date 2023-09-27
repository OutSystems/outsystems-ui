// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI TabsContentItem Pattern
	 *
	 * @export
	 * @interface ITabsContentItem
	 * @extends {Interface.IChild}
	 */
	export interface ITabsContentItem extends Interface.IChild {
		/**
		 * Returns the value of active state
		 *
		 * @type {boolean}
		 * @memberof ITabsContentItem
		 */
		IsActive: boolean;

		/**
		 * Method to get the current data-tab value
		 *
		 * @return {*}  {number}
		 * @memberof ITabsContentItem
		 */
		getDataTab(): number;

		/**
		 * Method to get the element offsetLeft value
		 *
		 * @return {*}  {number}
		 * @memberof ITabsContentItem
		 */
		getOffsetLeft(): number;

		/**
		 * Method to set the aria-labelledby attribute
		 *
		 * @param {string} headerItemId Element that will receive the aria-labelledby
		 * @memberof ITabsContentItem
		 */
		setAriaLabelledByAttribute(headerItemId: string): void;

		/**
		 * Method to set the data-tab attribute
		 *
		 * @param {number} dataTab Tab that will be the active
		 * @memberof ITabsContentItem
		 */
		setDataTab(dataTab: number): void;

		/**
		 * Method to set the element as active
		 *
		 * @memberof ITabsContentItem
		 */
		setIsActive(): void;

		/**
		 * Method to set the intersection observer
		 *
		 * @param {IntersectionObserver} observer
		 * @memberof ITabsContentItem
		 */
		setOnDragObserver(observer: IntersectionObserver): void;

		/**
		 * Method to stop observing this element in the intersection observer
		 *
		 * @param {IntersectionObserver} observer
		 * @memberof ITabsContentItem
		 */
		unobserveDragObserver(observer: IntersectionObserver): void;

		/**
		 * Method to remove the element as active
		 *
		 * @memberof ITabsContentItem
		 */
		unsetIsActive(): void;
	}
}
