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
		// Store the hidden aria-live status element used to announce the active slide
		private _a11yStatusElem: HTMLElement;
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
		// Ensure the bare-image host-wrapper warning is logged only once per instance
		private _hasWarnedBareImageSlides = false;
		// Store the pending list-roles poll timeout id, so it can be cancelled on re-entry
		private _listRolesPollId: number | undefined;
		// Store the onSlideMoved event
		private _platformEventOnSlideMoved: OSFramework.OSUI.Patterns.Carousel.Callbacks.OSOnSlideMovedEvent;
		// Store initial provider options
		private _splideOptions: SplideOpts;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SplideConfig(configs));
		}

		// Announce the active slide via the hidden aria-live status element
		private _announceActiveSlide(): void {
			if (this._a11yStatusElem === undefined) {
				return;
			}

			const activeSlide = this._resolveActiveSlideElem();
			if (activeSlide === undefined) {
				return;
			}

			const ariaLabel = OSFramework.OSUI.Helper.Dom.Attribute.Get(
				activeSlide,
				OSFramework.OSUI.Constants.A11YAttributes.Aria.Label
			);

			if (ariaLabel) {
				this._a11yStatusElem.textContent = ariaLabel;
			}
		}

		// Method to apply role="list" and role="listitem" to the list element and its direct children.
		// Skips native list elements (ul/ol) and elements whose direct children are native list
		// elements (li/ul/ol), since those already carry implicit list semantics. Also skips lists
		// with bare <img> slides: ARIA in HTML (and axe) disallow role="listitem" on <img>, and
		// wrapping/reparenting those nodes is off-limits (ROU-12937). Callers should wrap each
		// image in a platform-owned host (Container/Block); when that host is missing we warn once
		// and fall back to image semantics + aria-current / live status for selection feedback.
		private _applyListRoles(listEl: HTMLElement): void {
			const _isNativeList = listEl.tagName === 'UL' || listEl.tagName === 'OL';
			const _hasNativeListChildren =
				OSFramework.OSUI.Helper.Dom.TagSelector(listEl, ':scope > li, :scope > ul, :scope > ol') !== undefined;
			// Direct-child <img> slides only — a wrapped image (div > img) must still get list roles,
			// so the selector is scoped with ':scope >' instead of matching any descendant.
			const _hasImageSlides = OSFramework.OSUI.Helper.Dom.TagSelector(listEl, ':scope > img') !== undefined;

			if (_hasImageSlides) {
				this._warnBareImageSlidesNeedHost();
			}

			if (_isNativeList || _hasNativeListChildren || _hasImageSlides) {
				// Content can change across platform refreshes (e.g. List widget data) — drop a list
				// role applied on a previous pass so it never wraps children that aren't list items
				if (
					_hasImageSlides &&
					OSFramework.OSUI.Helper.Dom.Attribute.Get(
						listEl,
						OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName
					) === OSFramework.OSUI.Constants.A11YAttributes.Role.List
				) {
					OSFramework.OSUI.Helper.Dom.Attribute.Remove(
						listEl,
						OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName
					);
				}
			} else {
				OSFramework.OSUI.Helper.A11Y.RoleList(listEl);
				OSFramework.OSUI.Helper.Dom.TagSelectorAll(listEl, ':scope > *')?.forEach((slide) =>
					OSFramework.OSUI.Helper.A11Y.RoleListitem(slide as HTMLElement)
				);
			}

			// List-widget polls can re-apply roles asynchronously; keep aria-current in sync
			this._syncActiveSlideAriaCurrent();
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

		// Resolve the true active (non-clone) slide element from the DOM (post-Splide update)
		private _getActiveSlideElem(): HTMLElement {
			return OSFramework.OSUI.Helper.Dom.TagSelector(
				this.selfElement,
				OSFramework.OSUI.Constants.Dot +
					Enum.CssClass.SplideSlide +
					OSFramework.OSUI.Constants.Dot +
					Enum.CssClass.SplideSlideActive +
					':not(' +
					OSFramework.OSUI.Constants.Dot +
					Enum.CssClass.SplideSlideClone +
					')'
			);
		}

		// Resolve slide by Splide index — safe inside Moved handlers that run before .is-active updates.
		private _getSlideElemByIndex(index: number): HTMLElement {
			const slides = this.provider?.Components?.Slides;
			if (slides === undefined) {
				return undefined;
			}

			const original = slides.get(true)?.find((slide) => slide.index === index);
			return original?.slide ?? slides.getAt(index)?.slide;
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

			// Init the provider — pass a custom extension so a11y is re-applied on every mount
			// cycle, including after provider.refresh() which wipes provider.on() listeners.
			// The extension's mount() runs after all built-in components (including A11y) have
			// already mounted, so Splide's ARIA roles are already set and can be overridden directly.
			this.provider.mount({
				OSUIListRoles: () => {
					return {
						mount: () => {
							this.setA11YProperties();
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
					if (
						!OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
							item as HTMLElement,
							Enum.CssClass.SplideSlide
						)
					) {
						// Never create or move platform-owned nodes here: reparenting an <img>
						// (e.g. wrapping it in a <div>) invalidates React's fiber bookkeeping and crashes
						// the next reconcile with NotFoundError on removeChild. Only mutate classes;
						// invalid ARIA roles on <img> slides are stripped in setA11YProperties.
						OSFramework.OSUI.Helper.Dom.Styles.AddClass(item as HTMLElement, Enum.CssClass.SplideSlide);
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
					// mounted reapplies a11y; after refresh-only we must restore them here.
					this.setA11YProperties();
				}
			}, 500);
		}

		// Resolve via provider.index (or explicit index); fall back to .is-active when unavailable
		private _resolveActiveSlideElem(activeIndex?: number): HTMLElement {
			const index = activeIndex ?? this.provider.index;

			if (index !== undefined && index !== null && this.provider?.Components?.Slides) {
				const slideByIndex = this._getSlideElemByIndex(index);
				if (slideByIndex) {
					return slideByIndex;
				}
			}

			return this._getActiveSlideElem();
		}

		// Ensure a persistent, visually-hidden aria-live status element exists for slide announcements
		private _setA11yStatusElem(): void {
			if (this._a11yStatusElem === undefined) {
				this._a11yStatusElem = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Div);
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(
					this._a11yStatusElem,
					OSFramework.OSUI.Constants.AccessibilityHideElementClass
				);
				this.selfElement.appendChild(this._a11yStatusElem);
			}

			OSFramework.OSUI.Helper.A11Y.RoleStatus(this._a11yStatusElem);
			OSFramework.OSUI.Helper.A11Y.AriaLivePolite(this._a11yStatusElem);
			OSFramework.OSUI.Helper.A11Y.AriaAtomicTrue(this._a11yStatusElem);
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
			// Remove role="tabpanel" from slides that are native list elements (ul/ol/li) — the same
			// cases where _applyListRoles skips custom roles, so nothing overrides the conflicting
			// tabpanel afterwards
			this.selfElement
				.querySelectorAll(OSFramework.OSUI.Constants.Dot + Enum.CssClass.SplideSlide)
				.forEach((slide) => {
					const _slideEl = slide as HTMLElement;
					// Bare <img> slides must not carry an explicit role: ARIA in HTML disallows
					// listitem/group/tabpanel on <img> (axe: "ARIA role listitem is not allowed"),
					// and role="presentation" would remove the image from the a11y tree. Stripping
					// the role keeps the image announced via its accessible name (aria-label/alt).
					if (_slideEl.tagName === 'IMG') {
						OSFramework.OSUI.Helper.Dom.Attribute.Remove(
							_slideEl,
							OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName
						);
						return;
					}
					if (
						OSFramework.OSUI.Helper.Dom.Attribute.Get(
							_slideEl,
							OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName
						) === OSFramework.OSUI.Constants.A11YAttributes.Role.TabPanel &&
						['UL', 'OL', 'LI'].includes(_slideEl.tagName)
					) {
						OSFramework.OSUI.Helper.Dom.Attribute.Remove(
							_slideEl,
							OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName
						);
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

			// Keep aria-current aligned after every list-role re-application point (mount, refresh, redraw)
			this._syncActiveSlideAriaCurrent();
		}

		// Method to set the OnInitializeEvent
		private _setOnInitializedEvent(): void {
			this.provider.on(Enum.SpliderEvents.Mounted, () => {
				this.triggerPlatformInitializedEventCallback();
			});
		}

		// Method to set the OnSlideMoved event
		private _setOnSlideMovedEvent(): void {
			// Registered before mount, so this runs before Splide updates .is-active — always use
			// the event index (via Slides.getAt) instead of querying .is-active in the DOM.
			this.provider.on(Enum.SpliderEvents.Moved, (index) => {
				if (index !== this._currentIndex) {
					this.triggerPlatformEventCallback(this._platformEventOnSlideMoved, index);
					this._currentIndex = index;

					OSFramework.OSUI.Helper.AsyncInvocation(() => {
						this._syncActiveSlideAriaCurrent();

						// Suppress announcements while autoplay is playing
						if (this.provider.Components.Autoplay.isPaused()) {
							this._announceActiveSlide();
						}
					});
				}
			});
		}

		// Set aria-current on the active non-clone slide and clear it from every other slide
		private _syncActiveSlideAriaCurrent(): void {
			this.selfElement
				.querySelectorAll(OSFramework.OSUI.Constants.Dot + Enum.CssClass.SplideSlide)
				.forEach((slide) =>
					OSFramework.OSUI.Helper.Dom.Attribute.Remove(
						slide as HTMLElement,
						OSFramework.OSUI.Constants.A11YAttributes.Aria.Current.prop
					)
				);

			const activeSlide = this._resolveActiveSlideElem();
			if (activeSlide) {
				OSFramework.OSUI.Helper.Dom.Attribute.Set(
					activeSlide,
					OSFramework.OSUI.Constants.A11YAttributes.Aria.Current.prop,
					OSFramework.OSUI.Constants.A11YAttributes.States.True
				);
			}
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

		// Warn once when bare <img> slides lack a platform-owned host for listitem semantics
		private _warnBareImageSlidesNeedHost(): void {
			if (this._hasWarnedBareImageSlides) {
				return;
			}

			this._hasWarnedBareImageSlides = true;
			console.warn(`Carousel (${this.widgetId}): ${Enum.WarningMessages.BareImageSlidesNeedHost}`);
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
		 * Apply all Carousel ARIA attributes (status live region, list roles, aria-current).
		 * Invoked after Splide mount/refresh and whenever slide state changes.
		 *
		 * @protected
		 * @memberof Providers.OSUI.Carousel.Splide.OSUISplide
		 */
		protected setA11YProperties(): void {
			this._setA11yStatusElem();
			this._setListRoles();

			// Splide emits mounted/ready after our sync and clearsaria-current via Slide.updateActivity when isNavigation is false — re-apply after.
			OSFramework.OSUI.Helper.AsyncInvocation(() => {
				this._syncActiveSlideAriaCurrent();
			});
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

			if (this._a11yStatusElem) {
				this._a11yStatusElem.remove();
				this._a11yStatusElem = undefined;
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
				// Even when redraw is blocked (e.g. during a changeProperty call), re-apply a11y
				// in case the List widget refreshed its content and replaced DOM nodes that had roles.
				this.setA11YProperties();
			}
		}
	}
}
