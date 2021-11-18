// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Splide {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUISplide
		extends OSUIFramework.Patterns.Carousel.AbstractCarousel<Splide.SplideConfig>
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		implements OSUIFramework.Patterns.Carousel.ICarousel, OSUIFramework.Interface.IProviderPattern<Splide>
	{
		// Store if the render callback should be prevented
		private _blockRender: boolean;
		// Store current carousel index;
		private _currentIndex: number;
		// Store if a List widget is used inside the CarouselItems placeholder
		private _hasList: boolean;
		// Store the List widget element
		private _listWidget: HTMLElement;
		// Store the disable render async callback
		private _onDisableRender: OSUIFramework.Callbacks.Generic;
		// Store the onInitialized event
		private _onInitialize: OSUIFramework.Callbacks.OSCarouselOnInitializeEvent;
		// Store the onResizeWidth event
		private _onResizeWidth: OSUIFramework.Callbacks.Generic;
		// Store the onSlideMoved event
		private _onSlideMoved: OSUIFramework.Callbacks.OSCarouselSlideMovedEvent;
		// Store the placholder element
		private _placeholder: HTMLElement;
		// Store the provider reference
		private _provider: Splide;
		// Store the element that will be used to init the provider
		private _providerContainer: HTMLElement;
		// Store initial provider options
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
		private _providerOptions: SplideOpts;
		// Store the splide__track element from the provider
		private _splideTrack: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SplideConfig(configs));

			// As the Splider library only has the SplideOptions as an interface, and not an object
			// we decided to create an empty object of type SplideOpts, as already give us the intellisense, without the need to create
			// a SplideOptions class on our side.
			this._providerOptions = {};

			// Bind this to the async callback
			this._onDisableRender = this._disableBlockRender.bind(this);
			this._onResizeWidth = this._setCarouselWidth.bind(this);
		}

		// Add event listener to update the correct width of the pattern
		private _adjustWidthOnResize(): void {
			window.addEventListener('resize', this._onResizeWidth);
		}

		// Method to check if a List Widget is used inside the placeholder and assign the _listWidget variable
		private _checkListWidget(): void {
			const listElements = OutSystems.OSUI.Utils.ChildrenMatches(
				this._placeholder,
				OSUIFramework.Constants.Dot + OSUIFramework.GlobalEnum.CssClassElements.List
			);

			this._hasList = listElements.length > 0;

			if (this._hasList) {
				this._listWidget = this._selfElem.querySelector(
					OSUIFramework.Constants.Dot + OSUIFramework.GlobalEnum.CssClassElements.List
				);

				this._providerContainer = this._splideTrack;
			} else {
				this._providerContainer = this._selfElem;
			}
		}

		// Method that encapsulates all methods needed to create a new Carousel
		private _createProviderCarousel(triggerInitialize = true): void {
			// Call the following methods here, so that all DOM elements are iterated and ready to init the library
			this._prepareCarouselItems();
			this._setInitialLibraryOptions();

			// Init the Library
			this._initProvider(triggerInitialize);

			// Set the OnSlideMoved event
			this._setOnSlideMovedEvent();

			this._setCarouselWidth();
		}

		// Method to toggle the blockRender status
		private _disableBlockRender(): void {
			this._blockRender = false;
		}

		// Method to init the provider
		private _initProvider(triggerInitialize = true): void {
			this._provider = new window.Splide(this._providerContainer, this._providerOptions);

			if (triggerInitialize) {
				// Set the OnInitialized event, before the provider is mounted
				this._setOnInitializedEvent();
			}

			// Init the provider
			this._provider.mount();
		}

		// Method to add the splide__slide class on each carousel item
		private _prepareCarouselItems(): void {
			// Define the element that has the items. The List widget if dynamic content, otherwise get from the placeholder directly
			const targetList = this._hasList ? this._listWidget : this._placeholder;

			// Add the placeholder content already with the correct html structure per item, expected by the library
			for (const item of targetList.children) {
				if (!item.classList.contains(Enum.CssClass.SplideSlide)) {
					item.classList.add(Enum.CssClass.SplideSlide);
				}
			}
		}

		// Method that handles the breakpoint options from the library
		private _setBreakpointsOptions(): void {
			this._providerOptions.breakpoints = {
				768: {
					perPage: this._configs.ItemsPerSlide.Phone,
					focus: this.setFocusOnItemOption(this._configs.FocusOnItem, this._configs.ItemsPerSlide.Phone),
				},
				1024: {
					perPage: this._configs.ItemsPerSlide.Tablet,
					focus: this.setFocusOnItemOption(this._configs.FocusOnItem, this._configs.ItemsPerSlide.Tablet),
				},
			};
		}

		// Ensure that the splide track maintains the correct width
		private _setCarouselWidth(): void {
			OSUIFramework.Helper.Style.SetStyleAttribute(
				this._splideTrack,
				'--carousel-width',
				this._selfElem.offsetWidth + 'px'
			);
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._placeholder = this._selfElem.querySelector(
				OSUIFramework.Constants.Dot + OSUIFramework.Patterns.Carousel.Enum.CssClass.Content
			);
			this._splideTrack = this._selfElem.querySelector(
				OSUIFramework.Constants.Dot + OSUIFramework.Patterns.Carousel.Enum.CssClass.Track
			);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// If using Carousel with a List, get one level below on the HTML, so that the List element is used on the structure expected by the library
			// In this case, the osui-carousel won't be used, and the library will be mounted on the osui-carousel_track
			if (this._hasList) {
				OSUIFramework.Helper.Style.AddClass(this._splideTrack, Enum.CssClass.SplideWrapper);
				OSUIFramework.Helper.Style.AddClass(this._placeholder, Enum.CssClass.SplideTrack);
				OSUIFramework.Helper.Style.AddClass(this._listWidget, Enum.CssClass.SplideList);
			} else {
				OSUIFramework.Helper.Style.AddClass(this._selfElem, Enum.CssClass.SplideWrapper);
				OSUIFramework.Helper.Style.AddClass(this._splideTrack, Enum.CssClass.SplideTrack);
				OSUIFramework.Helper.Style.AddClass(this._placeholder, Enum.CssClass.SplideList);
			}
		}

		// Method to set the initial provider options, when created by the first time or after a destroy()
		private _setInitialLibraryOptions(): void {
			this._providerOptions = this._configs.getProviderConfig();

			// Method to handle the breakpoints, and it will need to be called again on changeProperty
			this._setBreakpointsOptions();

			// Method to handle the Navigation, and it will need to be called again on changeProperty
			this.setNavigation(this._configs.Navigation);
		}

		// Method to set the OnInitializeEvent
		private _setOnInitializedEvent(): void {
			this._provider.on(Enum.SpliderEvents.Mounted, () => {
				OSUIFramework.Helper.AsyncInvocation(this._onInitialize, this.widgetId);
			});
		}

		// Method to set the OnSlideMoved event
		private _setOnSlideMovedEvent(): void {
			this._provider.on(Enum.SpliderEvents.Moved, (index) => {
				if (index !== this._currentIndex) {
					OSUIFramework.Helper.AsyncInvocation(this._onSlideMoved, this.widgetId, index);
					this._currentIndex = index;
				}
			});
		}

		// Method to update Breakpoints options
		private _updateBreakpoints(): void {
			this._setBreakpointsOptions();

			this._provider.options = {
				focus: this.setFocusOnItemOption(this._configs.FocusOnItem, this._configs.ItemsPerSlide.Desktop),
				breakpoints: this._providerOptions.breakpoints,
			};
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._checkListWidget();

			this._setInitialCssClasses();

			this._adjustWidthOnResize();

			this._createProviderCarousel();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check if provider is ready
			if (!this.isBuilt) {
				return;
			}

			// Block UpdateOnRender to avoid multiple triggers of provider.refresh()
			this._blockRender = true;

			// Check which property changed and call respective method to update it
			switch (propertyName) {
				case OSUIFramework.Patterns.Carousel.Enum.Properties.Navigation:
					this._configs.Navigation = propertyValue;
					this.updateCarousel();
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.ItemsDesktop:
					this._configs.ItemsPerSlide.Desktop = propertyValue;
					this.updateCarousel();
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.ItemsTablet:
					this._configs.ItemsPerSlide.Tablet = propertyValue;
					this.updateCarousel();
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.ItemsPhone:
					this._configs.ItemsPerSlide.Phone = propertyValue;
					this.updateCarousel();
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.AutoPlay:
					this._configs.AutoPlay = propertyValue;
					this.updateCarousel();
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.Loop:
					this._configs.Loop = propertyValue;
					this.updateCarousel();
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.Padding:
					this._configs.Padding = propertyValue;
					this._provider.options = { padding: propertyValue };
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.Gap:
					this._configs.Gap = propertyValue;
					this._provider.options = { gap: propertyValue };
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.InitialPosition:
					this._configs.InitialPosition = propertyValue;
					this.updateCarousel(false);
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Properties.Focus:
					this._configs.FocusOnItem = propertyValue;
					this._updateBreakpoints();
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}

			// Unblock UpdateOnRender so that it is able to update on DOM changes inside Carousel content
			OSUIFramework.Helper.AsyncInvocation(this._onDisableRender, this.widgetId);
		}

		// Method to remove and destroy Carousel Splide instance
		public dispose(): void {
			// Check if provider is ready
			if (this.isBuilt) {
				this._provider.destroy();
			}

			// remove event listener
			window.addEventListener('resize', this._onResizeWidth);

			super.dispose();
		}

		// Method to call the go API from the provider
		public goTo(index: number): void {
			this._provider.go(index);
		}

		// Method to call the go API from the provider. With '>' it will go to the next page
		public next(): void {
			this._provider.go(Enum.Go.Next);
		}

		// Method to call the go API from the provider. With '<' it will go to the previous page
		public previous(): void {
			this._provider.go(Enum.Go.Previous);
		}

		// Provider getter
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		public get provider(): Splide {
			return this._provider;
		}

		// Set callbacks for the onChange event
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.Carousel.Enum.CarouselEvents.OnSlideMoved:
					this._onSlideMoved = callback;
					break;
				case OSUIFramework.Patterns.Carousel.Enum.CarouselEvents.OnInitialize:
					this._onInitialize = callback;
					break;
			}
		}

		// Method to set the correct FocusOnItem option, as the library only supports 'center' or an index
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public setFocusOnItemOption(value: string, itemsPerSlide: number): any {
			let currentFocus;
			switch (value) {
				case Enum.FocusOnItem.Center:
					currentFocus = Enum.FocusOnItem.Center;
					break;
				case Enum.FocusOnItem.FirstOnSlide:
					currentFocus = 0;
					break;
				case Enum.FocusOnItem.LastOnSlide:
					currentFocus = itemsPerSlide - 1; // last on each page
			}

			return currentFocus;
		}

		// Method to set the correct configuration for the Navigation option
		public setNavigation(navigation: string): void {
			switch (navigation) {
				case Enum.Navigation.None:
					this._providerOptions.arrows = false;
					this._providerOptions.pagination = false;
					break;
				case Enum.Navigation.Dots:
					this._providerOptions.arrows = false;
					this._providerOptions.pagination = true;
					break;
				case Enum.Navigation.Arrows:
					this._providerOptions.arrows = true;
					this._providerOptions.pagination = false;
					break;
				case Enum.Navigation.Both:
					this._providerOptions.arrows = true;
					this._providerOptions.pagination = true;
					break;
				default:
					throw new Error(`setNavigation - Option '${navigation}' can't be set.`);
			}
		}

		// Method to call the option API from the provider to toggle drag events
		public toggleDrag(hasDrag: boolean): void {
			this._provider.options = { drag: hasDrag };
		}

		// Method used on the changeProperty for the options that require the Carousel to be destroyd and created again to properly update
		public updateCarousel(keepCurrentIndex = true, triggerInitialize = true): void {
			// Check if provider is ready
			if (typeof this._provider === 'object') {
				this._provider.destroy();
			}

			if (keepCurrentIndex) {
				// Keep same position after update
				this._configs.InitialPosition = this._currentIndex;
			}
			// Create Carousel again
			this._createProviderCarousel(triggerInitialize);
		}

		// Method to run when there's a platform onRender
		public updateOnRender(): void {
			if (!this._blockRender) {
				this._setInitialCssClasses();

				// Check if provider is ready
				if (typeof this._provider === 'object') {
					this.updateCarousel(false, false);
				}
			}
		}
	}
}
