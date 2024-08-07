// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.TabsHeaderItem {
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
		private _eventOnTabsClick: GlobalCallbacks.Generic;
		// Store if this is the current active item
		private _isActive = false;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TabsHeaderItemConfig(configs));
		}

		/**
		 * Method to handle the click event
		 *
		 * @private
		 * @memberof TabsHeaderItem
		 */
		private _handleClickEvent(): void {
			if (this._isActive === false) {
				this.notifyParent(Tabs.Enum.ChildNotifyActionType.Click);
			}
		}

		/**
		 * Method to remove the event listeners
		 *
		 * @private
		 * @memberof TabsHeaderItem
		 */
		private _removeEvents(): void {
			this.selfElement.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnTabsClick);
		}

		/**
		 * Method to set the event listeners
		 *
		 * @private
		 * @memberof TabsHeaderItem
		 */
		private _setUpEvents(): void {
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnTabsClick);
		}

		/**
		 * Method to handle the Accessibility attributes
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		protected setA11YProperties(isUpdate = true): void {
			// Static attribute to be added when the item is created
			if (isUpdate === false) {
				Helper.A11Y.RoleTab(this.selfElement);

				// Workaround for VoiceOver support
				if (Helper.DeviceInfo.IsIos || Helper.DeviceInfo.GetOperatingSystem() === GlobalEnum.MobileOS.MacOS) {
					Helper.A11Y.RolePresentation(this.selfElement.parentElement);
				}
			}

			// Dynamic values that need to be changed when toggling the active state
			if (this._isActive) {
				Helper.A11Y.TabIndexTrue(this.selfElement);
				Helper.A11Y.AriaSelectedTrue(this.selfElement);

				// Set the attr that will be used to define the default tabindex element
				Helper.Dom.Attribute.Set(this.selfElement, Constants.FocusableTabIndexDefault, Constants.EmptyString);
			} else {
				Helper.A11Y.TabIndexFalse(this.selfElement);
				Helper.A11Y.AriaSelectedFalse(this.selfElement);

				// Unset the attr that will be used to define the default tabindex element
				Helper.Dom.Attribute.Remove(this.selfElement, Constants.FocusableTabIndexDefault);
			}
		}

		/**
		 * Method to set the callbacks and event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		protected setCallbacks(): void {
			this._eventOnTabsClick = this._handleClickEvent.bind(this);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		protected setHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		protected unsetCallbacks(): void {
			this._eventOnTabsClick = undefined;
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		protected unsetHtmlElements(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to build the TabsHeaderItem
		 *
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
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

			this.finishBuild();
		}

		/**
		 * Method to disable TabHeaderItem
		 *
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public disable(): void {
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.DisabledHeaderItem);
		}

		/**
		 * Method to remove event listener and destroy TabsHeaderItem instance
		 *
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public dispose(): void {
			// Notify parent about this instance will be destroyed
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.RemovedHeaderItem);

			this._removeEvents();

			this.unsetCallbacks();

			super.dispose();
		}

		/**
		 * Method to enable TabHeaderItem
		 *
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public enable(): void {
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.EnabledHeaderItem);
		}

		/**
		 * Method to get the current data-tab value, called by the Tabs
		 *
		 * @return {*}  {number}
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public getDataTab(): number {
			return this._dataTab;
		}

		/**
		 * Method to set the aria-controls attribute, called by the Tabs
		 *
		 * @param {string} contentItemId Element that will receive the aria-controls
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public setAriaControlsAttribute(contentItemId: string): void {
			Helper.A11Y.AriaControls(this.selfElement, contentItemId);
		}

		/**
		 * Method to set the data-tab attribute, called by the Tabs
		 *
		 * @param {number} dataTab Tab that will be the active
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public setDataTab(dataTab: number): void {
			Helper.Dom.Attribute.Set(this.selfElement, Tabs.Enum.Attributes.DataTab, dataTab.toString());
			this._dataTab = dataTab;
		}

		/**
		 * Method to set the focus on this item, called by the Tabs
		 *
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public setFocus(): void {
			this.selfElement.focus();
		}

		/**
		 * Method to set this element as active
		 *
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public setIsActive(): void {
			if (this.selfElement) {
				Helper.Dom.Styles.AddClass(this.selfElement, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = true;
				this.setA11YProperties();
			}
		}

		/**
		 * Method to remove this element as active
		 *
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public unsetIsActive(): void {
			if (this.selfElement) {
				Helper.Dom.Styles.RemoveClass(this.selfElement, Patterns.Tabs.Enum.CssClasses.ActiveTab);
				this._isActive = false;
				this.setA11YProperties();
			}
		}

		/**
		 * Method to update tabs indicator size on HeaderItem onRender
		 *
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public updateOnRender(): void {
			this.notifyParent(Tabs.Enum.ChildNotifyActionType.UpdateIndicator);
		}

		/**
		 * Readable property to get the active state of the element
		 *
		 * @readonly
		 * @type {boolean}
		 * @memberof OSFramework.Patterns.TabsHeaderItem.TabsHeaderItem
		 */
		public get IsActive(): boolean {
			return this._isActive;
		}
	}
}
