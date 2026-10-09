// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Tabs Pattern
	 */
	export interface ITabs extends Interface.IParent {
		/**
		 * Function that will trigger the change tab method
		 *
		 * @param tabIndex
		 * @param tabsHeaderItem
		 * @param [blockObserver]
		 * @param [triggerEvent]
		 * @param [triggeredByObserver]
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
		 * @param addDragGestures
		 */
		toggleDragGestures(addDragGestures: boolean): void;
	}
}
