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
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TabsConfig(configs));

			// Bind the handleKeypressEvent with 'this'
			this._eventOnHeaderKeypress = this._handleKeypressEvent.bind(this);
			// Start with the arrays empty
			this._tabsHeaderItemsElementsArray = [];
			this._tabsContentItemsElementsArray = [];
		}

		// Method to determine the next target index on changeTab method
		private _getChangeTabTargetIndex(tabIndex: number): number {
			let newTabIndex;

			// If element exists on the array, set it to tabindex passed
			if (this._tabsHeaderItemsElementsArray[tabIndex]) {
				newTabIndex = tabIndex;
				// Otherwise, try the current configs_ActiveTab
			} else if (this._tabsHeaderItemsElementsArray[this._configs.ActiveTab]) {
				newTabIndex = this._configs.ActiveTab;
				// In last case, set it to the first on the list
			} else {
				newTabIndex = 0;
			}

			return newTabIndex;
		}

		// Method that handles the Keypress Event, for tabs navigation using arrows
		private _handleKeypressEvent(e: KeyboardEvent): void {
			let targetHeaderItemIndex;

			switch (e.key) {
				case GlobalEnum.Keycodes.ArrowRight:
					// If is right arrow, navigate to current active tabs + 1 (next item)
					targetHeaderItemIndex = this._configs.ActiveTab + 1;
					// To prevent triggerinh changeTab, if already on last item
					if (targetHeaderItemIndex < this._tabsHeaderItemsElementsArray.length) {
						this.changeTab(targetHeaderItemIndex, undefined, true);
					}

					break;
				case GlobalEnum.Keycodes.ArrowLeft:
					// If is left arrow, navigate to current active tabs - 1 (previous item)
					targetHeaderItemIndex = this._configs.ActiveTab - 1;
					// To prevent triggerinh changeTab, if already on first item
					if (targetHeaderItemIndex >= 0) {
						this.changeTab(targetHeaderItemIndex, undefined, true);
					}
					break;
			}

			const targetHeaderItem = this._tabsHeaderItemsElementsArray[targetHeaderItemIndex];
			// Focus on the new activeHeader, after changeTab
			if (targetHeaderItem) {
				targetHeaderItem.setFocus();
			}
		}

		// Method to make neccessary preparations for header and content items, that can't be done on their scope
		private _prepareHeaderAndContentItems(): void {
			// Set if the Tabs has only one Content
			this._hasSingleContent = this._tabsContentItemsElementsArray.length === 1;

			// Set initial active tab, based on the configs_ActiveTab
			this._activeTabHeaderElement = this._tabsHeaderItemsElementsArray[this._configs.ActiveTab];

			// If the Tabs only have one content, the active will be the first, otherwise
			// respect the active tab from the config
			this._activeTabContentElement = this._hasSingleContent
				? this._tabsContentItemsElementsArray[0]
				: this._tabsContentItemsElementsArray[this._configs.ActiveTab];

			// Call the method to immediatelly set the single content as active,
			// as it won't be needed to wait for more content items
			if (this._hasSingleContent) {
				this._activeTabContentElement.setAsActiveElement();
			}

			// Set the connection between headerItems and contentItems,
			// for the accessibility attributes that need id's from each item,
			// Here setting as false the param, as we don't want to set the data-tab here.
			// That will be done by each pattern, as they are created
			this._updateTabsConnection(false);
		}

		// Method that adds the necessary attributes and listeners to the Tabs header
		private _prepareHeaderElement(): void {
			// Set aria-role to TabsHeader
			Helper.Attribute.Set(
				this._tabsHeaderElement,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.TabList
			);

			// Add event listener for arrow navigation
			this._tabsHeaderElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);
		}

		// Method to remove the event listener on the Tabs header
		private _removeEventListeners(): void {
			this._tabsHeaderElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);
		}

		// Method to scroll to new target content item
		private _scrollToTargetContent(newContentItem: Patterns.TabsContentItem.ITabsContentItem): void {
			if (newContentItem) {
				// Get the left offset, to use on the ScrollTo
				const targetOffeset = newContentItem.getOffsetLeft();

				// Scroll to new content item
				this._tabsContentElement.scrollTo({
					top: 0,
					left: targetOffeset,
					behavior: this._scrollBehavior,
				});

				// Remove old contentitem as active
				this._activeTabContentElement.removeAsActiveElement();
				// Set new content item as active
				newContentItem.setAsActiveElement();
				this._activeTabContentElement = newContentItem;
			}
		}

		// Method to assign the html elements to the header and content wrappers
		private _setHtmlElements(): void {
			this._tabsHeaderElement = this._selfElem.querySelector(Constants.Dot + Enum.CssClasses.TabsHeader);
			this._tabsContentElement = this._selfElem.querySelector(Constants.Dot + Enum.CssClasses.TabsContent);
		}

		// Method to set the initial options on screen load
		private _setInitialOptions(): void {
			this._setTabsOrientation(this.configs.TabsOrientation);
			this._setTabsPosition(this._configs.TabsVerticalPosition);
			this._setTabsHeight(this._configs.Height);
			this._setTabsIsJustified(this._configs.IsJustified);
			this._setScrollBehavior(this._configs.DisableAnimation);
			// Setting as false, to avoid triigering changeTab event on screen load
			this.changeTab(this.configs.ActiveTab, undefined, false);
		}

		// Method to set the scroll behavior, based on the disabledAnimation config
		private _setScrollBehavior(disableAnimation: boolean): void {
			// If is true, then scroll should instant, otherwise is smooth
			this._scrollBehavior = disableAnimation ? Enum.ScrollBehavior.Instant : Enum.ScrollBehavior.Smooth;
			this._configs.DisableAnimation = disableAnimation;
		}

		// Method to set the Tabs Height
		private _setTabsHeight(height: string): void {
			// Create css variable
			Helper.Style.SetStyleAttribute(this._selfElem, Enum.Attributes.TabsHeight, height);
			this.configs.Height = height;
		}

		// Method to set if the Tabs are justified
		private _setTabsIsJustified(isJustified: boolean): void {
			if (isJustified) {
				Helper.Style.AddClass(this._selfElem, Enum.CssClasses.IsJustified);
			} else {
				Helper.Style.RemoveClass(this._selfElem, Enum.CssClasses.IsJustified);
			}

			this._configs.IsJustified = isJustified;
		}

		// Method to set the Tabs Orientation
		private _setTabsOrientation(orientation: GlobalTypes.Orientation): void {
			Helper.Style.RemoveClass(this._selfElem, Enum.CssClasses.Modifier + this._configs.TabsOrientation);
			Helper.Style.AddClass(this._selfElem, Enum.CssClasses.Modifier + orientation);

			this._configs.TabsOrientation = orientation;
		}

		// Method to set the Tabs Position
		private _setTabsPosition(position: GlobalTypes.Direction): void {
			Helper.Style.RemoveClass(this._selfElem, Enum.CssClasses.Modifier + this._configs.TabsVerticalPosition);
			Helper.Style.AddClass(this._selfElem, Enum.CssClasses.Modifier + position);

			this._configs.TabsVerticalPosition = position;
		}

		// Method that triggers the OnTabsChange event
		private _triggerOnChangeEvent(activeTab: number): void {
			if (this._onTabsChange !== undefined) {
				Helper.AsyncInvocation(this._onTabsChange, this.widgetId, activeTab);
			}
		}

		// Method that handles the connection between HeaderItems and ContentItem, related to data-tab and aria-controls/labbeledby
		private _updateTabsConnection(updateDataTab = true): void {
			// By default look to the first content item.
			let currentContentItem = this._tabsContentItemsElementsArray[0];

			this._tabsHeaderItemsElementsArray.forEach((item, index) => {
				// If there are more that one content item, then look at the current index
				if (!this._hasSingleContent) {
					currentContentItem = this._tabsContentItemsElementsArray[index];
				}

				// set aria-controls to current header item, by passing the current content item's widgetId
				item.setAriaControlsAttribute(currentContentItem.widgetId);

				// set aria-labbeledby to current content item, by passing the current header item's widgetId
				currentContentItem.setAriaLabelledByAttribute(item.widgetId);

				// If param is true, set the data-tab on the current header and content items, using the index
				if (updateDataTab) {
					item.setDataTab(index);
					currentContentItem.setDataTab(index);
				}
			});
		}

		// Method that it's called whenever a new TabsContentItem is rendered
		public addTabsContentItem(tabsContentItem: TabsContentItem.ITabsContentItem): void {
			// Add this item to the array
			this._tabsContentItemsElementsArray.push(tabsContentItem);

			// If tabs are already built, then this is dynamic content being added later
			if (this.isBuilt) {
				// So make again the connection between header items and content items,
				// to make sure the data-tab and labels attributes are correct with the new DOM order
				Helper.AsyncInvocation(this._updateTabsConnection.bind(this));

				// If there's no active content element, assign it to this one
				if (this._activeTabContentElement === undefined) {
					this._activeTabContentElement = tabsContentItem;
				}
			} else {
				// Otherwise are items created before the tabs is built
				// Set the correct data-tab, by using the items array, that correspond to the DOM order
				tabsContentItem.setDataTab(this._tabsContentItemsElementsArray.length - 1);
			}
		}

		// Method that it's called whenever a new TabsHeaderItem is rendered
		public addTabsHeaderItem(tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem): void {
			// Add this item to the array
			this._tabsHeaderItemsElementsArray.push(tabsHeaderItem);

			// If tabs are already built, then this is dynamic content being added later
			if (this.isBuilt) {
				// So make again the connection between header items and content items,
				// to make sure the data-tab and labels attributes are correct with the new DOM order
				Helper.AsyncInvocation(this._updateTabsConnection.bind(this));

				// If there's no active header element, assign it to this one
				if (this._activeTabHeaderElement === undefined) {
					this._activeTabHeaderElement = tabsHeaderItem;
					// And call changeTab, to make sure there's always an active tab
					Helper.AsyncInvocation(this.changeTab.bind(this), this._configs.ActiveTab, undefined, false);
				}
			} else {
				// Otherwise are items created before the tabs is built
				// Set the correct data-tab, by using the items array, that correspond to the DOM order
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
			switch (propertyName) {
				case Enum.Properties.ActiveTab:
					this.changeTab(propertyValue, undefined, true);
					break;
				case Enum.Properties.DisableAnimation:
					this._setScrollBehavior(propertyValue);
					break;
				case Enum.Properties.Height:
					this._setTabsHeight(propertyValue);
					break;
				case Enum.Properties.Orientation:
					this._setTabsOrientation(propertyValue);
					break;
				case Enum.Properties.Position:
					this._setTabsPosition(propertyValue);
					break;
				case Enum.Properties.IsJustified:
					this._setTabsIsJustified(propertyValue);
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		// Method to change between tabs
		public changeTab(
			tabIndex = this._configs.ActiveTab,
			tabsHeaderItem?: Patterns.TabsHeaderItem.ITabsHeaderItem,
			triggerEvent?: boolean
		): void {
			// If selecting the same element as the active one, prevent tabsChange
			if (this._activeTabHeaderElement === tabsHeaderItem) {
				return;
			}

			// Get the new target tab index
			const newTabIndex = this._getChangeTabTargetIndex(tabIndex);

			// Get the headerItem, based on the newTabIndex
			const newHeaderItem = this._tabsHeaderItemsElementsArray[newTabIndex];

			// If there're more than one content item, then to scrollTo and change active content item
			if (!this._hasSingleContent) {
				// Get the contentItem, based on the newTabIndex
				const newContentItem = this._tabsContentItemsElementsArray[newTabIndex];

				// Scroll to new content item and set it as active
				this._scrollToTargetContent(newContentItem);
			}

			// Remove old headerItem as active
			this._activeTabHeaderElement.removeAsActiveElement();

			if (newHeaderItem) {
				// Set new headerItem as active
				newHeaderItem.setAsActiveElement();
				this._activeTabHeaderElement = newHeaderItem;
			}

			// Update configs
			this._configs.ActiveTab = newTabIndex;

			// Trigger onTabChange event
			if (triggerEvent) {
				this._triggerOnChangeEvent(newTabIndex);
			}
		}

		// Destroy the Tabs pattern
		public dispose(): void {
			// call super method, which deletes this tabs class instance from the TabsMap
			super.dispose();
			// Remove event listeners on tabs header element
			this._removeEventListeners();
		}

		// Set callbacks for the onTabsChange event
		public registerCallback(callback: Callbacks.OSTabsOnChangeEvent): void {
			this._onTabsChange = callback;
		}

		// Method that it's called whenever a new TabsContentItem is destroyed
		public removeTabsContentItem(tabsContentItem: TabsContentItem.ITabsContentItem): void {
			// Get this item's index on the array
			const currentIndex = this._tabsContentItemsElementsArray.indexOf(tabsContentItem);
			// Remove it from the array
			this._tabsContentItemsElementsArray.splice(currentIndex, 1);
		}

		// Method that it's called whenever a new TabsHeaderItem is destroyed
		public removeTabsHeaderItem(tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem, isActiveItem?: boolean): void {
			// Get this item's index on the array
			const currentIndex = this._tabsHeaderItemsElementsArray.indexOf(tabsHeaderItem);
			// Remove it from the array
			this._tabsHeaderItemsElementsArray.splice(currentIndex, 1);

			// If this item removed was the active one, set a new one by calling changeTab()
			if (isActiveItem && this.isBuilt) {
				Helper.AsyncInvocation(this.changeTab.bind(this), this._configs.ActiveTab, undefined, false);
			}
		}
	}
}
