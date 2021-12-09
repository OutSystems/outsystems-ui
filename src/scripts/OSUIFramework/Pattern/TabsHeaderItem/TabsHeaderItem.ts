// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 *
	 * @export
	 * @class TabsHeaderItem
	 * @extends {AbstractPattern<TabsHeaderItemConfig>}
	 * @implements {ITabsHeaderItem}
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
		}

		/**
		 * Method to add this element to the respective Tabs
		 *
		 * @private
		 * @memberof TabsHeaderItem
		 */
		private _addElementToTabs(): void {
			this._tabsElem.addTabsHeaderItem(this);
		}

		/**
		 * Method to handle the click event
		 *
		 * @private
		 * @return {*}  {void}
		 * @memberof TabsHeaderItem
		 */
		private _handleClickEvent(): void {
			if (this._isActive) {
				return;
			}

			this._tabsElem.changeTab(this._dataTab, this, true, true);
		}

		/**
		 * Method to set the Accessibility attributes
		 *
		 * @protected
		 * @param {boolean} [isUpdate=true]
		 * @memberof TabsHeaderItem
		 */
		protected setA11YProperties(isUpdate = true): void {
			// Static attribute to be added when the item is created
			if (!isUpdate) {
				Helper.A11Y.RoleTab(this._selfElem);
			}

			// Dynamic values that need to be changed when toggling the active state
			if (this._isActive) {
				Helper.A11Y.TabIndexTrue(this._selfElem);
				Helper.A11Y.AriaSelectedTrue(this._selfElem);
			} else {
				Helper.A11Y.TabIndexFalse(this._selfElem);
				Helper.A11Y.AriaSelectedFalse(this._selfElem);
			}
		}

		/**
		 * Method to set the callbacks and event listeners
		 *
		 * @protected
		 * @memberof TabsHeaderItem
		 */
		protected setCallbacks(): void {
			this._eventOnTabsClick = this._handleClickEvent.bind(this);
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnTabsClick);
		}

		/**
		 * Method to remove the callbacks and event listeners
		 *
		 * @protected
		 * @memberof TabsHeaderItem
		 */
		protected unsetCallbacks(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnTabsClick);
			this._eventOnTabsClick = undefined;
		}

		/**
		 * Method to build the pattern
		 *
		 * @memberof TabsHeaderItem
		 */
		public build(): void {
			super.build();

			this._addElementToTabs();

			this.setA11YProperties(false);

			this.setCallbacks();

			super.finishBuild();
		}

		/**
		 * Method to remove event listener and destroy TabsHeaderItem instance
		 *
		 * @memberof TabsHeaderItem
		 */
		public dispose(): void {
			// Remove this item from the tabs pattern array
			this._tabsElem.removeTabsHeaderItem(this, this._isActive);

			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Method to get the current data-tab value, called by the Tabs
		 *
		 * @return {*}  {number}
		 * @memberof TabsHeaderItem
		 */
		public getDataTab(): number {
			return this._dataTab;
		}

		/**
		 * Method to remove this element as active
		 *
		 * @memberof TabsHeaderItem
		 */
		public removeAsActiveElement(): void {
			if (this._selfElem) {
				Helper.Style.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = false;
				this.setA11YProperties();
			}
		}

		/**
		 * Method to set the aria-controls attribute, called by the Tabs
		 *
		 * @param {string} contentItemId
		 * @memberof TabsHeaderItem
		 */
		public setAriaControlsAttribute(contentItemId: string): void {
			Helper.A11Y.AriaControls(this._selfElem, contentItemId);
		}

		/**
		 * Method to set this element as active
		 *
		 * @memberof TabsHeaderItem
		 */
		public setAsActiveElement(): void {
			if (this._selfElem) {
				Helper.Style.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = true;
				this.setA11YProperties();
			}
		}

		/**
		 * Method to set the data-tab attribute, called by the Tabs
		 *
		 * @param {number} dataTab
		 * @memberof TabsHeaderItem
		 */
		public setDataTab(dataTab: number): void {
			Helper.Attribute.Set(this._selfElem, Tabs.Enum.Attributes.DataTab, dataTab.toString());
			this._dataTab = dataTab;
		}

		/**
		 * Method to set the focus on this item, called by the Tabs
		 *
		 * @memberof TabsHeaderItem
		 */
		public setFocus(): void {
			this._selfElem.focus();
		}
	}
}
