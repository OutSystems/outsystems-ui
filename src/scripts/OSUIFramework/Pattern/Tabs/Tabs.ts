// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 *
	 * @export
	 * @class Tabs
	 * @extends {AbstractPattern<TabsConfig>}
	 * @implements {ITabs}
	 */
	export class Tabs
		extends AbstractParent<TabsConfig, TabsContentItem.ITabsContentItem | TabsHeaderItem.ITabsHeaderItem>
		implements ITabs
	{
		// Store the current contentItem active
		private _activeTabContentElement: Patterns.TabsContentItem.ITabsContentItem;
		// Store the current headerItem active
		private _activeTabHeaderElement: Patterns.TabsHeaderItem.ITabsHeaderItem;
		// Store if there is need to add drag gestures
		private _addDragGestures: boolean;
		// Store current orientation config, to be able to remove current active option
		private _currentOrientation: GlobalEnum.Orientation;
		// Store current position config, to be able to remove current active option
		private _currentVerticalPositon: GlobalEnum.Direction;
		// Store if the observer should observe
		// This is usefull to prevent observer on clicks and changeProperty of changeTab method
		private _disableObserver: boolean;
		// Store the IntersectionObserver callback
		private _dragObserver: IntersectionObserver;
		// Store the events with bind(this)
		private _eventOnHeaderKeypress: Callbacks.Generic;
		private _eventOnTouchstart: Callbacks.Generic;
		// Store the onTabsChange platform callback
		private _eventTabsChange: Callbacks.OSTabsOnChangeEvent;
		// Store if the Tabs has only one ContentItem, to prevebt unnecessary usages of ScrollTo
		private _hasSingleContent: boolean;
		// Store the contentItems wrapper -- osui-tabs__content
		private _tabsContentElement: HTMLElement;
		// Store all the contentItems that are created
		private _tabsContentItemsElementsArray: Patterns.TabsContentItem.ITabsContentItem[];
		// Store the headerItems wrapper -- osui-tabs__header
		private _tabsHeaderElement: HTMLElement;
		// Store all the headerItems that are created
		private _tabsHeaderItemsElementsArray: Patterns.TabsHeaderItem.ITabsHeaderItem[];

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TabsConfig(configs));

			// Start with the arrays empty
			this._tabsHeaderItemsElementsArray = [];
			this._tabsContentItemsElementsArray = [];
			// Check if running on native shell, to enable drag gestures
			this._addDragGestures = OutSystems.OSUI.Utils.DeviceDetection.IsRunningAsNativeApp();
			// Block observer by default, to prevent it from running on page load
			this._disableObserver = true;
		}

		// Add event listener for arrow navigation
		private _addEvents(): void {
			this._tabsHeaderElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);
		}

		// Method to block the observer
		private _disableDragObserver(): void {
			this._disableObserver = true;
		}

		// Method to enable the observer
		private _enableDragObserver(): void {
			this._disableObserver = false;
		}

		// Method to determine the next target index on changeTab method
		private _getTargetIndex(tabIndex: number): number {
			let newTabIndex;

			// If element exists on the array, set it to tabindex passed
			if (this._tabsHeaderItemsElementsArray[tabIndex]) {
				newTabIndex = tabIndex;
				// Otherwise, try the current configs_ActiveTab
			} else if (this._tabsHeaderItemsElementsArray[this.configs.StartingTab]) {
				newTabIndex = this.configs.StartingTab;
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
					targetHeaderItemIndex = this.configs.StartingTab + 1;
					// To prevent triggerinh changeTab, if already on last item
					if (targetHeaderItemIndex < this._tabsHeaderItemsElementsArray.length) {
						this.changeTab(targetHeaderItemIndex, undefined, true, true);
					}

					break;
				case GlobalEnum.Keycodes.ArrowLeft:
					// If is left arrow, navigate to current active tabs - 1 (previous item)
					targetHeaderItemIndex = this.configs.StartingTab - 1;
					// To prevent triggerinh changeTab, if already on first item
					if (targetHeaderItemIndex >= 0) {
						this.changeTab(targetHeaderItemIndex, undefined, true, true);
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
			this._activeTabHeaderElement = this._tabsHeaderItemsElementsArray[this.configs.StartingTab];

			// If the Tabs only have one content, the active will be the first, otherwise
			// respect the active tab from the config
			this._activeTabContentElement = this._hasSingleContent
				? this._tabsContentItemsElementsArray[0]
				: this._tabsContentItemsElementsArray[this.configs.StartingTab];

			// Call the method to immediatelly set the single content as active,
			// as it won't be needed to wait for more content items
			if (this._hasSingleContent) {
				this._activeTabContentElement.setActiveElement();
			}

			// Set the connection between headerItems and contentItems,
			// for the accessibility attributes that need id's from each item,
			// Here setting as false the param, as we don't want to set the data-tab here.
			// That will be done by each pattern, as they are created
			this._updateItemsConnection(false);
		}

		// Remove Pattern Events
		private _removeEvents(): void {
			this._tabsHeaderElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);

			if (this._addDragGestures) {
				this._tabsContentElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._eventOnTouchstart);
			}
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
					behavior: GlobalEnum.ScrollBehavior.Auto,
				});
			}
		}

		// Method to set an IntersectionObserver when drag gestures are enable, to detect the activeItem on drag
		private _setDragObserver(): void {
			// Observer options
			const observerOptions = {
				root: this._tabsContentElement,
				rootMargin: Enum.ObserverOptions.RootMargin, // Fix for some android devices, that need at least of 1px of threshold for the itersection to properly work
				threshold: 1,
			};

			this._dragObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !this._disableObserver) {
						// Get data-tab from active entry intersecting, to know the current contentItem index
						const targetIndex = parseInt(
							Helper.Dom.Attribute.Get(entry.target as HTMLElement, Enum.Attributes.DataTab)
						);
						// get current headerItem
						const currentHeaderItem = this._tabsHeaderItemsElementsArray[targetIndex];
						// changeTab using the index obtained above,
						Helper.AsyncInvocation(this.changeTab.bind(this), targetIndex, currentHeaderItem, true, false);
					}
				});
			}, observerOptions);

			// Set an observer on each contentItem, to detect when is being intersected by a drag gesture
			this._tabsContentItemsElementsArray.forEach((item) => {
				item.setOnDragObserver(this._dragObserver);
			});
		}

		// Method to set the CSS variable that holds the number of header items
		private _setHeaderItemsCustomProperty(): void {
			// Create css variable
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssProperty.TabsHeaderItems,
				this._tabsHeaderItemsElementsArray.length
			);
		}

		// Method to set the Tabs Height
		private _setHeight(height: string): void {
			// Create css variable
			Helper.Dom.Styles.SetStyleAttribute(this._selfElem, Enum.CssProperty.TabsHeight, height);
		}

		// Method to set the initial options on screen load
		private _setInitialOptions(): void {
			this._setOrientation(this.configs.TabsOrientation);
			this._setPosition(this.configs.TabsVerticalPosition);
			this._setHeight(this.configs.Height);
			this._setIsJustified(this.configs.JustifyHeaders);
			// Set the --tabs-header-items css variable
			this._setHeaderItemsCustomProperty();
			// Setting as false, to avoid trigering changeTab event on screen load
			this.changeTab(this.configs.StartingTab, undefined, false, true);

			if (this._addDragGestures) {
				this.toggleDragGestures(true);
			}
		}

		// Method to set if the Tabs are justified
		private _setIsJustified(isJustified: boolean): void {
			if (isJustified) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClasses.IsJustified);
			} else {
				Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClasses.IsJustified);
			}
		}

		// Method to set the Tabs Orientation
		private _setOrientation(orientation: GlobalEnum.Orientation): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClasses.Modifier + this._currentOrientation);
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClasses.Modifier + orientation);
			this._currentOrientation = orientation;
		}

		// Method to set the Tabs Position
		private _setPosition(position: GlobalEnum.Direction): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClasses.Modifier + this._currentVerticalPositon);
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClasses.Modifier + position);

			this._currentVerticalPositon = position;
		}

		// Method to set a touchstart event on tabsContent
		private _setTouchEvents(): void {
			this._tabsContentElement.addEventListener(GlobalEnum.HTMLEvent.TouchStart, this._eventOnTouchstart);
		}

		// Method that triggers the OnTabsChange event
		private _triggerOnChangeEvent(activeTab: number): void {
			if (this._eventTabsChange !== undefined) {
				Helper.AsyncInvocation(this._eventTabsChange, this.widgetId, activeTab);
			}
		}

		// Method to remove the drag Observer on each contentItem
		private _unsetDragObserver(): void {
			this._dragObserver.disconnect();
		}

		// Method that handles the connection between HeaderItems and ContentItem, related to data-tab and aria-controls/labbeledby
		private _updateItemsConnection(updateDataTab = true): void {
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

		/**
		 * Method that adds the necessary attributes and listeners to the Tabs header
		 *
		 * @protected
		 * @memberof Tabs
		 */
		protected setA11YProperties(): void {
			// Set aria-role to TabsHeader
			Helper.A11Y.RoleTabList(this._tabsHeaderElement);
		}

		/**
		 * Method to set the callbacks and event listeners
		 *
		 * @protected
		 * @memberof Tabs
		 */
		protected setCallbacks(): void {
			this._addEvents();

			this._eventOnHeaderKeypress = this._handleKeypressEvent.bind(this);
			this._eventOnTouchstart = this._enableDragObserver.bind(this);
		}

		/**
		 * Method to assign the html elements to the header and content wrappers
		 *
		 * @protected
		 * @memberof Tabs
		 */
		protected setHtmlElements(): void {
			this._tabsHeaderElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClasses.TabsHeader);
			this._tabsContentElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClasses.TabsContent);
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof Tabs
		 */
		protected unsetCallbacks(): void {
			this._removeEvents();

			this._eventOnHeaderKeypress = undefined;

			if (this._addDragGestures) {
				this._eventOnTouchstart = undefined;
				this._unsetDragObserver();
			}
		}

		/**
		 * Method to unset the html elements references
		 *
		 * @protected
		 * @memberof Tabs
		 */
		protected unsetHtmlElements(): void {
			this._tabsHeaderElement = undefined;
			this._tabsContentElement = undefined;
		}

		/**
		 * Method that it's called whenever a new TabsContentItem is rendered
		 *
		 * @param {string} tabsContentChildId
		 * @memberof Tabs
		 */
		public addContentItem(tabsContentChildId: string): void {
			// Get the ContentChildItem reference
			const tabsContentChildItem =
				OutSystems.OSUI.Patterns.TabsContentItemAPI.GetTabsContentItemById(tabsContentChildId);

			if (this.getChild(tabsContentChildId)) {
				throw new Error(
					`${ErrorCodes.Tabs.FailSetNewChildItem}: There is already a ${GlobalEnum.PatternsNames.TabsContentItem} under Id: '${tabsContentChildItem.widgetId}' added to ${GlobalEnum.PatternsNames.Tabs} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(tabsContentChildId, tabsContentChildItem);
			}

			// Add this item to the array
			this._tabsContentItemsElementsArray.push(tabsContentChildItem);

			// If tabs are already built, then this is dynamic content being added later
			if (this.isBuilt) {
				// So make again the connection between header items and content items,
				// to make sure the data-tab and labels attributes are correct with the new DOM order
				Helper.AsyncInvocation(this._updateItemsConnection.bind(this));

				// If there's no active content element, assign it to this one
				if (this._activeTabContentElement === undefined) {
					this._activeTabContentElement = tabsContentChildItem;
				}

				if (this._addDragGestures) {
					tabsContentChildItem.setOnDragObserver(this._dragObserver);
				}
			} else {
				// Otherwise are items created before the tabs is built
				// Set the correct data-tab, by using the items array, that correspond to the DOM order
				tabsContentChildItem.setDataTab(this._tabsContentItemsElementsArray.length - 1);
			}
		}

		/**
		 * Method that it's called whenever a new TabsHeaderItem is rendered
		 *
		 * @param {string} tabsHeaderChildId
		 * @memberof Tabs
		 */
		public addHeaderItem(tabsHeaderChildId: string): void {
			// Get the ContentChildItem reference
			const tabsHeaderChildItem =
				OutSystems.OSUI.Patterns.TabsHeaderItemAPI.GetTabsHeaderItemById(tabsHeaderChildId);

			if (this.getChild(tabsHeaderChildId)) {
				throw new Error(
					`${ErrorCodes.Tabs.FailSetNewChildItem}: There is already a ${GlobalEnum.PatternsNames.TabsHeaderItem} under Id: '${tabsHeaderChildItem.widgetId}' added to ${GlobalEnum.PatternsNames.Tabs} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(tabsHeaderChildId, tabsHeaderChildItem);
			}

			// Add this item to the array
			this._tabsHeaderItemsElementsArray.push(tabsHeaderChildItem);
			const currentIndex = this._tabsHeaderItemsElementsArray.length - 1;

			// If tabs are already built, then this is dynamic content being added later
			if (this.isBuilt) {
				// So make again the connection between header items and content items,
				// to make sure the data-tab and labels attributes are correct with the new DOM order
				Helper.AsyncInvocation(this._updateItemsConnection.bind(this));
				// If there's no active header element, assign it to this one
				if (
					(this._activeTabHeaderElement === undefined || this._activeTabHeaderElement === null) &&
					currentIndex === this.configs.StartingTab
				) {
					// And call changeTab, to make sure there's an active tab
					// undefined passed, as we don't necessarily want this item to be set as active,
					// but the one passed on the configs.activeTab, if available
					Helper.AsyncInvocation(
						this.changeTab.bind(this),
						this.configs.StartingTab,
						tabsHeaderChildItem,
						false,
						true
					);
				}

				this._setHeaderItemsCustomProperty();
			} else {
				// Otherwise are items created before the tabs is built
				// Set the correct data-tab, by using the items array, that correspond to the DOM order
				tabsHeaderChildItem.setDataTab(currentIndex);
			}
		}

		/**
		 * Method used to be notified by a given ChildId about a given action and act accordingly
		 *
		 * @param childId Child Item Id to be stored/managed
		 * @param notifiedTo {Enum.ChildNotifyActionType} triggered notification type
		 * @memberof SectionIndex
		 */
		public beNotifiedByChild(childId: string, notifiedTo: Enum.ChildNotifyActionType): void {
			switch (notifiedTo) {
				default:
					throw new Error(
						`${ErrorCodes.SectionIndex.FailToSetChildItemAction}: There no exist a '${notifiedTo}' notification type.`
					);
			}
		}

		/**
		 * Method to build the pattern
		 *
		 * @memberof Tabs
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setCallbacks();

			this.setA11YProperties();

			this._prepareHeaderAndContentItems();

			this._setInitialOptions();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof Tabs
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.StartingTab:
						console.warn(
							`Tabs (${this.widgetId}): changes to ${Enum.Properties.StartingTab} parameter do not affect the tabs. Use the client action 'SetActiveTab' to affect the Tabs.`
						);
						break;
					case Enum.Properties.Height:
						this._setHeight(propertyValue as string);
						break;
					case Enum.Properties.TabsOrientation:
						this._setOrientation(propertyValue as GlobalEnum.Orientation);
						break;
					case Enum.Properties.TabsVerticalPosition:
						this._setPosition(propertyValue as GlobalEnum.Direction);
						break;
					case Enum.Properties.JustifyHeaders:
						this._setIsJustified(propertyValue as boolean);
						break;
				}
			}
		}

		/**
		 * Method to change between tabs
		 *
		 * @param {*} [tabIndex=this.configs.ActiveTab]
		 * @param {Patterns.TabsHeaderItem.ITabsHeaderItem} [tabsHeaderItem]
		 * @param {boolean} [triggerEvent]
		 * @param {boolean} [blockObserver]
		 * @return {*}  {void}
		 * @memberof Tabs
		 */
		public changeTab(
			tabIndex = this.configs.StartingTab,
			tabsHeaderItem?: Patterns.TabsHeaderItem.ITabsHeaderItem,
			triggerEvent?: boolean,
			blockObserver?: boolean
		): void {
			if (blockObserver) {
				Helper.AsyncInvocation(this._disableDragObserver.bind(this));
			}

			// If selecting the same element as the active one, prevent tabsChange
			if (
				this._activeTabHeaderElement === tabsHeaderItem ||
				// to prevent triggering event if using client action SetActiveTab to set the already active item
				(tabIndex === this.configs.StartingTab && this.isBuilt && tabsHeaderItem === undefined)
			) {
				return;
			}

			let newTabIndex;
			let newHeaderItem;

			// changeTab can be called from non-click sources, like client action
			// where the tabsHeaderItem will be passed as undefined
			if (tabsHeaderItem === undefined) {
				// Get the new target tab index
				newTabIndex = this._getTargetIndex(tabIndex);

				// Get the headerItem, based on the newTabIndex
				newHeaderItem = this._tabsHeaderItemsElementsArray[newTabIndex];
			} else {
				newTabIndex = tabIndex;
				newHeaderItem = tabsHeaderItem;
			}

			// If there're more than one content item or changeTab doesn't come from a drag gesture,
			// then do scrollTo and change active content item
			if (!this._hasSingleContent || this._disableObserver) {
				// Get the contentItem, based on the newTabIndex
				const newContentItem = this._tabsContentItemsElementsArray[newTabIndex];

				if (newContentItem) {
					// Remove old contentitem as active
					this._activeTabContentElement.removeActiveElement();
					// Set new content item as active
					newContentItem.setActiveElement();
					this._activeTabContentElement = newContentItem;
				}

				if (this._addDragGestures) {
					// Scroll to new content item and set it as active
					this._scrollToTargetContent(newContentItem);
				}
			}

			// Remove old headerItem as active
			if (this._activeTabHeaderElement) {
				this._activeTabHeaderElement.removeActiveElement();
			}
			if (newHeaderItem) {
				// Set new headerItem as active
				newHeaderItem.setActiveElement();
				this._activeTabHeaderElement = newHeaderItem;
			}

			// Update configs
			this.configs.StartingTab = newTabIndex;

			// Trigger onTabChange event
			if (triggerEvent) {
				this._triggerOnChangeEvent(newTabIndex);
			}
		}

		/**
		 * Method to remove event listener and destroy Tabs instance
		 *
		 * @memberof Tabs
		 */
		public dispose(): void {
			// Remove event listeners on tabs header element
			this.unsetCallbacks();
			this.unsetHtmlElements();

			// call super method, which deletes this tabs class instance from the TabsMap
			super.dispose();
		}

		/**
		 * Set callbacks for the onTabsChange event
		 *
		 * @param {Callbacks.OSTabsOnChangeEvent} callback
		 * @memberof Tabs
		 */
		public registerCallback(callback: Callbacks.OSTabsOnChangeEvent): void {
			if (this._eventTabsChange === undefined) {
				this._eventTabsChange = callback;
			} else {
				console.warn(`The ${GlobalEnum.PatternsNames.Tabs} already has the tabs change callback set.`);
			}
		}

		/**
		 * Method that it's called whenever a new TabsContentItem is destroyed
		 *
		 * @param {TabsContentItem.ITabsContentItem} tabsContentItem
		 * @memberof Tabs
		 */
		public removeContentItem(tabsContentItem: TabsContentItem.ITabsContentItem): void {
			// Get this item's index on the array
			const currentIndex = this._tabsContentItemsElementsArray.indexOf(tabsContentItem);
			// Remove it from the array
			this._tabsContentItemsElementsArray.splice(currentIndex, 1);

			// Unobserve this item on the IntersectionObserver
			if (this._addDragGestures) {
				tabsContentItem.unobserveDragObserver(this._dragObserver);
			}
		}

		/**
		 * Method that it's called whenever a new TabsHeaderItem is destroyed
		 *
		 * @param {TabsHeaderItem.ITabsHeaderItem} tabsHeaderItem
		 * @param {boolean} [isActiveItem]
		 * @memberof Tabs
		 */
		public removeHeaderItem(tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem, isActiveItem?: boolean): void {
			// Get this item's index on the array
			const currentIndex = this._tabsHeaderItemsElementsArray.indexOf(tabsHeaderItem);
			// Remove it from the array
			this._tabsHeaderItemsElementsArray.splice(currentIndex, 1);

			if (this.isBuilt) {
				// Update CSS Variable, as an item was removed
				this._setHeaderItemsCustomProperty();

				// If this item removed was the active one, set a new one by calling changeTab()
				if (isActiveItem) {
					this._activeTabHeaderElement = null;
					Helper.AsyncInvocation(this.changeTab.bind(this), currentIndex - 1, undefined, false, true);
				}
			}
		}

		/**
		 * Method to set the drag gestures necessary configurations
		 *
		 * @param {boolean} addDragGestures
		 * @memberof Tabs
		 */
		public toggleDragGestures(addDragGestures: boolean): void {
			// If running on native shell
			if (addDragGestures) {
				// Add class to prvent enable overflow-x
				Helper.Dom.Styles.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.HasDragGestures);
				this._addDragGestures = true;
				// Set touchStart event to enable observer when starting dragging
				this._setTouchEvents();
				// Set observer on each contentItem to detect current content being intersected
				this._setDragObserver();
				// Update content position, due to change to display grid
				this._scrollToTargetContent(this._activeTabContentElement);
				// If the gestures were already added
			} else if (this._addDragGestures) {
				// Remove class to prevent overflow-x
				Helper.Dom.Styles.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.HasDragGestures);
				this._addDragGestures = false;
				// remove touch event
				this._tabsContentElement.removeEventListener(GlobalEnum.HTMLEvent.TouchStart, this._eventOnTouchstart);
				// Disconnect observer
				this._unsetDragObserver();
			}
		}
	}
}
