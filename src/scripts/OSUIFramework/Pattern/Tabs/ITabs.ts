// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Tabs Pattern
	 */
	export interface ITabs extends Interface.IPattern, Interface.ICallback {
		addContentItem(tabsContentItem: TabsContentItem.ITabsContentItem);
		addHeaderItem(tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem);
		changeTab(
			tabIndex: number,
			tabsHeaderItem: Patterns.TabsHeaderItem.ITabsHeaderItem,
			triggerEvent?: boolean,
			blockObserver?: boolean
		);
		removeContentItem(tabsContentItem: TabsContentItem.ITabsContentItem);
		removeHeaderItem(tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem, isActiveItem?: boolean);
		toggleDragGestures(addDragGestures: boolean);
	}
}
