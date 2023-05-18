// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Tabs Pattern
	 */
	export interface ITabs extends Interface.IParent {
		changeTab(
			tabIndex: number,
			tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem,
			blockObserver?: boolean,
			triggerEvent?: boolean,
			triggeredByObserver?: boolean
		): void;
		toggleDragGestures(addDragGestures: boolean): void;
	}
}
