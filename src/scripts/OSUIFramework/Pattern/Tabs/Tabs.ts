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
		// Store the click event with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnTabsClick: any;
		private _onTabsChange: Callbacks.OSTabsOnChangeEvent;
		private _tabsContent: HTMLElement;
		// Stores the content items of this specific Tabs
		private _tabsContentItems: NodeList;
		private _tabsHeader: HTMLElement;
		private _tabsHeaderItems: NodeList;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TabsConfig(configs));

			this._eventOnTabsClick = this._handleClickEvent.bind(this);
		}

		private _getTabsContentItems(): NodeList {
			this._tabsContentItems = Array.prototype.filter.call(
				this._selfElem.querySelectorAll(Constants.Dot + Enum.CssClasses.TabsContentItem),
				(el) => {
					return el.closest(Constants.Dot + Enum.CssClasses.Tabs) === this._selfElem;
				}
			);
			return this._tabsContentItems;
		}

		private _getTabsHeaderItems(): NodeList {
			this._tabsHeaderItems = Array.prototype.filter.call(
				this._selfElem.querySelectorAll(Constants.Dot + Enum.CssClasses.TabsHeaderItem),
				(el) => {
					return el.closest(Constants.Dot + Enum.CssClasses.Tabs) === this._selfElem;
				}
			);
			return this._tabsHeaderItems;
		}

		private _handleClickEvent({ currentTarget }): void {
			this._activeTabHeaderElement = this._selfElem.querySelector(
				Constants.Dot + Enum.CssClasses.ActiveTab
			) as HTMLElement;

			if (this._activeTabHeaderElement === currentTarget) {
				return;
			}

			const currentTabIndex = parseInt(Helper.Attribute.Get(currentTarget, Enum.Attributes.DataTab));

			this.changeTab(currentTabIndex, true);
		}

		private _handleScrollEvent(e): void {
			const width = this._tabsContent.clientWidth;
			const selection_index = Math.round(e.currentTarget.scrollLeft / width);

			console.log(e.currentTarget.scrollLeft);

			const newHeaderItem = this._tabsHeaderItems[selection_index] as HTMLElement;
			const newContentItem = this._tabsContentItems[selection_index] as HTMLElement;
			this._toggleActiveClasses(newHeaderItem, newContentItem);
		}

		private _prepareElements(): void {
			this._getTabsHeaderItems();
			this._getTabsContentItems();
			this._setTabsConnection();
			this.setTabsOrientation(this.configs.Orientation);
			this.setTabsPosition(this._configs.Position);
			this.setTabsHeight(this._configs.Height);
			this.setTabsIsJustified(this._configs.IsJustified);
			this.changeTab(this.configs.ActiveTab, false);
			this._setEventListeners();
		}

		private _setEventListeners(): void {
			this._tabsHeaderItems.forEach((node) => node.addEventListener('click', this._eventOnTabsClick));
			this._tabsContent.addEventListener('touchend', (e) => {
				this._handleScrollEvent(e);
			});
		}

		private _setHtmlElements(): void {
			this._tabsHeader = this._selfElem.querySelector(Constants.Dot + Enum.CssClasses.TabsHeader);
			this._tabsContent = this._selfElem.querySelector(Constants.Dot + Enum.CssClasses.TabsContent);
		}

		private _setTabsConnection(): void {
			let tabNumber = 0;

			for (tabNumber; tabNumber < this._tabsHeaderItems.length; tabNumber++) {
				const currentHeaderItem = this._tabsHeaderItems[tabNumber] as HTMLElement;
				const currentContentItem = this._tabsContentItems[tabNumber] as HTMLElement;

				Helper.Attribute.Set(currentHeaderItem, Enum.Attributes.DataTab, tabNumber.toString());

				if (currentContentItem !== undefined) {
					Helper.Attribute.Set(currentContentItem, Enum.Attributes.DataTab, tabNumber.toString());
				}
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

			this._activeTabHeaderElement = newActiveHeader;
			this._activeTabContentElement = newActiveContent;
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

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
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
		}

		public changeTab(tabIndex: number, triggerEvent?: boolean): void {
			this._blockOnRender = true;
			const newHeaderItem = this._tabsHeaderItems[tabIndex] as HTMLElement;

			if (newHeaderItem === undefined) {
				this._blockOnRender = false;
				return;
			}

			const newContentItem = (this._tabsContentItems[tabIndex] as HTMLElement)
				? (this._tabsContentItems[tabIndex] as HTMLElement)
				: (this._tabsContentItems[0] as HTMLElement);

			this._tabsContent.scrollTo({
				top: 0,
				left: newContentItem.offsetLeft,
				behavior: Enum.OnChangeBehavior.Instant,
			});

			this._toggleActiveClasses(newHeaderItem, newContentItem);

			this._configs.ActiveTab = tabIndex;

			if (triggerEvent) {
				this._triggerOnChangeEvent(tabIndex);
			}

			setTimeout(() => {
				this._blockOnRender = false;
			}, 0);
		}

		// Destroy the Tabs pattern
		public dispose(): void {
			// call super method, which deletes this tabs class instance from the TabsMap
			super.dispose();
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
			Helper.Style.RemoveClass(this._selfElem, 'is--' + this._configs.Orientation);
			Helper.Attribute.Set(this._selfElem, Enum.Attributes.DataOrientation, orientation.toString());
			Helper.Style.AddClass(this._selfElem, 'is--' + orientation);

			this._configs.Orientation = orientation;
		}

		public setTabsPosition(position: GlobalTypes.Direction): void {
			Helper.Style.RemoveClass(this._selfElem, 'is--' + this._configs.Position);
			Helper.Attribute.Set(this._selfElem, Enum.Attributes.DataPosition, position.toString());
			Helper.Style.AddClass(this._selfElem, 'is--' + position);

			this._configs.Position = position;
		}

		public updateOnRender(): void {
			if (!this._blockOnRender) {
				if (this._currentTabIndex === undefined && this.configs.ActiveTab !== undefined) {
					this.changeTab(this.configs.ActiveTab, false);
				}

				this._prepareElements();
			}
		}
	}
}
