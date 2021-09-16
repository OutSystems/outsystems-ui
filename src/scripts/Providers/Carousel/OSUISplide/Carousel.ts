// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Carousel.OSUISplide.Carousel {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Carousel
		extends OSUIFramework.Patterns.AbstractPattern<OSUIFramework.Patterns.Carousel.CarouselConfig>
		implements ISlider
	{
		private _blockRender: boolean;
		private _hasList: boolean;
		private _listWidget: HTMLElement;
		private _onInitialized: OSUIFramework.Callbacks.OSCarouselOnInitializedEvent;
		private _onSlideMoved: OSUIFramework.Callbacks.OSCarouselSlideMovedEvent;
		private _placeholder: HTMLElement;
		private _provider: Splide;
		private _providerContainer: HTMLElement;
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
		private _splideOptions: Record<string, any> = {};
		private _splideTrack: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		provider: Splide;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new OSUIFramework.Patterns.Carousel.CarouselConfig(configs));
		}

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

		private _createProviderCarousel(): void {
			// Call the following methods here, so that all DOM elements are iterated and ready to init the library
			this._prepareCarouselItems();
			this._setInitialLibraryOptions();

			// Init the Library
			this._initProvider();

			this._setOnSlideMovedEvent();
		}

		private _initProvider(): void {
			this._provider = new window.Splide(this._providerContainer, this._splideOptions);
			this._setOnInitializedEvent();
			this._provider.mount();
		}

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
			if (this._hasList) {
				OSUIFramework.Helper.Style.AddClass(this._splideTrack, Enum.CssClass.Splide);
				OSUIFramework.Helper.Style.AddClass(this._placeholder, Enum.CssClass.SplideTrack);
				OSUIFramework.Helper.Style.AddClass(this._listWidget, Enum.CssClass.SplideList);
			} else {
				OSUIFramework.Helper.Style.AddClass(this._selfElem, Enum.CssClass.Splide);
				OSUIFramework.Helper.Style.AddClass(this._splideTrack, Enum.CssClass.SplideTrack);
				OSUIFramework.Helper.Style.AddClass(this._placeholder, Enum.CssClass.SplideList);
			}
		}

		private _setInitialLibraryOptions(): void {
			this._splideOptions.direction = OutSystems.OSUI.Utils.GetIsRTL()
				? OSUIFramework.GlobalEnum.Direction.rtl
				: OSUIFramework.GlobalEnum.Direction.ltr;

			this._splideOptions.perPage = this._configs.ItemsPerSlide.Desktop;
			this._splideOptions.autoplay = this._configs.OptionalConfigs.AutoPlay;
			this._splideOptions.type = this._configs.OptionalConfigs.Loop
				? Enum.FocusOptions.Loop
				: Enum.FocusOptions.Slide;

			this._splideOptions.focus = this.setFocusOnItemOption(
				this._configs.OptionalConfigs.FocusOnItem,
				this._configs.ItemsPerSlide.Desktop
			);

			this._splideOptions.padding = this._configs.OptionalConfigs.Padding;
			this._splideOptions.gap = this._configs.OptionalConfigs.Gap;
			this._splideOptions.start = this._configs.OptionalConfigs.InitialPosition;

			this._splideOptions.breakpoints = {
				768: {
					perPage: this._configs.ItemsPerSlide.Phone,
					focus: this.setFocusOnItemOption(
						this._configs.OptionalConfigs.FocusOnItem,
						this._configs.ItemsPerSlide.Phone
					),
				},
				1024: {
					perPage: this._configs.ItemsPerSlide.Tablet,
					focus: this.setFocusOnItemOption(
						this._configs.OptionalConfigs.FocusOnItem,
						this._configs.ItemsPerSlide.Tablet
					),
				},
			};

			this.setNavigation(this._configs.Navigation);

			// Manage Scale option
			this.handleScale(this._configs.OptionalConfigs.Scale);
		}

		private _setOnInitializedEvent(): void {
			this._provider.on('mounted', () => {
				setTimeout(() => {
					this._onInitialized(this.widgetId);
				}, 0);
			});
		}

		private _setOnSlideMovedEvent(): void {
			this._provider.on('moved', (index) => {
				setTimeout(() => {
					this._onSlideMoved(this.widgetId, index);
				}, 0);
			});
		}

		private _updateBreakpointsOptions(focusValue = this._configs.OptionalConfigs.FocusOnItem): void {
			this._provider.options.breakpoints = {
				768: {
					perPage: this._configs.ItemsPerSlide.Phone,
					focus: this.setFocusOnItemOption(focusValue, this._configs.ItemsPerSlide.Phone),
				},
				1024: {
					perPage: this._configs.ItemsPerSlide.Tablet,
					focus: this.setFocusOnItemOption(focusValue, this._configs.ItemsPerSlide.Tablet),
				},
			};
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._checkListWidget();

			this._setInitialCssClasses();

			this._createProviderCarousel();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Block UpdateOnRender to avoid multiple triggers of provider.refresh()
			this._blockRender = true;

			// Check which property changed and call respective method to update it
			switch (propertyName) {
				case 'navigation':
					this._configs.Navigation = propertyValue;
					this.destroyAndUpdateCarousel();
					break;
				case 'itemsDesktop':
					this._configs.ItemsPerSlide.Desktop = propertyValue;
					this._provider.options.perPage = propertyValue;
					this.updateCarousel();
					break;
				case 'itemsTablet':
					this._configs.ItemsPerSlide.Tablet = propertyValue;
					this.destroyAndUpdateCarousel();
					break;
				case 'itemsPhone':
					this._configs.ItemsPerSlide.Phone = propertyValue;
					this.destroyAndUpdateCarousel();
					break;
				case 'autoplay':
					this._configs.OptionalConfigs.AutoPlay = propertyValue;
					this.destroyAndUpdateCarousel();
					break;
				case 'loop':
					this._configs.OptionalConfigs.Loop = propertyValue;
					this.destroyAndUpdateCarousel();
					break;
				case 'padding':
					this._configs.OptionalConfigs.Padding = propertyValue;
					this._provider.options.padding = propertyValue;
					this.updateCarousel();
					break;
				case 'gap':
					this._configs.OptionalConfigs.Gap = propertyValue;
					this._provider.options.gap = propertyValue;
					this.updateCarousel();
					break;
				case 'initialPosition':
					this._configs.OptionalConfigs.InitialPosition = propertyValue;
					this.destroyAndUpdateCarousel();
					break;
				case 'scale':
					this._configs.OptionalConfigs.Scale = propertyValue;
					this.handleScale(propertyValue);
					this.updateCarousel();
					break;
				case 'focus':
					this._configs.OptionalConfigs.FocusOnItem = propertyValue;
					this._provider.options.focus = this.setFocusOnItemOption(
						propertyValue,
						this._configs.ItemsPerSlide.Desktop
					);
					this._updateBreakpointsOptions();
					this.updateCarousel();
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}

			// Unblock UpdateOnRender so that it is able to update on DOM changes inside Carousel content
			setTimeout(() => {
				this._blockRender = false;
			}, 0);
		}

		public destroyAndUpdateCarousel(): void {
			this._provider.destroy();
			this._createProviderCarousel();
		}

		// Method to remove and destroy Carousel Splide instance
		public dispose(): void {
			super.dispose();

			this._provider.destroy();
		}

		public handleScale(setScale: boolean): void {
			const containsScaleClass = OSUIFramework.Helper.Style.ContainsClass(
				this._selfElem,
				Enum.CssClass.ScaleOption
			);

			if (setScale) {
				OSUIFramework.Helper.Style.AddClass(this._selfElem, Enum.CssClass.ScaleOption);
			} else if (containsScaleClass) {
				OSUIFramework.Helper.Style.RemoveClass(this._selfElem, Enum.CssClass.ScaleOption);
			}
		}

		// Set callbacks for the onChange event
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case Enum.Events.OnSlideMoved:
					this._onSlideMoved = callback;
					break;
				case Enum.Events.OnInitialized:
					this._onInitialized = callback;
					break;
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public setFocusOnItemOption(value: string, itemsPerSlide: number): any {
			let currentFocus;
			switch (value) {
				case Enum.FocusOnItem.Center:
					currentFocus = 'center';
					break;
				case Enum.FocusOnItem.FirstOnSlide:
					currentFocus = 0;
					break;
				case Enum.FocusOnItem.LastOnSlide:
					currentFocus = itemsPerSlide - 1;
			}

			return currentFocus;
		}

		public setNavigation(navigation: string): void {
			switch (navigation) {
				case Enum.Navigation.None:
					this._splideOptions.arrows = false;
					this._splideOptions.pagination = false;
					break;
				case Enum.Navigation.Dots:
					this._splideOptions.arrows = false;
					this._splideOptions.pagination = true;
					break;
				case Enum.Navigation.Arrows:
					this._splideOptions.arrows = true;
					this._splideOptions.pagination = false;
					break;
				case Enum.Navigation.Both:
					this._splideOptions.arrows = true;
					this._splideOptions.pagination = true;
			}
		}

		public updateCarousel(hasDomChanges = false): void {
			if (hasDomChanges) {
				this._setInitialCssClasses();
				this._prepareCarouselItems();
			}

			this._provider.refresh();
		}

		public updateOnRender(): void {
			if (!this._blockRender) {
				this.updateCarousel(true);
			}
		}
	}
}
