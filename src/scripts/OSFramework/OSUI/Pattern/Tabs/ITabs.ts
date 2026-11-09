// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Tabs Pattern
	 */
	export interface ITabs extends Interface.IParent {
		/**
		 * Function that will trigger the change tab method
		 *
		 * @param tabIndex Zero-based index of the tab to activate
		 * @param tabsHeaderItem Header item of the tab to activate
		 * @param [triggerEvent] True to trigger the OnTabsChange event
		 * @param [triggeredByObserver] True when the change comes from the drag observer
		 */
		changeTab(
			tabIndex: number,
			tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem,
			triggerEvent?: boolean,
			triggeredByObserver?: boolean
		): void;

		/**
		 * Function that will toggle the gestures on Tabs
		 *
		 * @param addDragGestures True to add the drag gestures, false to remove them
		 */
		toggleDragGestures(addDragGestures: boolean): void;
	}
}
