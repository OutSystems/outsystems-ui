// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tabs extends AbstractPattern<TabsConfig> implements ITabs {
		private _activeTabContentElement: HTMLElement;
		private _activeTabHeaderElement: HTMLElement;
		private _blockOnRender: boolean;
		private _currentTabIndex: number;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnHeaderKeypress: any;
		// Store the click event with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnTabsClick: any;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		private _onDisableRender: OSUIFramework.Callbacks.Generic;
		private _onTabsChange: Callbacks.OSTabsOnChangeEvent;
		private _tabsContentElement: HTMLElement;
		// Stores the content items of this specific Tabs
		private _tabsContentItemsElements: NodeList;
		private _tabsHeaderElement: HTMLElement;
		private _tabsHeaderItemsElements: NodeList;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TabsConfig(configs));

			this._eventOnHeaderKeypress = this._handleKeypressEvent.bind(this);
			this._eventOnTabsClick = this._handleClickEvent.bind(this);
			// Bind this to the async callback
			this._onDisableRender = this._disableBlockRender.bind(this);
		}

		// Method to toggle the blockRender status
		private _disableBlockRender(): void {
			this._blockOnRender = false;
		}

		private _getTabsContentItems(): NodeList {
			this._tabsContentItemsElements = Array.prototype.filter.call(
				this._selfElem.querySelectorAll(Constants.Dot + Enum.CssClasses.TabsContentItem),
				(el) => {
					return el.closest(Constants.Dot + Enum.CssClasses.Tabs) === this._selfElem;
				}
			);
			return this._tabsContentItemsElements;
		}

		private _getTabsHeaderItems(): NodeList {
			this._tabsHeaderItemsElements = Array.prototype.filter.call(
				this._selfElem.querySelectorAll(Constants.Dot + Enum.CssClasses.TabsHeaderItem),
				(el) => {
					return el.closest(Constants.Dot + Enum.CssClasses.Tabs) === this._selfElem;
				}
			);
			return this._tabsHeaderItemsElements;
		}

		private _handleClickEvent(e): void {
			const currentTarget = e.currentTarget;

			this._activeTabHeaderElement = this._selfElem.querySelector(
				Constants.Dot + Enum.CssClasses.ActiveTab
			) as HTMLElement;

			if (this._activeTabHeaderElement === currentTarget) {
				return;
			}

			const currentTabIndex = parseInt(Helper.Attribute.Get(currentTarget, Enum.Attributes.DataTab));

			this.changeTab(currentTabIndex, true);
		}

		private _handleKeypressEvent(e): void {
			let targetHeaderItemIndex;

			switch (e.key) {
				case GlobalEnum.Keycodes.ArrowRight:
					targetHeaderItemIndex = this._configs.ActiveTab + 1;
					this.changeTab(targetHeaderItemIndex, true);
					break;
				case GlobalEnum.Keycodes.ArrowLeft:
					targetHeaderItemIndex = this._configs.ActiveTab - 1;
					this.changeTab(targetHeaderItemIndex, true);
					break;
			}

			const targetHeaderItem = this._tabsHeaderItemsElements[targetHeaderItemIndex] as HTMLElement;

			if (targetHeaderItem) {
				targetHeaderItem.focus();
			}
		}

		private _handleScrollEvent(e): void {
			const width = this._tabsContentElement.clientWidth;
			const selection_index = Math.round(e.currentTarget.scrollLeft / width);

			console.log(e.currentTarget.scrollLeft);

			const newHeaderItem = this._tabsHeaderItemsElements[selection_index] as HTMLElement;
			const newContentItem = this._tabsContentItemsElements[selection_index] as HTMLElement;
			this._toggleActiveClasses(newHeaderItem, newContentItem);
		}

		private _prepareElements(): void {
			this._getTabsHeaderItems();
			this._getTabsContentItems();

			Helper.Attribute.Set(
				this._tabsHeaderElement,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.TabList
			);

			this._tabsHeaderElement.addEventListener('keydown', this._eventOnHeaderKeypress);

			this._setTabsConnection();
		}

		private _removeEventListeners(): void {
			// remove click events
			this._tabsHeaderItemsElements.forEach((headerItem) =>
				headerItem.removeEventListener('click', this._eventOnTabsClick)
			);

			this._tabsHeaderElement.removeEventListener('keydown', this._eventOnHeaderKeypress);
		}

		private _setContentAccessibilityAttributes(contentItem: HTMLElement, currentHeaderItemId: string): void {
			Helper.Attribute.Set(
				contentItem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.TabPanel
			);
			Helper.Attribute.Set(contentItem, Constants.AccessibilityAttribute.TabIndex, '-1');
			Helper.Attribute.Set(contentItem, Constants.AccessibilityAttribute.Aria.Hidden, true);
			Helper.Attribute.Set(contentItem, Constants.AccessibilityAttribute.Aria.Labelledby, currentHeaderItemId);
		}

		private _setHeaderAccessibilityAttributes(headerItem: HTMLElement, currentContentItemId: string): void {
			Helper.Attribute.Set(
				headerItem,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.Tab
			);
			Helper.Attribute.Set(headerItem, Constants.AccessibilityAttribute.TabIndex, '-1');
			Helper.Attribute.Set(headerItem, Constants.AccessibilityAttribute.Aria.Selected, false);
			Helper.Attribute.Set(headerItem, Constants.AccessibilityAttribute.Aria.Controls, currentContentItemId);
		}

		private _setHeaderItemOnClickEvent(elem: HTMLElement): void {
			elem.addEventListener('click', this._eventOnTabsClick);
		}

		private _setHtmlElements(): void {
			this._tabsHeaderElement = this._selfElem.querySelector(Constants.Dot + Enum.CssClasses.TabsHeader);
			this._tabsContentElement = this._selfElem.querySelector(Constants.Dot + Enum.CssClasses.TabsContent);
		}

		private _setInitialOptions(): void {
			this.setTabsOrientation(this.configs.Orientation);
			this.setTabsPosition(this._configs.Position);
			this.setTabsHeight(this._configs.Height);
			this.setTabsIsJustified(this._configs.IsJustified);
			this.changeTab(this.configs.ActiveTab, false);
		}

		private _setTabsConnection(): void {
			let tabNumber = 0;

			while (tabNumber < this._tabsHeaderItemsElements.length) {
				const currentHeaderItem = this._tabsHeaderItemsElements[tabNumber] as HTMLElement;
				const currentHeaderItemId = Helper.Attribute.Get(currentHeaderItem.parentNode as HTMLElement, 'id');
				const currentContentItem = this._tabsContentItemsElements[tabNumber] as HTMLElement;
				const currentContentItemId = Helper.Attribute.Get(currentContentItem.parentNode as HTMLElement, 'id');

				if (currentHeaderItem !== undefined) {
					Helper.Attribute.Set(currentHeaderItem, Enum.Attributes.DataTab, tabNumber.toString());
					this._setHeaderAccessibilityAttributes(currentHeaderItem, currentContentItemId);
					this._setHeaderItemOnClickEvent(currentHeaderItem);
				}

				if (currentContentItem !== undefined) {
					Helper.Attribute.Set(currentContentItem, Enum.Attributes.DataTab, tabNumber.toString());
					this._setContentAccessibilityAttributes(currentContentItem, currentHeaderItemId);
				}

				tabNumber++;
			}
		}

		private _toggleActiveClasses(newActiveHeader: HTMLElement, newActiveContent: HTMLElement): void {
			if (this._activeTabHeaderElement) {
				Helper.Style.RemoveClass(this._activeTabHeaderElement, Enum.CssClasses.ActiveTab);
			}

			if (this._activeTabContentElement) {
				Helper.Style.RemoveClass(this._activeTabContentElement, Enum.CssClasses.ActiveTab);
			}

			Helper.Style.AddClass(newActiveHeader, Enum.CssClasses.ActiveTab);
			Helper.Style.AddClass(newActiveContent, Enum.CssClasses.ActiveTab);
		}

		private _toggleContentItemsAccessibilityAttributes(newActiveContent: HTMLElement): void {
			if (this._activeTabContentElement) {
				Helper.Attribute.Set(this._activeTabContentElement, Constants.AccessibilityAttribute.TabIndex, '-1');
				Helper.Attribute.Set(this._activeTabContentElement, Constants.AccessibilityAttribute.Aria.Hidden, true);
			}
			Helper.Attribute.Set(newActiveContent, Constants.AccessibilityAttribute.Aria.Hidden, false);
			Helper.Attribute.Set(newActiveContent, Constants.AccessibilityAttribute.TabIndex, '0');
		}

		private _toggleHeaderItemsAccessibilityAttributes(newActiveHeader: HTMLElement): void {
			if (this._activeTabHeaderElement) {
				Helper.Attribute.Set(
					this._activeTabHeaderElement,
					Constants.AccessibilityAttribute.Aria.Selected,
					false
				);
				Helper.Attribute.Set(this._activeTabHeaderElement, Constants.AccessibilityAttribute.TabIndex, '-1');
			}
			Helper.Attribute.Set(newActiveHeader, Constants.AccessibilityAttribute.Aria.Selected, true);
			Helper.Attribute.Set(newActiveHeader, Constants.AccessibilityAttribute.TabIndex, '0');
		}

		// Method that triggers the OnTabsChange event
		private _triggerOnChangeEvent(activeTab: number): void {
			if (this._onTabsChange !== undefined) {
				Helper.AsyncInvocation(this._onTabsChange, this.widgetId, activeTab);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._prepareElements();

			this._setInitialOptions();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			this._blockOnRender = true;
			// Check which property changed and call respective method to update it
			switch (propertyName) {
				case Enum.Properties.ActiveTab:
					this.changeTab(propertyValue, true);
					break;
				case Enum.Properties.Height:
					this.setTabsHeight(propertyValue);
					break;
				case Enum.Properties.Orientation:
					this.setTabsOrientation(propertyValue);
					break;
				case Enum.Properties.Position:
					this.setTabsPosition(propertyValue);
					break;
				case Enum.Properties.IsJustified:
					this.setTabsIsJustified(propertyValue);
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
			Helper.AsyncInvocation(this._onDisableRender, this.widgetId);
		}

		public changeTab(tabIndex: number, triggerEvent?: boolean): void {
			this._blockOnRender = true;
			let newTabIndex;

			if (this._tabsHeaderItemsElements[tabIndex] as HTMLElement) {
				newTabIndex = tabIndex;
			} else if (this._tabsHeaderItemsElements[this._configs.ActiveTab] as HTMLElement) {
				newTabIndex = this._configs.ActiveTab;
			} else {
				newTabIndex = 0;
			}

			const newHeaderItem = this._tabsHeaderItemsElements[newTabIndex] as HTMLElement;

			if (newHeaderItem === undefined) {
				this._blockOnRender = false;
				return;
			}

			const newContentItem = (this._tabsContentItemsElements[newTabIndex] as HTMLElement)
				? (this._tabsContentItemsElements[newTabIndex] as HTMLElement)
				: (this._tabsContentItemsElements[0] as HTMLElement);

			this._tabsContentElement.scrollTo({
				top: 0,
				left: newContentItem.offsetLeft,
				behavior: Enum.OnChangeBehavior.Instant,
			});

			this._toggleActiveClasses(newHeaderItem, newContentItem);

			this._toggleHeaderItemsAccessibilityAttributes(newHeaderItem);
			this._toggleContentItemsAccessibilityAttributes(newContentItem);

			this._activeTabHeaderElement = newHeaderItem;
			this._activeTabContentElement = newContentItem;
			this._configs.ActiveTab = newTabIndex;

			if (triggerEvent) {
				this._triggerOnChangeEvent(newTabIndex);
			}

			Helper.AsyncInvocation(this._onDisableRender, this.widgetId);
		}

		// Destroy the Tabs pattern
		public dispose(): void {
			// call super method, which deletes this tabs class instance from the TabsMap
			super.dispose();
			this._removeEventListeners();
		}

		// Set callbacks for the onTabsChange event
		public registerCallback(callback: Callbacks.OSTabsOnChangeEvent): void {
			this._onTabsChange = callback;
		}

		public setTabsHeight(height: string): void {
			Helper.Style.SetStyleAttribute(this._selfElem, Enum.Attributes.TabsHeight, height);
			this.configs.Height = height;
		}

		public setTabsIsJustified(isJustified: boolean): void {
			if (isJustified) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClasses.IsJustified);
			} else {
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClasses.IsJustified);
			}

			this._configs.IsJustified = isJustified;
		}

		public setTabsOrientation(orientation: GlobalTypes.Orientation): void {
			Helper.Style.RemoveClass(this._selfElem, Enum.CssClasses.Modifier + this._configs.Orientation);
			Helper.Attribute.Set(this._selfElem, Enum.Attributes.DataOrientation, orientation.toString());
			Helper.Style.AddClass(this._selfElem, Enum.CssClasses.Modifier + orientation);

			this._configs.Orientation = orientation;
		}

		public setTabsPosition(position: GlobalTypes.Direction): void {
			Helper.Style.RemoveClass(this._selfElem, Enum.CssClasses.Modifier + this._configs.Position);
			Helper.Attribute.Set(this._selfElem, Enum.Attributes.DataPosition, position.toString());
			Helper.Style.AddClass(this._selfElem, Enum.CssClasses.Modifier + position);

			this._configs.Position = position;
		}

		public updateOnRender(): void {
			if (!this._blockOnRender) {
				this._removeEventListeners();
				this._prepareElements();
				if (this._currentTabIndex === undefined && this.configs.ActiveTab !== undefined) {
					this.changeTab(this.configs.ActiveTab, false);
				}
			}
		}
	}
}
