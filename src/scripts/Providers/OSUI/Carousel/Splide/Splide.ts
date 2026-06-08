// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Carousel.Splide {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUISplide
		extends OSFramework.OSUI.Patterns.Carousel.AbstractCarousel<Splide, Splide.SplideConfig>
		implements OSFramework.OSUI.Patterns.Carousel.ICarousel
	{
		// Store if the render callback should be prevented
		private _blockOnRender = false;
		// Store the List widget element
		private _carouselListWidgetElem: HTMLElement;
		// Store the placholder element
		private _carouselPlaceholderElem: HTMLElement;
		// Store the element that will be used to init the provider
		private _carouselProviderElem: HTMLElement;
		// Store the splide__track element from the provider
		private _carouselTrackElem: HTMLElement;
		// Store current carousel index;
		private _currentIndex: number;
		// Store the onResize event
		private _eventOnResize: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Store if a List widget is used inside the CarouselItems placeholder
		private _hasList: boolean;
		// Store the pending list-roles poll timeout id, so it can be cancelled on re-entry
		private _listRolesPollId: number | undefined;
		// Store the onSlideMoved event
		private _platformEventOnSlideMoved: OSFramework.OSUI.Patterns.Carousel.Callbacks.OSOnSlideMovedEvent;
		// Store initial provider options
		private _splideOptions: SplideOpts;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SplideConfig(configs));
		}

		// Method to apply role="list" and role="listitem" to the list element and its direct children.
		// Skips native list elements (ul/ol) and elements whose direct children are native list
		// elements (li/ul/ol), since those already carry implicit list semantics.
		private _applyListRoles(listEl: HTMLElement): void {
			const _isNativeList = listEl.tagName === 'UL' || listEl.tagName === 'OL';
			const _hasNativeListChildren = listEl.querySelector(':scope > li, :scope > ul, :scope > ol') !== null;

			if (_isNativeList || _hasNativeListChildren) {
				return;
			}

			listEl.setAttribute('role', 'list');
			listEl.querySelectorAll(':scope > *').forEach((item) => {
				item.setAttribute('role', 'listitem');
			});
		}

		// Method to wait for the OutSystems List widget to finish loading before applying roles
		private _applyListRolesWhenReady(listEl: HTMLElement): void {
			// Cancel any previously pending poll before starting a new one to prevent loop stacking
			if (this._listRolesPollId !== undefined) {
				clearTimeout(this._listRolesPollId);
				this._listRolesPollId = undefined;
			}

			if (!listEl.classList.contains('list-loading') && listEl.children.length > 0) {
				this._applyListRoles(listEl);
			} else {
				this._listRolesPollId = OSFramework.OSUI.Helper.ApplySetTimeOut(() => {
					this._listRolesPollId = undefined;
					this._applyListRolesWhenReady(listEl);
				}, 100);
			}
		}

		// Method to check if a List Widget is used inside the placeholder and assign the _listWidget variable
		private _checkListWidget(): void {
			this._hasList = OutSystems.OSUI.Utils.GetHasListInside(this._carouselPlaceholderElem);

			if (this._hasList) {
				this._carouselListWidgetElem = this.selfElement.querySelector(
					OSFramework.OSUI.Constants.Dot + OSFramework.OSUI.GlobalEnum.CssClassElements.List
				);

				this._carouselProviderElem = this._carouselTrackElem;
			} else {
				this._carouselProviderElem = this.selfElement;
			}
		}

		// Method to init the provider
		private _initProvider(): void {
			// Init provider
			this.provider = new window.Splide(this._carouselProviderElem, this._splideOptions);

			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: Enum.ProviderInfo.Name,
				version: Enum.ProviderInfo.Version,
				events: this.provider, //this.provider will also contain all the supported lib configs
			});

			// Set the OnInitialized event, before the provider is mounted
			this._setOnInitializedEvent();

			// Set the OnSlideMoved event
			this._setOnSlideMovedEvent();

			// Set initial carousel width
			this._setCarouselWidth();

			// Init the provider — pass a custom extension so list roles are re-applied on every
			// mount cycle, including after provider.refresh() which wipes provider.on() listeners.
			// The extension's mount() runs after all built-in components (including A11y) have
			// already mounted, so Splide's ARIA roles are already set and can be overridden directly.
			this.provider.mount({
				OSUIListRoles: () => {
					return {
						mount: () => {
							this._setListRoles();
						},
					};
				},
			});

			// Update pagination class, in case navigation was changed
			this._togglePaginationClass();
		}

		// Method to add the splide__slide class on each carousel item
		private _prepareCarouselItems(): void {
			// Define the element that has the items. The List widget if dynamic content, otherwise get from the placeholder directly
			const _targetList = this._hasList ? this._carouselListWidgetElem : this._carouselPlaceholderElem;
			// Snapshot into a static array: iterating the live HTMLCollection while mutating the DOM skips nodes
			const _childrenList = Array.from(_targetList.children);

			if (_childrenList.length > 0) {
				// Add the placeholder content already with the correct html structure per item, expected by the library
				for (const item of _childrenList) {
					if (!item.classList.contains(Enum.CssClass.SplideSlide)) {
						// Splide assigns role="presentation" to each splide__slide element, which is then
						// overridden with role="listitem" by the OSUIListRoles extension. Neither role
						// is valid on an <img>. Wrap bare images in a <div> so the role lands on the container.
						if (item.tagName === 'IMG') {
							const wrapper = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Div);
							item.replaceWith(wrapper);
							wrapper.appendChild(item);
							wrapper.classList.add(Enum.CssClass.SplideSlide);
						} else {
							item.classList.add(Enum.CssClass.SplideSlide);
						}
					}
				}
			}
		}

		// Used on resize to refresh provider and redefine the width
		private _redefineCarouselWidth(): void {
			// Update UI on window resize
			// A simple provider refresh is not enough to cover all situations, where the Carousel has no defined fixed width.
			// This method is triggered by the global window resize event, that already has a 100ms timeout, to mitigate the performance impact.
			// Another 500ms were added, to further mitigate the impact

			OSFramework.OSUI.Helper.ApplySetTimeOut(() => {
				// First lets try to do a simple provider refresh, to update the width correctly
				this.provider.refresh();
				// Update width, to be able to properly make the width validation coming next
				this._setCarouselWidth();

				// If that was still not enough, then let's trigger a full redraw
				if (this.selfElement.offsetWidth >= window.innerWidth) {
					this.redraw();
					// This needs to be called again, to update the size one final time, to prevent situation where the Carousel wouldn't assume 100% width
					this._setCarouselWidth();
				} else {
					// refresh() reapplies Splide's default ARIA (e.g. presentation) without firing
					// mounted — e.g. when DevTools toggles and triggers resize. Full redraw remounts and
					// mounted reapplies list roles; after refresh-only we must restore them here.
					this._setListRoles();
				}
			}, 500);
		}

		// Ensure that the splide track maintains the correct width
		private _setCarouselWidth(): void {
			// Update css variable
			OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
				this._carouselTrackElem,
				OSFramework.OSUI.Patterns.Carousel.Enum.CssVariables.CarouselWidth,
				this.selfElement.offsetWidth + OSFramework.OSUI.GlobalEnum.Units.Pixel
			);
		}

		// Method to assign correct ARIA list roles so screen readers interpret carousel lists properly
		private _setListRoles(): void {
			// Remove role="tabpanel" from slides that contain img, ul, ol, or li — elements for
			// which tabpanel ownership is invalid or creates conflicting semantics
			this.selfElement.querySelectorAll(OSFramework.OSUI.Constants.Dot + Enum.CssClass.SplideSlide).forEach((slide) => {
				const _slideEl = slide as HTMLElement;
				if (
					OSFramework.OSUI.Helper.Dom.Attribute.Get(_slideEl, OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName) === OSFramework.OSUI.Constants.A11YAttributes.Role.TabPanel &&
					_slideEl.querySelector('img, ul, ol, li')
				) {
					OSFramework.OSUI.Helper.Dom.Attribute.Remove(_slideEl, OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName);
				}
			});

			if (this._hasList && this._carouselListWidgetElem) {
				// Dynamic content: poll until the List widget finishes loading before applying roles
				this._applyListRolesWhenReady(this._carouselListWidgetElem);
			} else {
				// Static content: apply roles directly to the splide__list element
				const splideList = OSFramework.OSUI.Helper.Dom.ClassSelector(
					this.selfElement,
					Enum.CssClass.SplideList
				);
				if (splideList) {
					this._applyListRoles(splideList);
				}
			}
		}

		// Method to set the OnInitializeEvent
		private _setOnInitializedEvent(): void {
			this.provider.on(Enum.SpliderEvents.Mounted, () => {
				this.triggerPlatformInitializedEventCallback();
			});
		}

		// Method to set the OnSlideMoved event
		private _setOnSlideMovedEvent(): void {
			this.provider.on(Enum.SpliderEvents.Moved, (index) => {
				if (index !== this._currentIndex) {
					this.triggerPlatformEventCallback(this._platformEventOnSlideMoved, index);
					this._currentIndex = index;
				}
			});
		}

		// Method to toggle class when pagination is present
		private _togglePaginationClass(): void {
			// If Dots is being used, add a class, to be able to change container padding-bottom on these conditions
			if (
				this.configs.Navigation === OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.Dots ||
				this.configs.Navigation === OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.Both
			) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(
					this.selfElement,
					OSFramework.OSUI.Patterns.Carousel.Enum.CssClass.HasPagination
				);
			} else {
				OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
					this.selfElement,
					OSFramework.OSUI.Patterns.Carousel.Enum.CssClass.HasPagination
				);
			}
		}

		/**
		 * Method that encapsulates all methods needed to create a new Carousel
		 *
		 * @protected
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		protected prepareConfigs(): void {
			this._prepareCarouselItems();
			// Call the following methods here, so that all DOM elements are iterated and ready to init the library
			this._splideOptions = this.configs.getProviderConfig();
			// Init the Library
			this._initProvider();
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		protected setA11YProperties(): void {
			console.warn(OSFramework.OSUI.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Sets the callbacks to be used.
		 *
		 * @protected
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		protected setCallbacks(): void {
			this._eventOnResize = this._redefineCarouselWidth.bind(this);

			// Add event listener for window resize
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowResize,
				this._eventOnResize
			);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		protected setHtmlElements(): void {
			this._carouselPlaceholderElem = OSFramework.OSUI.Helper.Dom.ClassSelector(
				this.selfElement,
				OSFramework.OSUI.Patterns.Carousel.Enum.CssClass.Content
			);
			this._carouselTrackElem = OSFramework.OSUI.Helper.Dom.ClassSelector(
				this.selfElement,
				OSFramework.OSUI.Patterns.Carousel.Enum.CssClass.Track
			);
		}

		/**
		 * Method to set the initial CSS Classes
		 *
		 * @protected
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		protected setInitialCssClasses(): void {
			// If using Carousel with a List, get one level below on the HTML, so that the List element is used on the structure expected by the library
			// In this case, the osui-carousel won't be used, and the library will be mounted on the osui-carousel_track
			if (this._hasList) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(this._carouselTrackElem, Enum.CssClass.SplideWrapper);
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(this._carouselPlaceholderElem, Enum.CssClass.SplideTrack);
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(this._carouselListWidgetElem, Enum.CssClass.SplideList);
			} else {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.SplideWrapper);
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(this._carouselTrackElem, Enum.CssClass.SplideTrack);
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(this._carouselPlaceholderElem, Enum.CssClass.SplideList);
			}

			this._togglePaginationClass();
		}

		/**
		 * Unsets the callbacks.
		 *
		 * @protected
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		protected unsetCallbacks(): void {
			// remove event listener
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowResize,
				this._eventOnResize
			);

			this._eventOnResize = undefined;
			this._platformEventOnSlideMoved = undefined;
			super.unsetCallbacks();
		}

		/**
		 * Unsets the HTML elements.
		 *
		 * @protected
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		protected unsetHtmlElements(): void {
			this._carouselPlaceholderElem = undefined;
			this._carouselTrackElem = undefined;
		}

		/**
		 * Build the pattern.
		 *
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setCallbacks();

			this._checkListWidget();

			this.setInitialCssClasses();

			this.prepareConfigs();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// Block UpdateOnRender to avoid multiple triggers of provider.refresh()
				this.toggleOnRender(true);

				switch (propertyName) {
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.StartingPosition:
						console.warn(
							`Carousel (${this.widgetId}): changes to ${OSFramework.OSUI.Patterns.Carousel.Enum.Properties.StartingPosition} parameter do not affect the carousel. Use the client action 'CarouselGoTo' to change the current item.`
						);
						break;
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.Navigation:
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.AutoPlay:
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.Loop:
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.ItemsDesktop:
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.ItemsTablet:
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.ItemsPhone:
						this.redraw();
						break;
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.Height:
						this.provider.options = { height: propertyValue as string | number };
						break;
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.Padding:
						this.provider.options = { padding: propertyValue as string | number };
						break;
					case OSFramework.OSUI.Patterns.Carousel.Enum.Properties.ItemsGap:
						this.provider.options = { gap: propertyValue as string | number };
						break;
				}
			}

			// Unblock UpdateOnRender so that it is able to update on DOM changes inside Carousel content
			OSFramework.OSUI.Helper.AsyncInvocation(this.toggleOnRender.bind(this), false);
		}

		/**
		 * Method to remove and destroy Carousel Splide instance
		 *
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public dispose(): void {
			// Cancel any pending list-roles poll to prevent it firing after disposal
			if (this._listRolesPollId !== undefined) {
				clearTimeout(this._listRolesPollId);
				this._listRolesPollId = undefined;
			}

			// Check if provider is ready
			if (this.isBuilt) {
				this.provider.destroy();
			}

			this.unsetCallbacks();
			this.unsetHtmlElements();

			super.dispose();
		}

		/**
		 * Method to call the go API from the provider
		 *
		 * @param {number} index
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public goTo(index: number): void {
			this.provider.go(index);
		}

		/**
		 * Method to call the go API from the provider. With '>' it will go to the next page
		 *
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public next(): void {
			this.provider.go(Enum.Go.Next);
		}

		/**
		 * Method to call the go API from the provider. With '<' it will go to the previous page
		 *
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public previous(): void {
			this.provider.go(Enum.Go.Previous);
		}

		/**
		 * Set callbacks for the onChange event
		 *
		 * @param {string} eventName
		 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.OSUI.Patterns.Carousel.Enum.CarouselEvents.OnSlideMoved:
					this._platformEventOnSlideMoved = callback;
					break;
				default:
					super.registerCallback(eventName, callback);
					break;
			}
		}

		public setCarouselDirection(direction: string): void {
			if (
				direction === OSFramework.OSUI.Patterns.Carousel.Enum.Direction.None &&
				OutSystems.OSUI.Utils.GetIsRTL()
			) {
				this.configs.Direction = OSFramework.OSUI.GlobalEnum.Direction.RTL;
			} else if (
				direction === OSFramework.OSUI.Patterns.Carousel.Enum.Direction.RightToLeft &&
				this.configs.AutoPlay
			) {
				this.configs.Direction = OSFramework.OSUI.GlobalEnum.Direction.RTL;
			} else {
				this.configs.Direction = OSFramework.OSUI.GlobalEnum.Direction.LTR;
			}

			this.redraw();
		}

		/**
		 * Method used to set all the extended Splide properties across the different types of instances
		 *
		 * @param {SplideOpts} newConfigs
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public setProviderConfigs(newConfigs: SplideOpts): void {
			this.configs.setExtensibilityConfigs(newConfigs);
			this.redraw();
			super.setProviderConfigs(newConfigs);
		}

		/**
		 * Method to call the option API from the provider to toggle drag events
		 *
		 * @param {boolean} hasDrag
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public toggleDrag(hasDrag: boolean): void {
			this.provider.options = { drag: hasDrag };
		}

		/**
		 * Method to toggle the _blockOnRender that enables/disables the OnRender update
		 *
		 * @param {boolean} blockOnRender
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public toggleOnRender(blockOnRender: boolean): void {
			this._blockOnRender = blockOnRender;
		}

		/**
		 * Method to run when there's a platform onRender
		 *
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		public updateOnRender(): void {
			if (this._blockOnRender === false) {
				this.setInitialCssClasses();

				// Check if provider is ready
				if (typeof this.provider === 'object') {
					// Keep same position after update
					// Check autoplay config, as that triggers the provider onChange and our onRender event, but doesn't udpate the _currentIndex property.
					if (this._currentIndex !== undefined || this.configs.AutoPlay === true) {
						this.configs.StartingPosition = this.provider.index;
					}

					this.redraw();
				}
			} else if (this._hasList && this._carouselListWidgetElem) {
				// Even when redraw is blocked (e.g. during a changeProperty call), re-apply list roles
				// in case the List widget refreshed its content and replaced DOM nodes that had the roles.
				this._applyListRolesWhenReady(this._carouselListWidgetElem);
			}
		}
	}
}
