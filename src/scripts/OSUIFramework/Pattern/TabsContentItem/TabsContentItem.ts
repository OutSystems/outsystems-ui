// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TabsContentItem extends AbstractPattern<TabsContentItemConfig> implements ITabsContentItem {
		private _dataTab: number;
		private _isActive: boolean;
		private _tabsElem: Patterns.Tabs.ITabs;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, tabsElem: Patterns.Tabs.ITabs, configs: any) {
			super(uniqueId, new TabsContentItemConfig(configs));

			this._tabsElem = tabsElem;
		}

		private _prepareElement(): void {
			this._tabsElem.addTabsContentItem(this);
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

			this._tabsElem.removeTabsContentItem(this);
		}

		public getOffsetLeft(): number {
			return this._selfElem.offsetLeft;
		}

		public removeAsActiveElement(): void {
			Helper.Style.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, '-1');
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Hidden, true);
			this._isActive = false;
		}

		public setAriaLabelledByAttribute(headerItemId: string): void {
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Labelledby, headerItemId);
		}

		public setAsActiveElement(): void {
			Helper.Style.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Hidden, false);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, '0');
			this._isActive = true;
		}

		public setDataTab(dataTab: number): void {
			Helper.Attribute.Set(this._selfElem, Tabs.Enum.Attributes.DataTab, dataTab.toString());
			this._dataTab = dataTab;
		}
	}
}
