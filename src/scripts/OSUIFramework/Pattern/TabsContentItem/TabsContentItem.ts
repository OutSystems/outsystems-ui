// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TabsContentItem extends AbstractPattern<TabsContentItemConfig> implements ITabsContentItem {
		private _dataTab: number;
		private _tabsElem: Patterns.Tabs.ITabs;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any, tabsElem: Patterns.Tabs.ITabs) {
			super(uniqueId, new TabsContentItemConfig(configs));

			this._tabsElem = tabsElem;
			this._dataTab = this._tabsElem.addTabsContentItem(this.uniqueId, this);
		}

		public build(): void {
			super.build();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
		}
	}
}
