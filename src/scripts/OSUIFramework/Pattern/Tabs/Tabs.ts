// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tabs extends AbstractPattern<TabsConfig> implements ITabs {
		// Stores the content items of this specific Tabs
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		private _tabsContentItems: Map<string, OSUIFramework.Patterns.TabsContentItem.ITabsContentItem>;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TabsConfig(configs));
		}

		public build(): void {
			super.build();

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

		// Set callbacks for the onTbsChange  event
		public registerCallback(callback: Callbacks.OSRatingSelectEvent): void {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/member-ordering
		public listen = (): void => {
			console.log('listen');
			const tabs = this._selfElem;
			const tab_btns = tabs.querySelectorAll('.osui-tabs-header-item');
			// const snap = tabs.querySelector('section');
			//const snap_width = snap.clientWidth;
			console.log(tab_btns);
			tab_btns.forEach((node) => node.addEventListener('click', this.tab_clicked));

			//snap.addEventListener('scrollend', (e) => {
			// const selection_index = Math.round(e.currentTarget.scrollLeft / snap_width);
			// console.log('active tab: ' + selection_index);
			//});
		};

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		public tab_clicked = ({ currentTarget }): void => {
			const tabs = this._selfElem;
			const tab_btns = tabs.querySelectorAll('.osui-tabs-header-item');
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
