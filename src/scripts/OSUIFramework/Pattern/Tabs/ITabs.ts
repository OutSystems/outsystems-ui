// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Tabs Pattern
	 */
	export interface ITabs extends Interface.IParent, Interface.ICallback {
		changeTab(tabIndex: number, tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem, blockObserver?: boolean);
		toggleDragGestures(addDragGestures: boolean);
	}
}
