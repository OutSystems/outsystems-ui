// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Tabs {
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
		// Store current orientation config, to be able to remove current active option
		private _currentOrientation: GlobalEnum.Orientation;
		// Store current position config, to be able to remove current active option
		private _currentVerticalPositon: GlobalEnum.Direction;
		// Store the IntersectionObserver callback
		private _dragObserver: IntersectionObserver;
		// Store the events with bind(this)
		private _eventOnHeaderKeypress: GlobalCallbacks.Generic;
		// On WindowResize and OrientationChange Event
		private _eventOnResize: GlobalCallbacks.Generic;
		// Store if has drag gestures
		private _hasDragGestures: boolean;
		// Store if the Tabs has only one ContentItem, to prevent unnecessary usages of ScrollTo
		private _hasSingleContent: boolean;
		// Store the onTabsChange platform callback
		private _platformEventTabsOnChange: Callbacks.OSOnChangeEvent;
		// Store the id of the requestAnimationFrame called to animate the indicator
		private _requestAnimationFrameOnIndicatorResize: number;
		// Store the contentItems wrapper -- osui-tabs__content
		private _tabsContentElement: HTMLElement;
		// Store the headerItems wrapper -- osui-tabs__header
		private _tabsHeaderElement: HTMLElement;
		// Store the tabs-indicator element -- osui-tabs_indicator
		private _tabsIndicatorElement: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TabsConfig(configs));

			// Check if running on native shell, to enable drag gestures
			this._hasDragGestures =
				Helper.DeviceInfo.IsNative && this.configs.TabsOrientation === GlobalEnum.Orientation.Horizontal;
		}

		// Method that it's called whenever a new TabsContentItem is rendered
		private _addContentItem(tabsContentChildId: string): void {
			// Get the ContentChildItem reference
			const tabsContentChildItem =
				OutSystems.OSUI.Patterns.TabsContentItemAPI.GetTabsContentItemById(tabsContentChildId);

			if (this.getChild(tabsContentChildId)) {
				throw new Error(
					`${ErrorCodes.Tabs.FailSetNewChildContentItem}: There is already a ${GlobalEnum.PatternName.TabsContentItem} under Id: '${tabsContentChildItem.widgetId}' added to ${GlobalEnum.PatternName.Tabs} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(tabsContentChildId, tabsContentChildItem);
			}

			// If tabs are already built, then this is dynamic content being added later
			if (this.isBuilt) {
				// So make again the connection between header items and content items,
				// to make sure the data-tab and labels attributes are correct with the new DOM order
				Helper.AsyncInvocation(this._updateItemsConnection.bind(this));

				// If there's no active content element, assign it to this one
				if (this._activeTabContentElement === undefined) {
					this._activeTabContentElement = tabsContentChildItem;
				}

				if (this._hasDragGestures) {
					tabsContentChildItem.setOnDragObserver(this._dragObserver);
				}
			} else {
				// Otherwise are items created before the tabs is built
				// Set the correct data-tab, by using the items array, that correspond to the DOM order
				tabsContentChildItem.setDataTab(this.getChildItems(Enum.ChildTypes.TabsContentItem).length - 1);
			}
		}

		// Add event listener for arrow navigation
		private _addEvents(): void {
			this._tabsHeaderElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);

			// Add event listener for window resize, to update active indicator size
			Event.GlobalEventManager.Instance.addHandler(Event.Type.WindowResize, this._eventOnResize);

			// Add orientationchange listener to update active indicator size, on touch devices
			if (Helper.DeviceInfo.IsPhone || Helper.DeviceInfo.IsTablet) {
				Event.GlobalEventManager.Instance.addHandler(Event.Type.OrientationChange, this._eventOnResize);
			}
		}

		// Method that it's called whenever a new TabsHeaderItem is rendered
		private _addHeaderItem(tabsHeaderChildId: string): void {
			// Get the ContentChildItem reference
			const tabsHeaderChildItem =
				OutSystems.OSUI.Patterns.TabsHeaderItemAPI.GetTabsHeaderItemById(tabsHeaderChildId);

			if (this.getChild(tabsHeaderChildId)) {
				throw new Error(
					`${ErrorCodes.Tabs.FailSetNewChildHeaderItem}: There is already a ${GlobalEnum.PatternName.TabsHeaderItem} under Id: '${tabsHeaderChildItem.widgetId}' added to ${GlobalEnum.PatternName.Tabs} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(tabsHeaderChildId, tabsHeaderChildItem);
			}

			const currentIndex = this.getChildItems(Enum.ChildTypes.TabsHeaderItem).length - 1;

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
					Helper.AsyncInvocation(this.changeTab.bind(this), this.configs.StartingTab, tabsHeaderChildItem);
				}

				this._setHeaderItemsCustomProperty();

				// Update indicator size
				this._handleTabIndicator();
			} else {
				// Otherwise are items created before the tabs is built
				// Set the correct data-tab, by using the items array, that correspond to the DOM order
				tabsHeaderChildItem.setDataTab(currentIndex);
			}
		}

		// Method to determine the next target index on changeTab method
		private _getTargetIndex(tabIndex: number): number {
			let newTabIndex;

			// If element exists on the array, set it to tabindex passed
			if (this.getChildByIndex(tabIndex, Enum.ChildTypes.TabsHeaderItem)) {
				newTabIndex = tabIndex;
				// Otherwise, try the current configs_ActiveTab
			} else if (this.getChildByIndex(this.configs.StartingTab, Enum.ChildTypes.TabsHeaderItem)) {
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
					if (targetHeaderItemIndex < this.getChildItems(Enum.ChildTypes.TabsHeaderItem).length) {
						this.changeTab(targetHeaderItemIndex, undefined, true);
					}

					break;
				case GlobalEnum.Keycodes.ArrowLeft:
					// If is left arrow, navigate to current active tabs - 1 (previous item)
					targetHeaderItemIndex = this.configs.StartingTab - 1;
					// To prevent triggering changeTab, if already on first item
					if (targetHeaderItemIndex >= 0) {
						this.changeTab(targetHeaderItemIndex, undefined, true);
					}
					break;
			}

			const targetHeaderItem = this.getChildByIndex(targetHeaderItemIndex, Enum.ChildTypes.TabsHeaderItem);
			// Focus on the new activeHeader, after changeTab
			if (targetHeaderItem) {
				targetHeaderItem.setFocus();
			}
		}

		// Method to adjust the tabs css active item on resize or orientation-change
		private _handleOnResizeEvend(): void {
			this._scrollToTargetContent(this._activeTabContentElement);
			this._handleTabIndicator();
		}

		// Method that handles the indicator size and transition
		private _handleTabIndicator(): void {
			if (this._activeTabHeaderElement) {
				// Check if it comes form a disabled tab, to remove the disable class
				if (
					!Helper.Dom.Attribute.Get(
						this._activeTabHeaderElement.selfElement,
						GlobalEnum.HTMLAttributes.Disabled
					)
				) {
					Helper.Dom.Attribute.Remove(this._tabsIndicatorElement, GlobalEnum.HTMLAttributes.Disabled);
				}

				const isVertical = this.configs.TabsOrientation === GlobalEnum.Orientation.Vertical;
				const activeElement = this._activeTabHeaderElement.selfElement;

				// Get transform value based on orientation and rtl value
				const transformValue = isVertical
					? activeElement.offsetTop
					: OutSystems.OSUI.Utils.GetIsRTL()
					? -(this._tabsHeaderElement.offsetWidth - activeElement.offsetLeft - activeElement.offsetWidth)
					: activeElement.offsetLeft;

				// Check current indicator size
				const currentSize = isVertical
					? this._tabsIndicatorElement.offsetHeight
					: this._tabsIndicatorElement.offsetWidth;

				// Check current active item size
				const newSize = isVertical ? activeElement.offsetHeight : activeElement.offsetWidth;

				// translate pixel sized value to a scale value
				const newScaleValue = newSize / currentSize;

				// Update the css variables, that will trigger a transform transition
				function updateIndicatorUI() {
					if (this._activeTabHeaderElement) {
						// Apply transform: translate
						Helper.Dom.Styles.SetStyleAttribute(
							this._tabsIndicatorElement,
							Enum.CssProperty.TabsIndicatorTransform,
							transformValue + GlobalEnum.Units.Pixel
						);

						// Apply transform scale
						Helper.Dom.Styles.SetStyleAttribute(
							this._tabsIndicatorElement,
							Enum.CssProperty.TabsIndicatorScale,
							newScaleValue
						);
					} else {
						cancelAnimationFrame(this._requestAnimationFrameOnIndicatorResize);
					}
				}

				this._requestAnimationFrameOnIndicatorResize = requestAnimationFrame(updateIndicatorUI.bind(this));

				// If at this moment the active item has no size (NaN), set an observer to run this method when its size is changed
				// This happens, as an example, when there're tabs inside tabs, and inner one has no size when it's built, due to being on a non-active tab
				if (isNaN(newScaleValue)) {
					const resizeObserver = new ResizeObserver((entries) => {
						for (const entry of entries) {
							if (entry.contentBoxSize) {
								this._handleTabIndicator();
								// We just need this once, so lets remove the observer
								resizeObserver.unobserve(activeElement);
							}
						}
					});
					resizeObserver.observe(activeElement);
				}
			}
		}

		// Method to make neccessary preparations for header and content items, that can't be done on their scope
		private _prepareHeaderAndContentItems(): void {
			// Set if the Tabs has only one Content
			this._hasSingleContent = this.getChildItems(Enum.ChildTypes.TabsContentItem).length === 1;

			// Set initial active tab, based on the configs_ActiveTab
			this._activeTabHeaderElement = this.getChildByIndex(
				this.configs.StartingTab,
				Enum.ChildTypes.TabsHeaderItem
			) as TabsHeaderItem.ITabsHeaderItem;

			// If the Tabs only have one content, the active will be the first, otherwise
			// respect the active tab from the config
			this._activeTabContentElement = this._hasSingleContent
				? (this.getChildByIndex(0, Enum.ChildTypes.TabsContentItem) as TabsContentItem.ITabsContentItem)
				: (this.getChildByIndex(
						this.configs.StartingTab,
						Enum.ChildTypes.TabsContentItem
				  ) as TabsContentItem.ITabsContentItem);

			// Call the method to immediatelly set the single content as active,
			// as it won't be needed to wait for more content items
			if (this._hasSingleContent) {
				this._activeTabContentElement.setIsActive();
			}

			// Set the connection between headerItems and contentItems,
			// for the accessibility attributes that need id's from each item,
			// Here setting as false the param, as we don't want to set the data-tab here.
			// That will be done by each pattern, as they are created
			this._updateItemsConnection(false);
		}

		// Method that it's called whenever a new TabsContentItem is destroyed
		private _removeContentItem(childContentId: string): void {
			const auxIndex = this.getChildIndex(childContentId);
			const wasActive = this.getChild(childContentId).IsActive;
			// Check if the given ChildId exist at childList
			if (this.getChild(childContentId)) {
				// Remove item
				this.unsetChild(childContentId);
			} else {
				throw new Error(
					`${ErrorCodes.Tabs.FailUnsetNewChildContentItem}: The ${GlobalEnum.PatternName.TabsContentItem} under uniqueId: '${childContentId}' does not exist as an TabsContentItem from ${GlobalEnum.PatternName.Tabs} with Id: ${this.widgetId}.`
				);
			}

			const tabsContentItem = this.getChild(childContentId) as TabsContentItem.ITabsContentItem;

			// Unobserve this item on the IntersectionObserver
			if (this._hasDragGestures) {
				tabsContentItem.unobserveDragObserver(this._dragObserver);
			}

			if (wasActive) {
				if (this.getChildByIndex(auxIndex)) {
					this._activeTabContentElement = this.getChildByIndex(
						auxIndex,
						Enum.ChildTypes.TabsContentItem
					) as TabsContentItem.ITabsContentItem;
					this._activeTabContentElement.setIsActive();
				} else if (this.getChildItems(Enum.ChildTypes.TabsContentItem).length > 0) {
					this._activeTabContentElement = this.getChildItems(Enum.ChildTypes.TabsContentItem).filter(
						(item) => item.isLastChild
					)[0] as TabsContentItem.ITabsContentItem;
					this._activeTabContentElement.setIsActive();
				} else {
					this._activeTabContentElement = null;
				}
			}
		}

		// Remove Pattern Events
		private _removeEvents(): void {
			this._tabsHeaderElement.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);

			// Remove resize event
			Event.GlobalEventManager.Instance.removeHandler(Event.Type.WindowResize, this._eventOnResize);

			// Remove orientationchange listener
			if (Helper.DeviceInfo.IsPhone || Helper.DeviceInfo.IsTablet) {
				Event.GlobalEventManager.Instance.removeHandler(Event.Type.OrientationChange, this._eventOnResize);
			}
		}

		// Method that it's called whenever a new TabsHeaderItem is destroyed
		private _removeHeaderItem(childHeaderId: string): void {
			const auxIndex = this.getChildIndex(childHeaderId);
			const wasActive = this.getChild(childHeaderId).IsActive;
			// Check if the given ChildId exist at childList
			if (this.getChild(childHeaderId)) {
				// Remove item
				this.unsetChild(childHeaderId);
			} else {
				throw new Error(
					`${ErrorCodes.Tabs.FailUnsetNewChildHeaderItem}: The ${GlobalEnum.PatternName.TabsHeaderItem} under uniqueId: '${childHeaderId}' does not exist as an TabsHeaderItem from ${GlobalEnum.PatternName.Tabs} with Id: ${this.widgetId}.`
				);
			}

			if (this.isBuilt) {
				// Update CSS Variable, as an item was removed
				this._setHeaderItemsCustomProperty();
				if (wasActive) {
					if (this.getChildByIndex(auxIndex)) {
						this._activeTabHeaderElement = this.getChildByIndex(
							auxIndex,
							Enum.ChildTypes.TabsHeaderItem
						) as TabsHeaderItem.ITabsHeaderItem;
						this._activeTabHeaderElement.setIsActive();
					} else if (this.getChildItems(Enum.ChildTypes.TabsHeaderItem).length > 0) {
						this._activeTabHeaderElement = this.getChildItems(Enum.ChildTypes.TabsHeaderItem).filter(
							(item) => item.isLastChild
						)[0] as TabsHeaderItem.ITabsHeaderItem;
						this._activeTabHeaderElement.setIsActive();
					} else {
						this._activeTabHeaderElement = null;
					}

					// Update scale size variable
					this._handleTabIndicator();
				}
			}
		}

		// Method to scroll to new target content item
		private _scrollToTargetContent(newContentItem: Patterns.TabsContentItem.ITabsContentItem): void {
			if (newContentItem) {
				// Scroll to new content item
				this._tabsContentElement.scrollTo({
					top: 0,
					left: newContentItem.getOffsetLeft(),
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
					if (entry.isIntersecting) {
						// Get data-tab from active entry intersecting, to know the current contentItem index
						const targetIndex = parseInt(
							Helper.Dom.Attribute.Get(entry.target as HTMLElement, Enum.Attributes.DataTab)
						);
						// get current headerItem
						const currentHeaderItem = this.getChildByIndex(targetIndex, Enum.ChildTypes.TabsHeaderItem);

						// changeTab using the index obtained above,
						Helper.AsyncInvocation(this.changeTab.bind(this), targetIndex, currentHeaderItem, true, true);
					}
				});
			}, observerOptions);

			// Set an observer on each contentItem, to detect when is being intersected by a drag gesture
			this.getChildItems(Enum.ChildTypes.TabsContentItem).forEach((item: TabsContentItem.ITabsContentItem) => {
				item.setOnDragObserver(this._dragObserver);
			});
		}

		// Method to set the CSS variable that holds the number of header items
		private _setHeaderItemsCustomProperty(): void {
			// Create css variable
			Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				Enum.CssProperty.TabsHeaderItems,
				this.getChildItems(Enum.ChildTypes.TabsHeaderItem).length
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
			// Set startingTab
			this.changeTab(this.configs.StartingTab);

			if (this._hasDragGestures) {
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

			if (this.isBuilt) {
				// Update scale size variable
				this._handleTabIndicator();
			}
		}

		// Method to set the Tabs Orientation
		private _setOrientation(orientation: GlobalEnum.Orientation): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClasses.Modifier + this._currentOrientation);
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClasses.Modifier + orientation);
			this._currentOrientation = orientation;

			if (this.isBuilt) {
				// Update scale size variable
				this._handleTabIndicator();
				// Update content position
				this._scrollToTargetContent(this._activeTabContentElement);
			}
		}

		// Method to set the Tabs Position
		private _setPosition(position: GlobalEnum.Direction): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClasses.Modifier + this._currentVerticalPositon);
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClasses.Modifier + position);

			this._currentVerticalPositon = position;
		}

		// Toggle TableHeaderItem disbaled status
		private _setTabHeaderItemDisabledStatus(childHeaderId: string, isDisabled: boolean): void {
			const TabHeaderItemElement = Helper.Dom.GetElementByUniqueId(childHeaderId);
			const TabItemIndex = this.getChildIndex(childHeaderId);
			const TabContentItemId = this.getChildByIndex(TabItemIndex, Enum.ChildTypes.TabsContentItem).widgetId;
			const TabContentItemElement = Helper.Dom.GetElementById(TabContentItemId);

			const isTabHeaderItemDisabled = Helper.Dom.Attribute.Get(
				TabHeaderItemElement,
				GlobalEnum.HTMLAttributes.Disabled
			);

			if (isDisabled) {
				Helper.Dom.Attribute.Set(TabHeaderItemElement, GlobalEnum.HTMLAttributes.Disabled, 'true');
				// Let's hide TabContentItem, to prevent it appears when the tabs are swippable
				Helper.Dom.Styles.SetStyleAttribute(
					TabContentItemElement,
					GlobalEnum.InlineStyle.Display,
					GlobalEnum.InlineStyleValue.Display.none
				);

				if (this._activeTabHeaderElement.selfElement === TabHeaderItemElement) {
					Helper.Dom.Attribute.Set(this._tabsIndicatorElement, GlobalEnum.HTMLAttributes.Disabled, true);
				}
			} else if (!isDisabled && isTabHeaderItemDisabled) {
				Helper.Dom.Attribute.Remove(TabHeaderItemElement, GlobalEnum.HTMLAttributes.Disabled);
				Helper.Dom.Styles.SetStyleAttribute(
					TabContentItemElement,
					GlobalEnum.InlineStyle.Display,
					GlobalEnum.InlineStyleValue.Display.block
				);

				if (this._activeTabHeaderElement.selfElement === TabHeaderItemElement) {
					Helper.Dom.Attribute.Remove(this._tabsIndicatorElement, GlobalEnum.HTMLAttributes.Disabled);
				}
			}
		}

		// Method to change between tabs
		private _tabHeaderItemHasBeenClicked(childHeaderId: string): void {
			const newHeaderItem = this.getChild(childHeaderId) as TabsHeaderItem.ITabsHeaderItem;

			if (newHeaderItem === undefined) {
				throw new Error(
					`${ErrorCodes.Tabs.FailChildItemClicked}: The ${GlobalEnum.PatternName.TabsHeaderItem} under uniqueId: '${childHeaderId}' does not exist as an TabsHeaderItem from ${GlobalEnum.PatternName.Tabs} with Id: ${this.widgetId}.`
				);
			}

			this.changeTab(this.getChildIndex(childHeaderId), newHeaderItem, true);
		}

		// Method that triggers the OnTabsChange event
		private _triggerOnChangeEvent(activeTab: number): void {
			if (this._platformEventTabsOnChange !== undefined) {
				Helper.AsyncInvocation(this._platformEventTabsOnChange, this.widgetId, activeTab);
			}
		}

		// Method to remove the drag Observer on each contentItem
		private _unsetDragObserver(): void {
			this._dragObserver.disconnect();
		}

		// Method that handles the connection between HeaderItems and ContentItem, related to data-tab and aria-controls/labbeledby
		private _updateItemsConnection(updateDataTab = true): void {
			// By default look to the first content item.
			let currentContentItem = this.getChildByIndex(
				0,
				Enum.ChildTypes.TabsContentItem
			) as TabsContentItem.ITabsContentItem;

			this.getChildItems(Enum.ChildTypes.TabsHeaderItem).forEach(
				(item: TabsHeaderItem.ITabsHeaderItem, index) => {
					// If there are more that one content item, then look at the current index
					if (this._hasSingleContent === false) {
						currentContentItem = this.getChildByIndex(
							index,
							Enum.ChildTypes.TabsContentItem
						) as TabsContentItem.ITabsContentItem;
					}

					if (item && currentContentItem) {
						// set aria-controls to current header item, by passing the current content item's widgetId
						item.setAriaControlsAttribute(currentContentItem.widgetId);

						// set aria-labbeledby to current content item, by passing the current header item's widgetId
						currentContentItem.setAriaLabelledByAttribute(item.widgetId);

						// If param is true, set the data-tab on the current header and content items, using the index
						if (updateDataTab) {
							item.setDataTab(index);
							currentContentItem.setDataTab(index);
						}
					}
				}
			);
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
			// Set aria-hidden to tabs indicator
			Helper.A11Y.AriaHiddenTrue(this._tabsIndicatorElement);
		}

		/**
		 * Method to set the callbacks and event listeners
		 *
		 * @protected
		 * @memberof Tabs
		 */
		protected setCallbacks(): void {
			this._eventOnHeaderKeypress = this._handleKeypressEvent.bind(this);
			this._eventOnResize = this._handleOnResizeEvend.bind(this);
			this._addEvents();
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
			this._tabsIndicatorElement = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClasses.TabsIndicatorElem);
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
			this._eventOnResize = undefined;

			if (this._hasDragGestures) {
				this._unsetDragObserver();
			}

			this._requestAnimationFrameOnIndicatorResize = undefined;
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
			this._tabsIndicatorElement = undefined;
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
				case Enum.ChildNotifyActionType.AddContentItem:
					this._addContentItem(childId);
					break;
				case Enum.ChildNotifyActionType.AddHeaderItem:
					this._addHeaderItem(childId);
					break;
				case Enum.ChildNotifyActionType.Click:
					this._tabHeaderItemHasBeenClicked(childId);
					break;
				case Enum.ChildNotifyActionType.DisabledHeaderItem:
					this._setTabHeaderItemDisabledStatus(childId, true);
					break;
				case Enum.ChildNotifyActionType.EnabledHeaderItem:
					this._setTabHeaderItemDisabledStatus(childId, false);
					break;
				case Enum.ChildNotifyActionType.RemovedContentItem:
					this._removeContentItem(childId);
					break;
				case Enum.ChildNotifyActionType.RemovedHeaderItem:
					this._removeHeaderItem(childId);
					break;
				case Enum.ChildNotifyActionType.UpdateIndicator:
					this._handleTabIndicator();
					break;
				default:
					throw new Error(
						`${ErrorCodes.Tabs.FailToSetChildItemAction}: There no exist a '${notifiedTo}' notification type.`
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
		 * @param {*} [tabIndex=this.configs.StartingTab]
		 * @param {Patterns.TabsHeaderItem.ITabsHeaderItem} [tabsHeaderItem]
		 * @param {boolean} [triggerEvent=false]
		 * @param {boolean} [triggeredByObserver=false]
		 * @return {*}  {void}
		 * @memberof Tabs
		 */
		public changeTab(
			tabIndex = this.configs.StartingTab,
			tabsHeaderItem?: Patterns.TabsHeaderItem.ITabsHeaderItem,
			triggerEvent = false,
			triggeredByObserver = false
		): void {
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
				newHeaderItem = this.getChildByIndex(newTabIndex, Enum.ChildTypes.TabsHeaderItem);
			} else {
				newTabIndex = tabIndex;
				newHeaderItem = tabsHeaderItem;
			}

			// Remove old headerItem as active
			if (this._activeTabHeaderElement) {
				this._activeTabHeaderElement?.unsetIsActive();
			}
			if (newHeaderItem) {
				// Set new headerItem as active
				newHeaderItem.setIsActive();
				this._activeTabHeaderElement = newHeaderItem;
			}

			// If there're more than one content item,
			// then do scrollTo and change active content item
			if (this._hasSingleContent === false) {
				// Get the contentItem, based on the newTabIndex
				const newContentItem = this.getChildByIndex(
					newTabIndex,
					Enum.ChildTypes.TabsContentItem
				) as TabsContentItem.ITabsContentItem;

				if (newContentItem) {
					// Remove old contentitem as active
					this._activeTabContentElement?.unsetIsActive();
					// Set new content item as active
					newContentItem.setIsActive();
					this._activeTabContentElement = newContentItem;
				}

				if (this._hasDragGestures) {
					this._activeTabHeaderElement.setFocus();
				}

				// Scroll to new content item and set it as active,
				// if changeTab deosn't come from drag/scroll
				if (triggeredByObserver === false) {
					this._scrollToTargetContent(newContentItem);
				}
			}
			// Update active indicator
			this._handleTabIndicator();

			// Update configs
			this.configs.StartingTab = newTabIndex;

			// Trigger platform event
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
		 * @param {Callbacks.OSOnChangeEvent} callback
		 * @memberof Tabs
		 */
		public registerCallback(callback: Callbacks.OSOnChangeEvent): void {
			if (this._platformEventTabsOnChange === undefined) {
				this._platformEventTabsOnChange = callback;
			} else {
				console.warn(`The ${GlobalEnum.PatternName.Tabs} already has the tabs change callback set.`);
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
				// Add class to prevent enable overflow-x
				Helper.Dom.Styles.AddClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.HasDragGestures);
				this._hasDragGestures = true;
				// Set observer on each contentItem to detect current content being intersected
				this._setDragObserver();
				// If the gestures were already added
			} else if (this._hasDragGestures) {
				// Remove class to prevent overflow-x
				Helper.Dom.Styles.RemoveClass(this._selfElem, Patterns.Tabs.Enum.CssClasses.HasDragGestures);
				this._hasDragGestures = false;
				// Disconnect observer
				this._unsetDragObserver();
			}
		}
	}
}
