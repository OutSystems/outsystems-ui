// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tabs extends AbstractPattern<TabsConfig> implements ITabs {
		private _activeTabContentElement: Patterns.TabsContentItem.ITabsContentItem;
		private _activeTabHeaderElement: Patterns.TabsHeaderItem.ITabsHeaderItem;
		private _blockOnRender: boolean;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnHeaderKeypress: any;
		// Store the click event with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		private _onDisableRender: OSUIFramework.Callbacks.Generic;
		private _onTabsChange: Callbacks.OSTabsOnChangeEvent;
		private _scrollBehavior: Enum.ScrollBehavior;
		private _tabsContentElement: HTMLElement;
		private _tabsContentItemsElementsArray: Patterns.TabsContentItem.ITabsContentItem[];
		private _tabsHeaderElement: HTMLElement;
		private _tabsHeaderItemsElementsArray: Patterns.TabsHeaderItem.ITabsHeaderItem[];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TabsConfig(configs));

			this._eventOnHeaderKeypress = this._handleKeypressEvent.bind(this);
			// Bind this to the async callback
			this._onDisableRender = this._disableBlockRender.bind(this);
			this._tabsHeaderItemsElementsArray = [];
			this._tabsContentItemsElementsArray = [];
		}

		// Method to toggle the blockRender status
		private _disableBlockRender(): void {
			this._blockOnRender = false;
		}

		private _handleKeypressEvent(e): void {
			let targetHeaderItemIndex;

			switch (e.key) {
				case GlobalEnum.Keycodes.ArrowRight:
					targetHeaderItemIndex = this._configs.ActiveTab + 1;
					this.changeTab(targetHeaderItemIndex, undefined, true);
					break;
				case GlobalEnum.Keycodes.ArrowLeft:
					targetHeaderItemIndex = this._configs.ActiveTab - 1;
					this.changeTab(targetHeaderItemIndex, undefined, true);
					break;
			}

			const targetHeaderItem = this._tabsHeaderItemsElementsArray[targetHeaderItemIndex];

			if (targetHeaderItem) {
				targetHeaderItem.setFocus();
			}
		}

		private _prepareHeaderElement(): void {
			Helper.Attribute.Set(
				this._tabsHeaderElement,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.TabList
			);

			this._tabsHeaderElement.addEventListener('keydown', this._eventOnHeaderKeypress);
		}

		private _removeEventListeners(): void {
			this._tabsHeaderElement.removeEventListener('keydown', this._eventOnHeaderKeypress);
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
			this.setScrollBehavior(this._configs.DisableAnimation);
			this._activeTabHeaderElement = this._tabsHeaderItemsElementsArray[this._configs.ActiveTab];
			this._activeTabContentElement = this._tabsContentItemsElementsArray[this._configs.ActiveTab];
			this.changeTab(this.configs.ActiveTab, undefined, false);
		}

		// Method that triggers the OnTabsChange event
		private _triggerOnChangeEvent(activeTab: number): void {
			if (this._onTabsChange !== undefined) {
				Helper.AsyncInvocation(this._onTabsChange, this.widgetId, activeTab);
			}
		}

		private _updateTabsConnection(): void {
			this._tabsHeaderItemsElementsArray.forEach((item, index) => {
				const currentContentItem = this._tabsContentItemsElementsArray[index];

				item.setAriaControlsAttribute(currentContentItem.widgetId);
				item.setDataTab(index);

				currentContentItem.setAriaLabelledByAttribute(item.widgetId);
				currentContentItem.setDataTab(index);
			});
		}

		public addTabsContentItem(uniqueId: string, tabsContentItem: TabsContentItem.ITabsContentItem): void {
			this._tabsContentItemsElementsArray.push(tabsContentItem);

			if (this._activeTabContentElement === undefined && this.isBuilt) {
				this._activeTabContentElement = this._tabsContentItemsElementsArray[this._configs.ActiveTab];
			}

			if (this.isBuilt) {
				Helper.AsyncInvocation(this._updateTabsConnection.bind(this));
			} else {
				tabsContentItem.setDataTab(this._tabsContentItemsElementsArray.length - 1);
			}
		}

		public addTabsHeaderItem(uniqueId: string, tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem): void {
			this._tabsHeaderItemsElementsArray.push(tabsHeaderItem);

			if (this._activeTabHeaderElement === undefined && this.isBuilt) {
				this._activeTabHeaderElement = this._tabsHeaderItemsElementsArray[this._configs.ActiveTab];
			}

			if (this.isBuilt) {
				Helper.AsyncInvocation(this._updateTabsConnection.bind(this));
			} else {
				tabsHeaderItem.setDataTab(this._tabsHeaderItemsElementsArray.length - 1);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._prepareHeaderElement();

			this._setInitialOptions();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			this._blockOnRender = true;
			// Check which property changed and call respective method to update it
			switch (propertyName) {
				case Enum.Properties.ActiveTab:
					this.changeTab(propertyValue, undefined, true);
					break;
				case Enum.Properties.DisableAnimation:
					this.setScrollBehavior(propertyValue);
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

		public changeTab(
			tabIndex: number,
			tabsHeaderItem?: Patterns.TabsHeaderItem.ITabsHeaderItem,
			triggerEvent?: boolean
		): void {
			this._blockOnRender = true;
			let newTabIndex;

			if (this._activeTabHeaderElement === tabsHeaderItem) {
				return;
			}

			if (this._tabsHeaderItemsElementsArray[tabIndex]) {
				newTabIndex = tabIndex;
			} else if (this._tabsHeaderItemsElementsArray[this._configs.ActiveTab]) {
				newTabIndex = this._configs.ActiveTab;
			} else {
				newTabIndex = 0;
			}

			const newHeaderItem = this._tabsHeaderItemsElementsArray[newTabIndex];

			// if (newHeaderItem === undefined) {
			// 	this._blockOnRender = false;
			// 	return;
			// }

			const newContentItem = this._tabsContentItemsElementsArray[newTabIndex];
			const targetOffeset = newContentItem.getOffsetLeft();

			this._tabsContentElement.scrollTo({
				top: 0,
				left: targetOffeset,
				behavior: this._scrollBehavior,
			});

			this._activeTabHeaderElement.removeAsActiveElement();
			newHeaderItem.setAsActiveElement();

			this._activeTabContentElement.removeAsActiveElement();
			newContentItem.setAsActiveElement();

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

		public removeTabsContentItem(uniqueId: string, tabsContentItem: TabsContentItem.ITabsContentItem): void {
			const currentIndex = this._tabsContentItemsElementsArray.indexOf(tabsContentItem);
			this._tabsContentItemsElementsArray.splice(currentIndex, 1);
		}

		public removeTabsHeaderItem(uniqueId: string, tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem): void {
			const currentIndex = this._tabsHeaderItemsElementsArray.indexOf(tabsHeaderItem);
			this._tabsHeaderItemsElementsArray.splice(currentIndex, 1);
		}

		public setScrollBehavior(disableAnimation: boolean): void {
			this._scrollBehavior = disableAnimation ? Enum.ScrollBehavior.Instant : Enum.ScrollBehavior.Smooth;
			this._configs.DisableAnimation = disableAnimation;
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
			// if (!this._blockOnRender) {
			// 	let needsUpdate = false;
			// 	this._tabsHeaderItemsElementsArray.forEach((item) => {
			// 		const hasDataTab = Helper.Attribute.Get(item, Enum.Attributes.DataTab);
			// 		if (!hasDataTab) {
			// 			needsUpdate = true;
			// 			return;
			// 		}
			// 	});
			// 	if (!needsUpdate) {
			// 		this._tabsContentItemsElementsArray.forEach((item) => {
			// 			const hasDataTab = Helper.Attribute.Get(item, Enum.Attributes.DataTab);
			// 			if (!hasDataTab) {
			// 				needsUpdate = true;
			// 				return;
			// 			}
			// 		});
			// 	}
			// 	if (needsUpdate) {
			// 		this._updateTabsConnection();
			// 	}
			// 	if (this._currentTabIndex === undefined && this.configs.ActiveTab !== undefined) {
			// 		this.changeTab(this.configs.ActiveTab, false);
			// 	}
			// }
		}
	}
}
