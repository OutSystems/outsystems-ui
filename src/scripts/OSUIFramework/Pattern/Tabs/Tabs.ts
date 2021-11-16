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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		private _getTabsContentItems(): NodeList {
			this._tabsContentItems = Array.prototype.filter.call(
				this._selfElem.querySelectorAll(Constants.Dot + Enum.CssClasses.TabsContentItem),
				(el) => {
					return el.closest(Constants.Dot + Enum.CssClasses.Tabs) === this._selfElem;
				}
			);
			return this._tabsContentItems;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		private _getTabsHeaderItems(): NodeList {
			this._tabsHeaderItems = Array.prototype.filter.call(
				this._selfElem.querySelectorAll(Constants.Dot + Enum.CssClasses.TabsHeaderItem),
				(el) => {
					return el.closest(Constants.Dot + Enum.CssClasses.Tabs) === this._selfElem;
				}
			);
			return this._tabsHeaderItems;
		}

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		private _handleClickEvent({ currentTarget }): void {
			this._currentTabElement = this._selfElem.querySelector(
				Constants.Dot + Enum.CssClasses.ActiveTab
			) as HTMLElement;

			if (this._currentTabElement === currentTarget) {
				return;
			}

			if (this._currentTabElement) {
				Helper.Style.RemoveClass(this._currentTabElement, Enum.CssClasses.ActiveTab);
			}

			Helper.Style.AddClass(currentTarget, Enum.CssClasses.ActiveTab);

			this._currentTabIndex = parseInt(Helper.Attribute.Get(currentTarget, Enum.Attributes.DataTab));
			const currentContent = this._tabsContentItems[this._currentTabIndex] as HTMLElement;

			this._tabsContent.scrollTo({
				top: 0,
				left: currentContent.offsetLeft,
				behavior: Enum.OnChangeBehavior.Instant,
			});
		}

		private _prepareElements(): void {
			this._getTabsHeaderItems();
			this._getTabsContentItems();
			this._setTabsConnection();
		}

		// eslint-disable-next-line @typescript-eslint/member-ordering
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

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._prepareElements();

			this._setEventListeners();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			switch (propertyName) {
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		// Destroy the Tabs pattern
		public dispose(): void {
			// call super method, which deletes this tabs class instance from the TabsMap
			super.dispose();
		}

		// Set callbacks for the onTabsChange  event
		public registerCallback(callback: Callbacks.OSRatingSelectEvent): void {
			return;
		}
	}
}
