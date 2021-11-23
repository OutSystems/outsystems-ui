// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TabsHeaderItem extends AbstractPattern<TabsHeaderItemConfig> implements ITabsHeaderItem {
		private _dataTab: number;
		private _eventOnTabsClick: Callbacks.Generic;
		private _tabContentItem: HTMLElement;
		private _tabsElem: Patterns.Tabs.ITabs;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any, tabsElem: Patterns.Tabs.ITabs) {
			super(uniqueId, new TabsHeaderItemConfig(configs));

			this._tabsElem = tabsElem;
			this._eventOnTabsClick = this._handleClickEvent.bind(this);
		}

		private _addEventListener(): void {
			this._selfElem.addEventListener('click', this._eventOnTabsClick);
		}

		private _handleClickEvent(): void {
			if (Helper.Style.ContainsClass(this._selfElem, Tabs.Enum.CssClasses.ActiveTab)) {
				return;
			}

			this._tabsElem.changeTab(this._dataTab, this, true);
		}

		private _prepareElement(): void {
			//this.setDataTab(this._dataTab);
			this._tabsElem.addTabsHeaderItem(this.uniqueId, this);
			this._setAccessibilityAttributes();
		}

		private _setAccessibilityAttributes(): void {
			Helper.Attribute.Set(
				this._selfElem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.Tab
			);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, '-1');
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Selected, false);
		}

		public build(): void {
			super.build();

			this._prepareElement();

			this._addEventListener();

			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();

			this._tabsElem.removeTabsHeaderItem(this.uniqueId, this);

			this._selfElem.removeEventListener('click', this._eventOnTabsClick);
		}

		public removeAsActiveElement(): void {
			Helper.Style.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Selected, false);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, '-1');
		}

		public setAriaControlsAttribute(contentItemId: string): void {
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Controls, contentItemId);
		}

		public setAsActiveElement(): void {
			Helper.Style.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.Aria.Selected, true);
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, '0');
		}

		public setDataTab(dataTab: number): void {
			Helper.Attribute.Set(this._selfElem, Tabs.Enum.Attributes.DataTab, dataTab.toString());
			this._dataTab = dataTab;
		}

		public setFocus(): void {
			this._selfElem.focus();
		}
	}
}
