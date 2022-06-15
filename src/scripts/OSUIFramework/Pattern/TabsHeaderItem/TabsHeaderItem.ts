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
	export class TabsHeaderItem extends AbstractChild<TabsHeaderItemConfig, Tabs.ITabs> implements ITabsHeaderItem {
		// Store the data-tab attribute
		private _dataTab: number;
		// Store the on click event
		private _eventOnTabsClick: Callbacks.Generic;
		// Store if this is the current active item
		private _isActive = false;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TabsHeaderItemConfig(configs));
		}

		// Method to handle the click event
		private _handleClickEvent(): void {
			if (this._isActive === false) {
				this.notifyParent(Tabs.Enum.ChildNotifyActionType.Click);
			}
		}

		// Method to remove the event listeners
		private _removeEvents(): void {
			this._selfElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnTabsClick);
		}

		// Method to set the event listeners
		private _setUpEvents(): void {
			this._selfElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnTabsClick);
		}

		// Method to handle the Accessibility attributes
		protected setA11YProperties(isUpdate = true): void {
			// Static attribute to be added when the item is created
			if (isUpdate === false) {
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
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof TabsHeaderItem
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();
			this._eventOnTabsClick = undefined;
		}

		/**
		 * Method to build the pattern
		 *
		 * @memberof TabsHeaderItem
		 */
		public build(): void {
			super.build();

			this.setParentInfo(
				Constants.Dot + Tabs.Enum.CssClasses.TabsWrapper,
				OutSystems.OSUI.Patterns.TabsAPI.GetTabsById
			);

			// Notify parent about a new instance of this child has been created!
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.AddHeaderItem);

			this.setA11YProperties(false);

			this.setCallbacks();

			this._setUpEvents();

			super.finishBuild();
		}

		/**
		 * Method to remove event listener and destroy TabsHeaderItem instance
		 *
		 * @memberof TabsHeaderItem
		 */
		public dispose(): void {
			// Notify parent about this instance will be destroyed
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.RemovedHeaderItem);

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
		 * Method to set the aria-controls attribute, called by the Tabs
		 *
		 * @param {string} contentItemId
		 * @memberof TabsHeaderItem
		 */
		public setAriaControlsAttribute(contentItemId: string): void {
			Helper.A11Y.AriaControls(this._selfElem, contentItemId);
		}

		/**
		 * Method to set the data-tab attribute, called by the Tabs
		 *
		 * @param {number} dataTab
		 * @memberof TabsHeaderItem
		 */
		public setDataTab(dataTab: number): void {
			Helper.Dom.Attribute.Set(this._selfElem, Tabs.Enum.Attributes.DataTab, dataTab.toString());
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

		/**
		 * Method to set this element as active
		 *
		 * @memberof TabsHeaderItem
		 */
		public setIsActive(): void {
			if (this._selfElem) {
				Helper.Dom.Styles.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = true;
				this.setA11YProperties();
			}
		}

		/**
		 * Method to remove this element as active
		 *
		 * @memberof TabsHeaderItem
		 */
		public unsetIsActive(): void {
			if (this._selfElem) {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = false;
				this.setA11YProperties();
			}
		}

		/**
		 * Readable property to get the active state of the element
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof TabsHeaderItem
		 */
		public get IsActive(): boolean {
			return this._isActive;
		}
	}
}
