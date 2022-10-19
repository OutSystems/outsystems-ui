// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Carousel.Splide {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUISplide
		extends OSFramework.Patterns.Carousel.AbstractCarousel<Splide, Splide.SplideConfig>
		implements OSFramework.Patterns.Carousel.ICarousel
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
		private _eventOnResize: OSFramework.GlobalCallbacks.Generic;
		// Store if a List widget is used inside the CarouselItems placeholder
		private _hasList: boolean;
		// Store the onInitialized event
		private _platformEventInitialized: OSFramework.GlobalCallbacks.OSGeneric;
		// Store the onSlideMoved event
		private _platformEventOnSlideMoved: OSFramework.Patterns.Carousel.Callbacks.OSOnSlideMovedEvent;
		// Store initial provider options
		private _splideOptions: SplideOpts;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SplideConfig(configs));
		}

		// Method to check if a List Widget is used inside the placeholder and assign the _listWidget variable
		private _checkListWidget(): void {
			this._hasList = OutSystems.OSUI.Utils.GetHasListInside(this._carouselPlaceholderElem);

			if (this._hasList) {
				this._carouselListWidgetElem = this.selfElement.querySelector(
					OSFramework.Constants.Dot + OSFramework.GlobalEnum.CssClassElements.List
				);

				this._carouselProviderElem = this._carouselTrackElem;
			} else {
				this._carouselProviderElem = this.selfElement;
			}
		}

		// Method to init the provider
		private _initProvider(): void {
			// Init provider
			this._provider = new window.Splide(this._carouselProviderElem, this._splideOptions);

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

			// Init the provider
			this._provider.mount();

			// Update pagination class, in case navigation was changed
			this._togglePaginationClass();
		}

		// Method to add the splide__slide class on each carousel item
		private _prepareCarouselItems(): void {
			// Define the element that has the items. The List widget if dynamic content, otherwise get from the placeholder directly
			const targetList = this._hasList ? this._carouselListWidgetElem : this._carouselPlaceholderElem;

			// Add the placeholder content already with the correct html structure per item, expected by the library
			for (const item of targetList.children) {
				if (!item.classList.contains(Enum.CssClass.SplideSlide)) {
					item.classList.add(Enum.CssClass.SplideSlide);
				}
			}
		}

		// Ensure that the splide track maintains the correct width
		private _setCarouselWidth(): void {
			// Update UI on window resize
			this.provider.refresh();
			// Update css variable
			OSFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._carouselTrackElem,
				OSFramework.Patterns.Carousel.Enum.CssVariables.CarouselWidth,
				this.selfElement.offsetWidth + OSFramework.GlobalEnum.Units.Pixel
			);
		}

		// Method to set the OnInitializeEvent
		private _setOnInitializedEvent(): void {
			this._provider.on(Enum.SpliderEvents.Mounted, () => {
				// Trigger platform's InstanceIntializedHandler client Action
				this.triggerPlatformEventInitialized(this._platformEventInitialized);
			});
		}

		// Method to set the OnSlideMoved event
		private _setOnSlideMovedEvent(): void {
			this._provider.on(Enum.SpliderEvents.Moved, (index) => {
				if (index !== this._currentIndex) {
					OSFramework.Helper.AsyncInvocation(this._platformEventOnSlideMoved, this.widgetId, index);
					this._currentIndex = index;
				}
			});
		}

		// Method to toggle class when pagination is present
		private _togglePaginationClass(): void {
			// If Dots is being used, add a class, to be able to change container padding-bottom on these conditions
			if (
				this.configs.Navigation === OSFramework.Patterns.Carousel.Enum.Navigation.Dots ||
				this.configs.Navigation === OSFramework.Patterns.Carousel.Enum.Navigation.Both
			) {
				OSFramework.Helper.Dom.Styles.AddClass(
					this.selfElement,
					OSFramework.Patterns.Carousel.Enum.CssClass.HasPagination
				);
			} else {
				OSFramework.Helper.Dom.Styles.RemoveClass(
					this.selfElement,
					OSFramework.Patterns.Carousel.Enum.CssClass.HasPagination
				);
			}
		}

		/**
		 * Method that encapsulates all methods needed to create a new Carousel
		 *
		 * @protected
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		protected prepareConfigs(): void {
			// Call the following methods here, so that all DOM elements are iterated and ready to init the library
			this._splideOptions = this.configs.getProviderConfig();
			// Init the Library
			this._initProvider();
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		protected setA11YProperties(): void {
			console.warn(OSFramework.GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Sets the callbacks to be used.
		 *
		 * @protected
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		protected setCallbacks(): void {
			this._eventOnResize = this._setCarouselWidth.bind(this);

			// Add event listener for window resize
			OSFramework.Event.GlobalEventManager.Instance.addHandler(
				OSFramework.Event.Type.WindowResize,
				this._eventOnResize
			);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		protected setHtmlElements(): void {
			this._carouselPlaceholderElem = OSFramework.Helper.Dom.ClassSelector(
				this.selfElement,
				OSFramework.Patterns.Carousel.Enum.CssClass.Content
			);
			this._carouselTrackElem = OSFramework.Helper.Dom.ClassSelector(
				this.selfElement,
				OSFramework.Patterns.Carousel.Enum.CssClass.Track
			);
		}

		/**
		 * Method to set the initial CSS Classes
		 *
		 * @protected
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		protected setInitialCssClasses(): void {
			// If using Carousel with a List, get one level below on the HTML, so that the List element is used on the structure expected by the library
			// In this case, the osui-carousel won't be used, and the library will be mounted on the osui-carousel_track
			if (this._hasList) {
				OSFramework.Helper.Dom.Styles.AddClass(this._carouselTrackElem, Enum.CssClass.SplideWrapper);
				OSFramework.Helper.Dom.Styles.AddClass(this._carouselPlaceholderElem, Enum.CssClass.SplideTrack);
				OSFramework.Helper.Dom.Styles.AddClass(this._carouselListWidgetElem, Enum.CssClass.SplideList);
			} else {
				OSFramework.Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.SplideWrapper);
				OSFramework.Helper.Dom.Styles.AddClass(this._carouselTrackElem, Enum.CssClass.SplideTrack);
				OSFramework.Helper.Dom.Styles.AddClass(this._carouselPlaceholderElem, Enum.CssClass.SplideList);
			}

			this._togglePaginationClass();

			this._prepareCarouselItems();
		}

		/**
		 * Unsets the callbacks.
		 *
		 * @protected
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		protected unsetCallbacks(): void {
			// remove event listener
			OSFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSFramework.Event.Type.WindowResize,
				this._eventOnResize
			);

			this._eventOnResize = undefined;
			this._platformEventInitialized = undefined;
			this._platformEventOnSlideMoved = undefined;
		}

		/**
		 * Unsets the HTML elements.
		 *
		 * @protected
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		protected unsetHtmlElements(): void {
			this._carouselPlaceholderElem = undefined;
			this._carouselTrackElem = undefined;
		}

		/**
		 * Build the pattern.
		 *
		 * @memberof Providers.Carousel.Splide.OSUISplide
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
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// Block UpdateOnRender to avoid multiple triggers of provider.refresh()
				this.toggleOnRender(true);

				switch (propertyName) {
					case OSFramework.Patterns.Carousel.Enum.Properties.StartingPosition:
						console.warn(
							`Carousel (${this.widgetId}): changes to ${OSFramework.Patterns.Carousel.Enum.Properties.StartingPosition} parameter do not affect the carousel. Use the client action 'CarouselGoTo' to change the current item.`
						);
						break;
					case OSFramework.Patterns.Carousel.Enum.Properties.Navigation:
					case OSFramework.Patterns.Carousel.Enum.Properties.AutoPlay:
					case OSFramework.Patterns.Carousel.Enum.Properties.Loop:
					case OSFramework.Patterns.Carousel.Enum.Properties.ItemsDesktop:
					case OSFramework.Patterns.Carousel.Enum.Properties.ItemsTablet:
					case OSFramework.Patterns.Carousel.Enum.Properties.ItemsPhone:
						this.redraw();
						break;
					case OSFramework.Patterns.Carousel.Enum.Properties.Height:
						this._provider.options = { height: propertyValue as string | number };
						break;
					case OSFramework.Patterns.Carousel.Enum.Properties.Padding:
						this._provider.options = { padding: propertyValue as string | number };
						break;
					case OSFramework.Patterns.Carousel.Enum.Properties.ItemsGap:
						this._provider.options = { gap: propertyValue as string | number };
						break;
				}
			}

			// Unblock UpdateOnRender so that it is able to update on DOM changes inside Carousel content
			OSFramework.Helper.AsyncInvocation(this.toggleOnRender.bind(this), false);
		}

		/**
		 * Method to remove and destroy Carousel Splide instance
		 *
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public dispose(): void {
			// Check if provider is ready
			if (this.isBuilt) {
				this._provider.destroy();
			}

			this.unsetCallbacks();
			this.unsetHtmlElements();

			super.dispose();
		}

		/**
		 * Method to call the go API from the provider
		 *
		 * @param {number} index
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public goTo(index: number): void {
			this._provider.go(index);
		}

		/**
		 * Method to call the go API from the provider. With '>' it will go to the next page
		 *
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public next(): void {
			this._provider.go(Enum.Go.Next);
		}

		/**
		 * Method to call the go API from the provider. With '<' it will go to the previous page
		 *
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public previous(): void {
			this._provider.go(Enum.Go.Previous);
		}

		/**
		 * Set callbacks for the onChange event
		 *
		 * @param {string} eventName
		 * @param {OSFramework.GlobalCallbacks.OSGeneric} callback
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public registerCallback(eventName: string, callback: OSFramework.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.Patterns.Carousel.Enum.CarouselEvents.OnSlideMoved:
					this._platformEventOnSlideMoved = callback;
					break;
				case OSFramework.Patterns.Carousel.Enum.CarouselEvents.Initialized:
					this._platformEventInitialized = callback;
					break;
			}
		}

		public setCarouselDirection(direction: string): void {
			if (direction === OSFramework.Patterns.Carousel.Enum.Direction.None && OutSystems.OSUI.Utils.GetIsRTL()) {
				this.configs.Direction = OSFramework.GlobalEnum.Direction.RTL;
			} else if (
				direction === OSFramework.Patterns.Carousel.Enum.Direction.RightToLeft &&
				this.configs.AutoPlay
			) {
				this.configs.Direction = OSFramework.GlobalEnum.Direction.RTL;
			} else {
				this.configs.Direction = OSFramework.GlobalEnum.Direction.LTR;
			}

			this.redraw();
		}

		/**
		 * Method used to set all the extended Splide properties across the different types of instances
		 *
		 * @param {SplideOpts} newConfigs
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public setProviderConfigs(newConfigs: SplideOpts): void {
			this.configs.setExtensibilityConfigs(newConfigs);
			this.redraw();
		}

		/**
		 * Method to call the option API from the provider to toggle drag events
		 *
		 * @param {boolean} hasDrag
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public toggleDrag(hasDrag: boolean): void {
			this._provider.options = { drag: hasDrag };
		}

		/**
		 * Method to toggle the _blockOnRender that enables/disables the OnRender update
		 *
		 * @param {boolean} blockOnRender
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public toggleOnRender(blockOnRender: boolean): void {
			this._blockOnRender = blockOnRender;
		}

		/**
		 * Method to run when there's a platform onRender
		 *
		 * @memberof Providers.Carousel.Splide.OSUISplide
		 */
		public updateOnRender(): void {
			if (this._blockOnRender === false) {
				this.setInitialCssClasses();

				// Check if provider is ready
				if (typeof this._provider === 'object') {
					// Keep same position after update
					// Check autoplay config, as that triggers the provider onChange and our onRender event, but doesn't udpate the _currentIndex property.
					if (this._currentIndex !== undefined || this.configs.AutoPlay === true) {
						this.configs.StartingPosition = this.provider.index;
					}

					this.redraw();
				}
			}
		}
	}
}
