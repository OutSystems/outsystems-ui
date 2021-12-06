// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TabsHeaderItem extends AbstractPattern<TabsHeaderItemConfig> implements ITabsHeaderItem {
		// Store the data-tab attribute
		private _dataTab: number;
		// Store the on click event
		private _eventOnTabsClick: Callbacks.Generic;
		// Store if this is the current active item
		private _isActive: boolean;
		// Store this item's tab pattern
		private _tabsElem: Patterns.Tabs.ITabs;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, tabsElem: Patterns.Tabs.ITabs, configs: JSON) {
			super(uniqueId, new TabsHeaderItemConfig(configs));

			this._tabsElem = tabsElem;
			this._eventOnTabsClick = this._handleClickEvent.bind(this);
		}

		// Method to add click event to this headerItem
		private _addEventListener(): void {
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnTabsClick);
		}

		private _handleClickEvent(): void {
			if (this._isActive) {
				return;
			}

			this._tabsElem.changeTab(this._dataTab, this, true, true);
		}

		private _prepareElement(): void {
			this._tabsElem.addTabsHeaderItem(this);
			this._setAccessibilityAttributes();
		}

		private _setAccessibilityAttributes(): void {
			Helper.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Tab
			);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.TabIndex, '-1');
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Selected, false);
		}

		public build(): void {
			super.build();

			this._prepareElement();

			this._addEventListener();

			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();

			// Remove this item from the tabs pattern array
			this._tabsElem.removeTabsHeaderItem(this, this._isActive);

			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnTabsClick);
		}

		public getDataTab(): number {
			return this._dataTab;
		}

		public removeAsActiveElement(): void {
			Helper.Style.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Selected, false);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.TabIndex, '-1');
			this._isActive = false;
		}

		public setAriaControlsAttribute(contentItemId: string): void {
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Controls, contentItemId);
		}

		public setAsActiveElement(): void {
			Helper.Style.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.Aria.Selected, true);
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.TabIndex, '0');
			this._isActive = true;
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
