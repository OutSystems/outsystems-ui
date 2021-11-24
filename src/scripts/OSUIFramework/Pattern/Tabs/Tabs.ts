// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tabs extends AbstractPattern<TabsConfig> implements ITabs {
		// Store the current contentItem active
		private _activeTabContentElement: Patterns.TabsContentItem.ITabsContentItem;
		// Store the current headerItem active
		private _activeTabHeaderElement: Patterns.TabsHeaderItem.ITabsHeaderItem;
		// Store the keypress event with bind(this)
		private _eventOnHeaderKeypress: Callbacks.Generic;
		// Store if the Tabs has only one ContentItem, to prevebt unnecessary usages of ScrollTo
		private _hasSingleContent: boolean;
		// Store the onTabsChange platform callback
		private _onTabsChange: Callbacks.OSTabsOnChangeEvent;
		// Store the disableAnimation config, as its a boolean on the platform,
		// and it needs to be converted here to 'auto' if true, and 'smooth' if false
		private _scrollBehavior: Enum.ScrollBehavior;
		// Store the contentItems wrapper -- osui-tabs__content
		private _tabsContentElement: HTMLElement;
		// Store all the contentItems that are created
		private _tabsContentItemsElementsArray: Patterns.TabsContentItem.ITabsContentItem[];
		// Store the headerItems wrapper -- osui-tabs__header
		private _tabsHeaderElement: HTMLElement;
		// Store all the headerItems that are created
		private _tabsHeaderItemsElementsArray: Patterns.TabsHeaderItem.ITabsHeaderItem[];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TabsConfig(configs));

			this._eventOnHeaderKeypress = this._handleKeypressEvent.bind(this);
			// Start with the arrays empty
			this._tabsHeaderItemsElementsArray = [];
			this._tabsContentItemsElementsArray = [];
		}

		// Method that handles the Keypress Event, for tabs navigation using arrows
		private _handleKeypressEvent(e): void {
			let targetHeaderItemIndex;

			switch (e.key) {
				case GlobalEnum.Keycodes.ArrowRight:
					targetHeaderItemIndex = this._configs.ActiveTab + 1;
					if (targetHeaderItemIndex < this._tabsHeaderItemsElementsArray.length) {
						this.changeTab(targetHeaderItemIndex, undefined, true);
					}

					break;
				case GlobalEnum.Keycodes.ArrowLeft:
					targetHeaderItemIndex = this._configs.ActiveTab - 1;
					if (targetHeaderItemIndex >= 0) {
						this.changeTab(targetHeaderItemIndex, undefined, true);
					}
					break;
			}

			const targetHeaderItem = this._tabsHeaderItemsElementsArray[targetHeaderItemIndex];

			if (targetHeaderItem) {
				targetHeaderItem.setFocus();
			}
		}

		// Method to make neccessary preparations for header and content items, that can't be done on their scope
		private _prepareHeaderAndContentItems(): void {
			this._hasSingleContent = this._tabsContentItemsElementsArray.length === 1;

			this._activeTabHeaderElement = this._tabsHeaderItemsElementsArray[this._configs.ActiveTab];

			this._activeTabContentElement = this._hasSingleContent
				? this._tabsContentItemsElementsArray[0]
				: this._tabsContentItemsElementsArray[this._configs.ActiveTab];

			if (this._hasSingleContent) {
				this._activeTabContentElement.setAsActiveElement();
			}

			this._updateTabsConnection(false);
		}

		// Method that adds the necessary attributes and listeners to the Tabs header
		private _prepareHeaderElement(): void {
			Helper.Attribute.Set(
				this._tabsHeaderElement,
				Constants.AccessibilityAttribute.Role.AttrName,
				Constants.AccessibilityAttribute.Role.TabList
			);

			this._tabsHeaderElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);
		}

		// Method to remove the event listener on the Tabs header
		private _removeEventListeners(): void {
			this._tabsHeaderElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);
		}

		// Method to assign the html elements to the header and content wrappers
		private _setHtmlElements(): void {
			this._tabsHeaderElement = this._selfElem.querySelector(Constants.Dot + Enum.CssClasses.TabsHeader);
			this._tabsContentElement = this._selfElem.querySelector(Constants.Dot + Enum.CssClasses.TabsContent);
		}

		// Method to set the initial options on screen load
		private _setInitialOptions(): void {
			this.setTabsOrientation(this.configs.Orientation);
			this.setTabsPosition(this._configs.Position);
			this.setTabsHeight(this._configs.Height);
			this.setTabsIsJustified(this._configs.IsJustified);
			this.setScrollBehavior(this._configs.DisableAnimation);
			this.changeTab(this.configs.ActiveTab, undefined, false);
		}

		// Method that triggers the OnTabsChange event
		private _triggerOnChangeEvent(activeTab: number): void {
			if (this._onTabsChange !== undefined) {
				Helper.AsyncInvocation(this._onTabsChange, this.widgetId, activeTab);
			}
		}

		private _updateTabsConnection(updateDataTab = true): void {
			const currentContentItem = this._tabsContentItemsElementsArray[0];

			this._tabsHeaderItemsElementsArray.forEach((item, index) => {
				if (!this._hasSingleContent) {
					this._tabsContentItemsElementsArray[index];
				}

				item.setAriaControlsAttribute(currentContentItem.widgetId);

				currentContentItem.setAriaLabelledByAttribute(item.widgetId);

				if (updateDataTab) {
					item.setDataTab(index);
					currentContentItem.setDataTab(index);
				}
			});
		}

		public addTabsContentItem(tabsContentItem: TabsContentItem.ITabsContentItem): void {
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

		public addTabsHeaderItem(tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem): void {
			this._tabsHeaderItemsElementsArray.push(tabsHeaderItem);

			if (this.isBuilt) {
				Helper.AsyncInvocation(this._updateTabsConnection.bind(this));

				if (this._activeTabHeaderElement === undefined) {
					this._activeTabHeaderElement = tabsHeaderItem;
					Helper.AsyncInvocation(this.changeTab.bind(this), this._configs.ActiveTab, undefined, false);
				}
			} else {
				tabsHeaderItem.setDataTab(this._tabsHeaderItemsElementsArray.length - 1);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._prepareHeaderAndContentItems();

			this._prepareHeaderElement();

			this._setInitialOptions();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
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
		}

		public changeTab(
			tabIndex = this._configs.ActiveTab,
			tabsHeaderItem?: Patterns.TabsHeaderItem.ITabsHeaderItem,
			triggerEvent?: boolean
		): void {
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

			if (!this._hasSingleContent) {
				const newContentItem = this._tabsContentItemsElementsArray[newTabIndex];

				const targetOffeset = newContentItem.getOffsetLeft();

				this._tabsContentElement.scrollTo({
					top: 0,
					left: targetOffeset,
					behavior: this._scrollBehavior,
				});

				this._activeTabContentElement.removeAsActiveElement();
				newContentItem.setAsActiveElement();
				this._activeTabContentElement = newContentItem;
			}

			this._activeTabHeaderElement.removeAsActiveElement();
			newHeaderItem.setAsActiveElement();
			this._activeTabHeaderElement = newHeaderItem;

			this._configs.ActiveTab = newTabIndex;

			if (triggerEvent) {
				this._triggerOnChangeEvent(newTabIndex);
			}
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

		public removeTabsContentItem(tabsContentItem: TabsContentItem.ITabsContentItem): void {
			const currentIndex = this._tabsContentItemsElementsArray.indexOf(tabsContentItem);
			this._tabsContentItemsElementsArray.splice(currentIndex, 1);
		}

		public removeTabsHeaderItem(tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem, isActiveItem?: boolean): void {
			const currentIndex = this._tabsHeaderItemsElementsArray.indexOf(tabsHeaderItem);
			this._tabsHeaderItemsElementsArray.splice(currentIndex, 1);

			if (isActiveItem && this.isBuilt) {
				Helper.AsyncInvocation(this.changeTab.bind(this), this._configs.ActiveTab, undefined, false);
			}
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
	}
}
