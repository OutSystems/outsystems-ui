// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 *
	 * @export
	 * @class TabsContentItem
	 * @extends {AbstractPattern<TabsContentItemConfig>}
	 * @implements {ITabsContentItem}
	 */
	export class TabsContentItem extends AbstractChild<TabsContentItemConfig, Tabs.ITabs> implements ITabsContentItem {
		// Store the data-tab attribute
		private _dataTab: number;
		// Store if this is the current active item
		private _isActive: boolean;
		// Store this item's tab pattern
		private _tabsElem: Patterns.Tabs.ITabs;

		constructor(uniqueId: string, tabsElem: Patterns.Tabs.ITabs, configs: JSON) {
			super(uniqueId, new TabsContentItemConfig(configs));

			this._tabsElem = tabsElem;
		}

		/**
		 * Method to add this element to the respective Tabs
		 *
		 * @private
		 * @memberof TabsContentItem
		 */
		private _addElementToTabs(): void {
			this._tabsElem.addContentItem(this);
		}

		/**
		 * Method to handle the Accessibility attributes
		 *
		 * @protected
		 * @param {boolean} [isUpdate=true]
		 * @memberof TabsContentItem
		 */
		protected setA11YProperties(isUpdate = true): void {
			if (isUpdate) {
				Helper.A11Y.RoleTabPanel(this._selfElem);
			}

			if (this._isActive) {
				Helper.A11Y.TabIndexTrue(this._selfElem);
				Helper.A11Y.AriaHiddenFalse(this._selfElem);
			} else {
				Helper.A11Y.TabIndexFalse(this._selfElem);
				Helper.A11Y.AriaHiddenTrue(this._selfElem);
			}
		}

		/**
		 * Method to build the pattern
		 *
		 * @memberof TabsContentItem
		 */
		public build(): void {
			super.build();

			this.setParentInfo(
				Constants.Dot + Tabs.Enum.CssClasses.TabsWrapper,
				OutSystems.OSUI.Patterns.TabsAPI.GetTabsById
			);

			this._addElementToTabs();

			this.setA11YProperties(false);

			super.finishBuild();
		}

		/**
		 * Method to remove event listener and destroy TabsContentItem instance
		 *
		 * @memberof TabsContentItem
		 */
		public dispose(): void {
			// Remove this item from the tabs pattern array
			this._tabsElem.removeContentItem(this);

			// Notify parent about this instance will be destroyed
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.Removed);

			super.dispose();
		}

		/**
		 * Method to get the current data-tab attribute, called by the Tabs
		 *
		 * @return {*}  {number}
		 * @memberof TabsContentItem
		 */
		public getDataTab(): number {
			return this._dataTab;
		}

		/**
		 * Method to get the element offsetLeft value, called by the Tabs
		 *
		 * @return {*}  {number}
		 * @memberof TabsContentItem
		 */
		public getOffsetLeft(): number {
			return this._selfElem.offsetLeft;
		}

		/**
		 * Method to set the element as active, called by the tabs
		 *
		 * @memberof TabsContentItem
		 */
		public removeActiveElement(): void {
			if (this._selfElem) {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = false;
				this.setA11YProperties();
			}
		}

		/**
		 * Method to set the element as active, called by the tabs
		 *
		 * @memberof TabsContentItem
		 */
		public setActiveElement(): void {
			if (this._selfElem) {
				Helper.Dom.Styles.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = true;
				this.setA11YProperties();
			}
		}

		/**
		 * Method to set the aria-labbeledby attribute, called by the tabs
		 *
		 * @param {string} headerItemId
		 * @memberof TabsContentItem
		 */
		public setAriaLabelledByAttribute(headerItemId: string): void {
			Helper.A11Y.AriaLabelledBy(this._selfElem, headerItemId);
		}

		/**
		 * Method to set the data-tab attribute, called by the tabs
		 *
		 * @param {number} dataTab
		 * @memberof TabsContentItem
		 */
		public setDataTab(dataTab: number): void {
			Helper.Dom.Attribute.Set(this._selfElem, Tabs.Enum.Attributes.DataTab, dataTab.toString());
			this._dataTab = dataTab;
		}

		/**
		 * Method to set the intersection observer, called by the tabs
		 *
		 * @param {IntersectionObserver} observer
		 * @memberof TabsContentItem
		 */
		public setOnDragObserver(observer: IntersectionObserver): void {
			observer.observe(this._selfElem);
		}

		/**
		 * Method to stop observing this element in the intersection observer, called by the tabs
		 *
		 * @param {IntersectionObserver} observer
		 * @memberof TabsContentItem
		 */
		public unobserveDragObserver(observer: IntersectionObserver): void {
			// disconnect observer when destroyed from DOM
			observer.unobserve(this._selfElem);
		}
	}
}
