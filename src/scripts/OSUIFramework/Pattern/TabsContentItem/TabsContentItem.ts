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

		private _prepareElement(): void {
			Helper.Attribute.Set(this._selfElem, Tabs.Enum.Attributes.DataTab, this._dataTab.toString());
			this._setAccessibilityAttributes();
		}

		private _setAccessibilityAttributes(): void {
			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.TabPanel
			);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, '-1');
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Hidden, true);
		}

		public build(): void {
			super.build();

			this._prepareElement();

			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();

			this._tabsElem.removeTabsContentItem(this.uniqueId, this);
		}
	}
}
