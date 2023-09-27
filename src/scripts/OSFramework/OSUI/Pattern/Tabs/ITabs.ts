// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Tabs Pattern
	 *
	 * @export
	 * @interface ITabs
	 * @extends {Interface.IParent}
	 */
	export interface ITabs extends Interface.IParent {
		/**
		 * Function that will trigger the change tab method
		 *
		 * @param {number} tabIndex
		 * @param {TabsHeaderItem.ITabsHeaderItem} tabsHeaderItem
		 * @param {boolean} [blockObserver]
		 * @param {boolean} [triggerEvent]
		 * @param {boolean} [triggeredByObserver]
		 */
		changeTab(
			tabIndex: number,
			tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem,
			blockObserver?: boolean,
			triggerEvent?: boolean,
			triggeredByObserver?: boolean
		): void;

		/**
		 * Function that will toggle the gestures on Tabs
		 *
		 * @param {boolean} addDragGestures
		 */
		toggleDragGestures(addDragGestures: boolean): void;
	}
}
