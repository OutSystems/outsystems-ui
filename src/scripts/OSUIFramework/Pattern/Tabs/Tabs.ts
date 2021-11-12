// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tabs extends AbstractPattern<TabsConfig> implements ITabs {
		private _tabsContent: HTMLElement;
		// Stores the content items of this specific Tabs
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		private _tabsContentItems: NodeList;
		private _tabsHeader: HTMLElement;
		private _tabsHeaderItems: NodeList;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TabsConfig(configs));
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

		private _prepareElements(): void {
			this._getTabsHeaderItems();
			this._getTabsContentItems();
			this._setTabsConnection();
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

				Helper.Attribute.Set(currentHeaderItem, 'data-tab', tabNumber.toString());

				if (currentContentItem !== undefined) {
					Helper.Attribute.Set(currentContentItem, 'data-tab', tabNumber.toString());
				}
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._prepareElements();

			this.listen();

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

		// eslint-disable-next-line @typescript-eslint/member-ordering
		public listen = (): void => {
			const tabs = this._selfElem;
			const tab_btns = tabs.querySelectorAll('.osui-tabs_header-item');
			// const snap = tabs.querySelector('section');
			//const snap_width = snap.clientWidth;

			tab_btns.forEach((node) => node.addEventListener('click', this.tab_clicked));

			//snap.addEventListener('scrollend', (e) => {
			// const selection_index = Math.round(e.currentTarget.scrollLeft / snap_width);
			// console.log('active tab: ' + selection_index);
			//});
		};

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		public tab_clicked = ({ currentTarget }): void => {
			const tabs = this._selfElem;
			const tab_btns = tabs.querySelectorAll('.osui-tabs_header-item');
			const index = [...tab_btns].indexOf(currentTarget);
			const contents = tabs.querySelectorAll('.osui-tabs_content-item');
			const tab_article: any = contents[index];

			this._selfElem.querySelector(`section`).scrollTo({
				top: 0,
				left: tab_article.offsetLeft,
				behavior: 'auto',
			});
		};
	}
}
