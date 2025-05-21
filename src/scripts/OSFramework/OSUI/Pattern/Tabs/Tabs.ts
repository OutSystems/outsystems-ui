// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs {
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
		// Store the number of headerItems to be used to set the css variable
		private _headerItemsLength: number;
		// Store the onTabsChange platform callback
		private _platformEventTabsOnChange: Callbacks.OSOnChangeEvent;
		// Store the id of the requestAnimationFrame called to animate the indicator
		private _requestAnimationFrameOnIndicatorResize: number;
		// Store the contentItems wrapper -- osui-tabs__content
		private _tabsContentElement: HTMLElement;
		// Store the headerItems wrapper -- osui-tabs__header
		private _tabsHeaderElement: HTMLElement;
		// Store the tabs header enabled elements
		private _tabsHeadersEnabled: Array<Patterns.TabsHeaderItem.ITabsHeaderItem>;
		// Store the tabs-indicator element -- osui-tabs_indicator
		private _tabsIndicatorElement: HTMLElement;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new TabsConfig(configs));

			// Check if running on native shell, to enable drag gestures
			this._hasDragGestures =
				Helper.DeviceInfo.IsNative && this.configs.TabsOrientation === GlobalEnum.Orientation.Horizontal;
		}

		// Method that it's called whenever a new TabsContentItem is rendered

		private _addContentItem(tabsContentChildItem: Patterns.TabsContentItem.TabsContentItem): void {
			if (this.getChild(tabsContentChildItem.uniqueId)) {
				throw new Error(
					`${ErrorCodes.Tabs.FailSetNewChildContentItem}: There is already a ${GlobalEnum.PatternName.TabsContentItem} under Id: '${tabsContentChildItem.widgetId}' added to ${GlobalEnum.PatternName.Tabs} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(tabsContentChildItem);
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
			this.selfElement.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventOnHeaderKeypress);

			// Add event listener for window resize, to update active indicator size
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				Event.DOMEvents.Listeners.Type.WindowResize,
				this._eventOnResize
			);

			// Add orientationchange listener to update active indicator size, on touch devices
			if (Helper.DeviceInfo.IsPhone || Helper.DeviceInfo.IsTablet) {
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					Event.DOMEvents.Listeners.Type.OrientationChange,
					this._eventOnResize
				);
			}
		}

		// Method that it's called whenever a new TabsHeaderItem is rendered
		private _addHeaderItem(tabsHeaderChildItem: Patterns.TabsHeaderItem.TabsHeaderItem): void {
			if (this.getChild(tabsHeaderChildItem.uniqueId)) {
				throw new Error(
					`${ErrorCodes.Tabs.FailSetNewChildHeaderItem}: There is already a ${GlobalEnum.PatternName.TabsHeaderItem} under Id: '${tabsHeaderChildItem.widgetId}' added to ${GlobalEnum.PatternName.Tabs} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(tabsHeaderChildItem);
			}

			this._headerItemsLength = this.getChildItems(Enum.ChildTypes.TabsHeaderItem).length;
			const currentIndex = this._headerItemsLength - 1;

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

				this._setHeaderItemsCustomProperty(this._headerItemsLength);

				// Update indicator size
				this._handleTabIndicator();
			} else {
				// Otherwise are items created before the tabs is built
				// Set the correct data-tab, by using the items array, that correspond to the DOM order
				tabsHeaderChildItem.setDataTab(currentIndex);
			}
		}

		// Method to change the active content item
		private _changeActiveContentItem(newTabIndex: number, triggeredByObserver: boolean): void {
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

			// Set focus on the new active header element when running on a device with drag gestures
			// and the tabs are built to make sure if only runs after the tabs are built
			if (this._hasDragGestures && this.isBuilt) {
				this._activeTabHeaderElement.setFocus();
			}

			// Scroll to new content item and set it as active,
			// if changeTab doesn't come from drag/scroll
			if (triggeredByObserver === false) {
				this._scrollToTargetContent(newContentItem);
			}
		}

		// Method to change the active header item
		private _changeActiveHeaderItem(newHeaderItem: TabsHeaderItem.ITabsHeaderItem): void {
			// Remove old headerItem as active
			if (this._activeTabHeaderElement) {
				this._activeTabHeaderElement?.unsetIsActive();
			}

			if (newHeaderItem) {
				// Set new headerItem as active
				newHeaderItem.setIsActive();
				this._activeTabHeaderElement = newHeaderItem;
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
			let currentTabHeader: number;
			let targetHeaderItemIndex: number;

			// Check if PageDown or PageUp key have been pressed inside any of the TabsContent items
			if (
				(e.target as HTMLElement).closest(`${Constants.Dot}${Enum.CssClasses.TabsContent}`) ===
					this._tabsContentElement &&
				(e.key === GlobalEnum.Keycodes.PageDown || e.key === GlobalEnum.Keycodes.PageUp)
			) {
				/** Due to an issue at Windows when if there is an item such as a textarea inside TabsContent and if
				 * there are at least 3 TabsContent when 2nd TabsContent is active and textarea is focused, when PageDown or
				 * PageUp keys are pressed it will ends up on an visual issue. */
				e.preventDefault();
				return;
			}

			// Check if target is the header, to do not change tab on x arrow press
			if (e.target !== this._activeTabHeaderElement?.selfElement) {
				return;
			}

			switch (e.key) {
				case GlobalEnum.Keycodes.ArrowRight:
					// Get the index of active tab header for target index calculation
					currentTabHeader = this._tabsHeadersEnabled.indexOf(this._activeTabHeaderElement);

					// Set the target index element based on enabled tabs header elements
					targetHeaderItemIndex =
						this._tabsHeadersEnabled[currentTabHeader + 1] === undefined
							? this._tabsHeadersEnabled[0].getDataTab()
							: this._tabsHeadersEnabled[currentTabHeader + 1].getDataTab();

					this.changeTab(targetHeaderItemIndex, undefined, true);

					break;
				case GlobalEnum.Keycodes.ArrowLeft:
					// Get the index of active tab header for target index
					currentTabHeader = this._tabsHeadersEnabled.indexOf(this._activeTabHeaderElement);

					// Set the target index element based on enabled tabs header elements
					targetHeaderItemIndex =
						this._tabsHeadersEnabled[currentTabHeader - 1] === undefined
							? this._tabsHeadersEnabled[this._tabsHeadersEnabled.length - 1].getDataTab()
							: this._tabsHeadersEnabled[currentTabHeader - 1].getDataTab();

					this.changeTab(targetHeaderItemIndex, undefined, true);
					break;
				case GlobalEnum.Keycodes.End:
				case GlobalEnum.Keycodes.PageDown:
					// Set the last enabled tabs header
					targetHeaderItemIndex = this._tabsHeadersEnabled[this._tabsHeadersEnabled.length - 1].getDataTab();

					this.changeTab(targetHeaderItemIndex, undefined, true);

					break;
				case GlobalEnum.Keycodes.Home:
				case GlobalEnum.Keycodes.PageUp:
					// Set the first enabled tabs header
					targetHeaderItemIndex = this._tabsHeadersEnabled[0].getDataTab();

					this.changeTab(targetHeaderItemIndex, undefined, true);

					break;
			}

			const targetHeaderItem = this.getChildByIndex(targetHeaderItemIndex, Enum.ChildTypes.TabsHeaderItem);

			// Focus on the new activeHeader, after changeTab
			if (targetHeaderItem) {
				targetHeaderItem.setFocus();
			}
		}

		// Method to adjust the tabs css active item on resize or orientation-change
		private _handleOnResizeEvent(): void {
			this._scrollToTargetContent(this._activeTabContentElement);
			Helper.AsyncInvocation(this._handleTabIndicator.bind(this));
		}

		// Method that handles the indicator size and transition
		private _handleTabIndicator(): void {
			if (this._activeTabHeaderElement?.selfElement) {
				// Check if it comes form a disabled tab, to remove the disable class
				if (
					!Helper.Dom.Attribute.Get(
						this._activeTabHeaderElement.selfElement,
						GlobalEnum.HTMLAttributes.Disabled
					)
				) {
					Helper.Dom.Attribute.Remove(this._tabsIndicatorElement, GlobalEnum.HTMLAttributes.Disabled);
				}

				const _isVertical = this.configs.TabsOrientation === GlobalEnum.Orientation.Vertical;
				const _activeElement = this._activeTabHeaderElement.selfElement;

				// Get transform value based on orientation and rtl value
				const _transformValue = _isVertical
					? _activeElement.offsetTop
					: OutSystems.OSUI.Utils.GetIsRTL()
						? -(
								this._tabsHeaderElement.offsetWidth -
								_activeElement.offsetLeft -
								_activeElement.offsetWidth
							)
						: _activeElement.offsetLeft;

				// Get the actual size of the current tabsHeader
				const _elementRect = _activeElement.getBoundingClientRect();

				// Set the final size, based on orientation
				const _finalSize = _isVertical ? _elementRect.height : _elementRect.width;

				// Update the css variables, that will trigger a transform transition
				function updateIndicatorUI() {
					if (this._tabsIndicatorElement) {
						// Apply transform: translate
						Helper.Dom.Styles.SetStyleAttribute(
							this._tabsIndicatorElement,
							Enum.CssProperty.TabsIndicatorTransform,
							_transformValue + GlobalEnum.Units.Pixel
						);

						// Set indicator size
						Helper.Dom.Styles.SetStyleAttribute(
							this._tabsIndicatorElement,
							Enum.CssProperty.TabsIndicatorSize,
							Math.floor(_finalSize) + GlobalEnum.Units.Pixel
						);
					} else {
						cancelAnimationFrame(this._requestAnimationFrameOnIndicatorResize);
					}
				}

				this._requestAnimationFrameOnIndicatorResize = requestAnimationFrame(updateIndicatorUI.bind(this));

				// If at this moment the active item has no size (NaN), set an observer to run this method when its size is changed
				// This happens, as an example, when there're tabs inside tabs, and inner one has no size when it's built, due to being on a non-active tab
				if (Number.isNaN(_finalSize) || _finalSize === 0) {
					const resizeObserver = new ResizeObserver((entries) => {
						for (const entry of entries) {
							if (entry.contentBoxSize) {
								this._handleTabIndicator();
								// We just need this once, so lets remove the observer
								resizeObserver.unobserve(_activeElement);
							}
						}
					});
					resizeObserver.observe(_activeElement);
				}
			}
		}

		// Method to make neccessary preparations for header and content items, that can't be done on their scope
		private _prepareHeaderAndContentItems(): void {
			// Make more visible the error message, if the user is trying to use the Tabs without any content or header item
			// without being too intrusive
			if (
				this.getChildItems(Enum.ChildTypes.TabsContentItem).length === 0 ||
				this.getChildItems(Enum.ChildTypes.TabsHeaderItem).length === 0
			) {
				console.warn(
					`${ErrorCodes.Tabs.FailNoContentOrHeaderItemFound}: To ensure predictable behavior and avoid runtime issues, the ${GlobalEnum.PatternName.Tabs} component under uniqueId: '${this.uniqueId}' is designed to include at least one ${GlobalEnum.PatternName.TabsHeaderItem} and one ${GlobalEnum.PatternName.TabsContentItem}.`
				);
			}

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

			// Set the list of enabled TabsHeaders
			this._updateListOfEnabledTabsHeader();
		}

		// Method that it's called whenever a new TabsContentItem is destroyed
		private _removeContentItem(childContentId: string): void {
			const childContentItem = this.getChild(childContentId) as TabsContentItem.ITabsContentItem;
			let auxIndex: number;

			// Check if the given ChildId exist at childList
			if (childContentItem) {
				auxIndex = this.getChildIndex(childContentId);
				// Remove item
				this.unsetChild(childContentId);
			} else {
				throw new Error(
					`${ErrorCodes.Tabs.FailUnsetNewChildContentItem}: The ${GlobalEnum.PatternName.TabsContentItem} under uniqueId: '${childContentId}' does not exist as a ${GlobalEnum.PatternName.TabsContentItem} from ${GlobalEnum.PatternName.Tabs} with Id: ${this.widgetId}.`
				);
			}

			// Unobserve this item on the IntersectionObserver
			if (this._hasDragGestures) {
				childContentItem.unobserveDragObserver(this._dragObserver);
			}

			const wasActive = childContentItem.IsActive;

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
			Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				Event.DOMEvents.Listeners.Type.WindowResize,
				this._eventOnResize
			);

			// Remove orientationchange listener
			if (Helper.DeviceInfo.IsPhone || Helper.DeviceInfo.IsTablet) {
				Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
					Event.DOMEvents.Listeners.Type.OrientationChange,
					this._eventOnResize
				);
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
					`${ErrorCodes.Tabs.FailUnsetNewChildHeaderItem}: The ${GlobalEnum.PatternName.TabsHeaderItem} under uniqueId: '${childHeaderId}' does not exist as a ${GlobalEnum.PatternName.TabsHeaderItem} from ${GlobalEnum.PatternName.Tabs} with Id: ${this.widgetId}.`
				);
			}

			this._headerItemsLength = this._headerItemsLength - 1;

			if (this.isBuilt) {
				// Update CSS Variable, as an item was removed
				this._setHeaderItemsCustomProperty(this._headerItemsLength);
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
				}

				// Update scale size variable
				Helper.AsyncInvocation(this._handleTabIndicator.bind(this));
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

		// Method to set if the Tabs AutoHeight
		private _setContentAutoHeight(hasAutoHeight: boolean): void {
			if (this.isBuilt) {
				if (this._hasDragGestures === false) {
					if (hasAutoHeight) {
						Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClasses.HasContentAutoHeight);
					} else {
						Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClasses.HasContentAutoHeight);
					}
				} else {
					console.warn(
						`Tabs (${this.widgetId}): changes to ${Enum.Properties.ContentAutoHeight} parameter do not affect tabs when Gestures are in use.`
					);
				}
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
		private _setHeaderItemsCustomProperty(itemsLength: number): void {
			// Create css variable
			Helper.Dom.Styles.SetStyleAttribute(this.selfElement, Enum.CssProperty.TabsHeaderItems, itemsLength);
		}

		// Method to set the Tabs Height
		private _setHeight(height: string): void {
			if (this.isBuilt) {
				// Set tabs overflow based on height
				const tabsOverflow =
					height === GlobalEnum.CssProperties.Auto || height === Constants.EmptyString
						? GlobalEnum.CssProperties.Initial
						: GlobalEnum.CssProperties.Auto;

				// Create css variables
				Helper.Dom.Styles.SetStyleAttribute(this.selfElement, Enum.CssProperty.TabsHeight, height);
				Helper.Dom.Styles.SetStyleAttribute(
					this.selfElement,
					Enum.CssProperty.TabsContentItemOverflow,
					tabsOverflow
				);
			}
		}

		// Method to set the initial options on screen load
		private _setInitialOptions(): void {
			// Call necessary methods that avoid layout shift first
			// Set the --tabs-header-items css variable
			this._setHeaderItemsCustomProperty(this.getChildItems(Enum.ChildTypes.TabsHeaderItem).length);
			this._setOrientation(this.configs.TabsOrientation);

			// these don't affect layout shift, can run async to not affect main thread
			Helper.AsyncInvocation(this._setHeight.bind(this), this.configs.Height);
			Helper.AsyncInvocation(this._setPosition.bind(this), this.configs.TabsVerticalPosition);
			Helper.AsyncInvocation(this._setIsJustified.bind(this), this.configs.JustifyHeaders);
			Helper.AsyncInvocation(this._setContentAutoHeight.bind(this), this.configs.ContentAutoHeight);

			if (this._hasDragGestures) {
				Helper.AsyncInvocation(this.toggleDragGestures.bind(this), true);
			}
		}

		// Method to set if the Tabs are justified
		private _setIsJustified(isJustified: boolean): void {
			if (this.isBuilt) {
				if (isJustified) {
					Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClasses.IsJustified);
				} else {
					Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClasses.IsJustified);
				}
				// Update scale size variable
				this._handleTabIndicator();
			}
		}

		// Method to set the Tabs Orientation
		private _setOrientation(orientation: GlobalEnum.Orientation): void {
			Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClasses.Modifier + this._currentOrientation);
			Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClasses.Modifier + orientation);
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
			if (this.isBuilt) {
				Helper.Dom.Styles.RemoveClass(
					this.selfElement,
					Enum.CssClasses.Modifier + this._currentVerticalPositon
				);
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClasses.Modifier + position);

				this._currentVerticalPositon = position;
			}
		}

		// Toggles the TableHeaderItem disabled status
		private _setTabHeaderItemDisabledStatus(childHeaderId: string, isDisabled: boolean): void {
			const _tabHeaderItemElement = Helper.Dom.GetElementByUniqueId(childHeaderId);
			const _tabItemIndex = this.getChildIndex(childHeaderId);
			const _tabContentItemId = this.getChildByIndex(
				this._hasSingleContent ? 0 : _tabItemIndex,
				Enum.ChildTypes.TabsContentItem
			).widgetId;
			const _tabContentItemElement = Helper.Dom.GetElementById(_tabContentItemId);

			const isTabHeaderItemDisabled = Helper.Dom.Attribute.Get(
				_tabHeaderItemElement,
				GlobalEnum.HTMLAttributes.Disabled
			);

			if (isDisabled) {
				let _allTabsDisabled = false;
				Helper.Dom.Attribute.Set(_tabHeaderItemElement, GlobalEnum.HTMLAttributes.Disabled, 'true');

				if (this._hasSingleContent) {
					// Check if all tabs items are now disable
					_allTabsDisabled = this.getChildItems().every((tabHeaderItem) =>
						tabHeaderItem.selfElement.getAttribute(GlobalEnum.HTMLAttributes.Disabled)
					);
				}

				if (this._hasSingleContent === false || _allTabsDisabled) {
					// Let's hide TabContentItem, to prevent it appears when the tabs are swippable or when single contentItem is used and all headerItems are disable
					Helper.Dom.Styles.SetStyleAttribute(
						_tabContentItemElement,
						GlobalEnum.InlineStyle.Display,
						GlobalEnum.InlineStyleValue.Display.none
					);
				}
				if (this._activeTabHeaderElement.selfElement === _tabHeaderItemElement) {
					Helper.Dom.Attribute.Set(this._tabsIndicatorElement, GlobalEnum.HTMLAttributes.Disabled, true);
				}
			} else if (!isDisabled && isTabHeaderItemDisabled) {
				Helper.Dom.Attribute.Remove(_tabHeaderItemElement, GlobalEnum.HTMLAttributes.Disabled);

				Helper.Dom.Styles.SetStyleAttribute(
					_tabContentItemElement,
					GlobalEnum.InlineStyle.Display,
					GlobalEnum.InlineStyleValue.Display.contents
				);

				if (this._activeTabHeaderElement.selfElement === _tabHeaderItemElement) {
					Helper.Dom.Attribute.Remove(this._tabsIndicatorElement, GlobalEnum.HTMLAttributes.Disabled);
				}
			}
		}

		// Method to change between tabs
		private _tabHeaderItemHasBeenClicked(childHeaderId: string): void {
			const newHeaderItem = this.getChild(childHeaderId) as TabsHeaderItem.ITabsHeaderItem;

			if (newHeaderItem === undefined) {
				throw new Error(
					`${ErrorCodes.Tabs.FailChildItemClicked}: The ${GlobalEnum.PatternName.TabsHeaderItem} under uniqueId: '${childHeaderId}' does not exist as a ${GlobalEnum.PatternName.TabsHeaderItem} from ${GlobalEnum.PatternName.Tabs} with Id: ${this.widgetId}.`
				);
			}

			this.changeTab(this.getChildIndex(childHeaderId), newHeaderItem, true);
		}

		// Method that triggers the OnTabsChange event
		private _triggerOnChangeEvent(activeTab: number): void {
			if (this._platformEventTabsOnChange !== undefined) {
				this.triggerPlatformEventCallback(this._platformEventTabsOnChange, activeTab);
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

		// Method to update the list of enabled tab headers
		private _updateListOfEnabledTabsHeader(): void {
			this._tabsHeadersEnabled = (
				this.getChildItems(Enum.ChildTypes.TabsHeaderItem) as Patterns.TabsHeaderItem.ITabsHeaderItem[]
			).filter((element) => !(element.selfElement as HTMLButtonElement).disabled);
		}

		/**
		 * Method that adds the necessary attributes and listeners to the Tabs header
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tabs.Tabs
		 */
		protected setA11YProperties(): void {
			if (this.isBuilt) {
				// Set aria-role to TabsHeader
				Helper.A11Y.RoleTabList(this._tabsHeaderElement.firstElementChild as HTMLElement);
				// Set aria-hidden to tabs indicator
				Helper.A11Y.AriaHiddenTrue(this._tabsIndicatorElement);
			}
		}

		/**
		 * Method to set the callbacks and event listeners
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tabs.Tabs
		 */
		protected setCallbacks(): void {
			if (this.isBuilt) {
				this._eventOnHeaderKeypress = this._handleKeypressEvent.bind(this);
				this._eventOnResize = this._handleOnResizeEvent.bind(this);
				this._addEvents();
			}
		}

		/**
		 * Method to assign the html elements to the header and content wrappers
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tabs.Tabs
		 */
		protected setHtmlElements(): void {
			this._tabsHeaderElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClasses.TabsHeader);
			this._tabsContentElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClasses.TabsContent);
			this._tabsIndicatorElement = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClasses.TabsIndicatorElem);
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Tabs.Tabs
		 */
		protected unsetCallbacks(): void {
			// Remove event listeners on tabs header element
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
		 * @memberof OSFramework.Patterns.Tabs.Tabs
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
		public beNotifiedByChild(
			childItem: Patterns.TabsHeaderItem.TabsHeaderItem | Patterns.TabsContentItem.TabsContentItem,
			notifiedTo: Enum.ChildNotifyActionType
		): void {
			switch (notifiedTo) {
				case Enum.ChildNotifyActionType.AddContentItem:
					this._addContentItem(childItem as Patterns.TabsContentItem.TabsContentItem);
					break;
				case Enum.ChildNotifyActionType.AddHeaderItem:
					this._addHeaderItem(childItem as Patterns.TabsHeaderItem.TabsHeaderItem);
					this._updateListOfEnabledTabsHeader();
					break;
				case Enum.ChildNotifyActionType.Click:
					this._tabHeaderItemHasBeenClicked(childItem.uniqueId);
					break;
				case Enum.ChildNotifyActionType.DisabledHeaderItem:
					this._setTabHeaderItemDisabledStatus(childItem.uniqueId, true);
					this._updateListOfEnabledTabsHeader();

					break;
				case Enum.ChildNotifyActionType.EnabledHeaderItem:
					this._setTabHeaderItemDisabledStatus(childItem.uniqueId, false);
					this._updateListOfEnabledTabsHeader();
					break;
				case Enum.ChildNotifyActionType.RemovedContentItem:
					this._removeContentItem(childItem.uniqueId);
					break;
				case Enum.ChildNotifyActionType.RemovedHeaderItem:
					this._removeHeaderItem(childItem.uniqueId);
					this._updateListOfEnabledTabsHeader();
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
		 * Method to build the Tabs
		 *
		 * @memberof OSFramework.Patterns.Tabs.Tabs
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this._setInitialOptions();

			this._prepareHeaderAndContentItems();

			this.changeTab(this.configs.StartingTab);

			// Call following methods async to prevent affecting Main Thread and causing Long Tasks on page load
			Helper.AsyncInvocation(this.setCallbacks.bind(this));
			Helper.AsyncInvocation(this.setA11YProperties.bind(this));

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {*} propertyValue
		 * @memberof OSFramework.Patterns.Tabs.Tabs
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
					case Enum.Properties.ContentAutoHeight:
						this._setContentAutoHeight(propertyValue as boolean);
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
		 * @memberof OSFramework.Patterns.Tabs.Tabs
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
				(tabIndex === this.configs.StartingTab && this.isBuilt && tabsHeaderItem === undefined) ||
				// To prevent changing tab when a dropdown is currently open and that content exists, which would cause UI issues
				this._activeTabContentElement?.selfElement.querySelector(Enum.ElementsBlockingOnChange.Dropdown)
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

			this._changeActiveHeaderItem(newHeaderItem);

			// If there're more than one content item,
			// then do scrollTo and change active content item
			if (this._hasSingleContent === false) {
				this._changeActiveContentItem(newTabIndex, triggeredByObserver);
			}

			Helper.AsyncInvocation(this._handleTabIndicator.bind(this));

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
		 * @memberof OSFramework.Patterns.Tabs.Tabs
		 */
		public dispose(): void {
			this.unsetCallbacks();
			this.unsetHtmlElements();

			// call super method, which deletes this tabs class instance from the TabsMap
			super.dispose();
		}

		/**
		 * Register a given callback event handler.
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 * @memberof OSFramework.Patterns.Tabs.Tabs
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnChange:
					if (this._platformEventTabsOnChange === undefined) {
						this._platformEventTabsOnChange = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
			}
		}

		/**
		 * Method to set the drag gestures necessary configurations
		 *
		 * @param {boolean} addDragGestures
		 * @memberof OSFramework.Patterns.Tabs.Tabs
		 */
		public toggleDragGestures(addDragGestures: boolean): void {
			// If running on native shell
			if (addDragGestures) {
				// Add class to prevent enable overflow-x
				Helper.Dom.Styles.AddClass(this.selfElement, Patterns.Tabs.Enum.CssClasses.HasDragGestures);
				this._hasDragGestures = true;
				// Set observer on each contentItem to detect current content being intersected
				this._setDragObserver();
				// If the gestures were already added
			} else if (this._hasDragGestures) {
				// Remove class to prevent overflow-x
				Helper.Dom.Styles.RemoveClass(this.selfElement, Patterns.Tabs.Enum.CssClasses.HasDragGestures);
				this._hasDragGestures = false;
				// Disconnect observer
				this._unsetDragObserver();
			}
		}
	}
}
