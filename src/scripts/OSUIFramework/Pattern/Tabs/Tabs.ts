// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tabs extends AbstractPattern<TabsConfig> implements ITabs {
		private _currentTabElement: HTMLElement;
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
			this._currentTabElement = this._selfElem.querySelector(
				Constants.Dot + Enum.CssClasses.ActiveTab
			) as HTMLElement;

			if (this._currentTabElement === currentTarget) {
				return;
			}

			const currentTabIndex = parseInt(Helper.Attribute.Get(currentTarget, Enum.Attributes.DataTab));

			this.changeTab(currentTabIndex);
		}

		private _prepareElements(): void {
			this._getTabsHeaderItems();
			this._getTabsContentItems();
			this._setTabsConnection();
			this.setTabsOrientation(this.configs.Orientation);
			this.setTabsPosition(this._configs.Position);
			this.setTabsHeight(this._configs.Height);
			this.setTabsIsJustified(this._configs.IsJustified);
			this.changeTab(this.configs.ActiveTab);
			this._setEventListeners();
		}

		private _setEventListeners(): void {
			this._tabsHeaderItems.forEach((node) => node.addEventListener('click', this._eventOnTabsClick));
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
					this.changeTab(propertyValue);
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

		public changeTab(tabIndex: number): void {
			const newHeaderItem = this._tabsHeaderItems[tabIndex] as HTMLElement;

			if (newHeaderItem === undefined) {
				console.warn(`The TabsHeaderItem with the index value of ${tabIndex} doesn't exist.`);
				return;
			}
			const newContentItem = this._tabsContentItems[tabIndex] as HTMLElement;

			if (this._currentTabElement) {
				Helper.Style.RemoveClass(this._currentTabElement, Enum.CssClasses.ActiveTab);
			}

			this._tabsContent.scrollTo({
				top: 0,
				left: newContentItem.offsetLeft,
				behavior: Enum.OnChangeBehavior.Instant,
			});

			Helper.Style.AddClass(newHeaderItem, Enum.CssClasses.ActiveTab);
			this._currentTabElement = newHeaderItem;
			this._configs.ActiveTab = tabIndex;

			this._triggerOnChangeEvent(tabIndex);
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
	}
}
