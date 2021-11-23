// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Tabs Pattern
	 */
	export interface ITabs extends Interface.IPattern, Interface.ICallback {
		addTabsContentItem(tabsContentItem: TabsContentItem.ITabsContentItem);
		addTabsHeaderItem(tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem);
		changeTab(tabIndex: number, tabsHeaderItem: Patterns.TabsHeaderItem.ITabsHeaderItem, triggerEvent?: boolean);
		removeTabsContentItem(uniqueId: string, tabsContentItem: TabsContentItem.ITabsContentItem);
		removeTabsHeaderItem(uniqueId: string, tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem);
	}
}
