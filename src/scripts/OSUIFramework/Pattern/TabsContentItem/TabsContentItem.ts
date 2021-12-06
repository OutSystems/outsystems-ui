// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TabsContentItem extends AbstractPattern<TabsContentItemConfig> implements ITabsContentItem {
		// Store the data-tab attribute
		private _dataTab: number;
		// Store if this is the current active item
		private _isActive: boolean;
		// Store this item's tab pattern
		private _tabsElem: Patterns.Tabs.ITabs;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, tabsElem: Patterns.Tabs.ITabs, configs: JSON) {
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
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.TabPanel
			);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.TabIndex, '-1');
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Hidden, true);
		}

		public build(): void {
			super.build();

			this._prepareElement();

			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();

			// Remove this item from the tabs pattern array
			this._tabsElem.removeTabsContentItem(this);
		}

		public getDataTab(): number {
			return this._dataTab;
		}

		public getOffsetLeft(): number {
			return this._selfElem.offsetLeft;
		}

		public removeAsActiveElement(): void {
			Helper.Style.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.TabIndex, '-1');
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Hidden, true);
			this._isActive = false;
		}

		public removeDragObserver(observer: IntersectionObserver): void {
			// disconnect observer when destroyed from DOM
			observer.disconnect();
		}

		public setAriaLabelledByAttribute(headerItemId: string): void {
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Labelledby, headerItemId);
		}

		public setAsActiveElement(): void {
			Helper.Style.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Hidden, false);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.TabIndex, '0');
			this._isActive = true;
		}

		public setDataTab(dataTab: number): void {
			Helper.Attribute.Set(this._selfElem, Tabs.Enum.Attributes.DataTab, dataTab.toString());
			this._dataTab = dataTab;
		}

		public setOnDragObserver(observer: IntersectionObserver): void {
			observer.observe(this._selfElem);
		}
	}
}
