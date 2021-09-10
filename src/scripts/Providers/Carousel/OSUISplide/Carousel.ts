/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Carousel.OSUISplide.Carousel {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Carousel
		extends OSUIFramework.Patterns.AbstractPattern<OSUIFramework.Patterns.Carousel.CarouselConfig>
		implements OSUIFramework.Patterns.Carousel.ICarousel
	{
		private _hasList: boolean;
		private _listWidget: HTMLElement;
		private _onChange: OSUIFramework.Callbacks.OSCarouselChangeEvent;
		private _placeholder: HTMLElement;
		private _placeholderContent: NodeList;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _provider: any;
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
		private _splideOptions: Record<string, any> = {};
		private _splideTrack: HTMLElement;

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
			}
		}

		private _createProviderCarousel(): void {
			this._prepareCarouselItems();
			// Call the following methods here, so that all DOM elements are iterated and ready to init the library
			this._setLibraryOptions();

			this._initProvider();
		}

		private _getPlaceholderContent(): NodeList {
			if (this._hasList) {
				this._placeholderContent = this._listWidget.childNodes;
			} else {
				this._placeholderContent = this._placeholder.childNodes;
			}

			return this._placeholderContent;
		}

		private _initProvider(): void {
			//this._provider = new Splide(this._selfElem, this._splideOptions).mount()
			// eslint-disable-next-line no-debugger
			debugger;
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

		private _setOnchangeEvent(): void {
			//eslint-disable-next-line @typescript-eslint/no-this-alias
			const that = this;
			this._provider.on('moved', function (index) {
				setTimeout(() => {
					that._onChange(that.widgetId, index);
				}, 0);
			});
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

		private _setLibraryOptions(): void {
			switch (this._configs.Navigation) {
				case Enum.Navigation.Empty:
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
				default:
					this._splideOptions.arrows = true;
					this._splideOptions.pagination = true;
			}

			this._splideOptions = {
				direction: OutSystems.OSUI.Utils.GetIsRTL() ? 'rtl' : 'ltr',
				perPage: this._configs.ItemsPerSlide.Desktop,
				autoplay: this._configs.OptionalConfigs.AutoPlay,
				type: this._configs.OptionalConfigs.Loop ? 'loop' : 'slide',
				focus: this.setFocusOnItemOption(this._configs.ItemsPerSlide.Desktop),
				autoWidth: this._configs.OptionalConfigs.AutoWidth,
				padding: this._configs.OptionalConfigs.Padding,
				gap: this._configs.OptionalConfigs.Gap,
				start: this._configs.OptionalConfigs.InitialPosition,
				breakpoints: {
					768: {
						perPage: this._configs.ItemsPerSlide.Phone,
						focus: this.setFocusOnItemOption(this._configs.ItemsPerSlide.Phone),
					},
					1024: {
						perPage: this._configs.ItemsPerSlide.Tablet,
						focus: this.setFocusOnItemOption(this._configs.ItemsPerSlide.Tablet),
					},
				},
			};

			// Manage Scale option
			this.handleScale(this._configs.OptionalConfigs.Scale);
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._checkListWidget();

			this._getPlaceholderContent();

			this._setInitialCssClasses();

			this._createProviderCarousel();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			switch (propertyName) {
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		// Method to remove event listener and destroy sidebar instance
		public dispose(): void {
			super.dispose();
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
		public registerCallback(callback: OSUIFramework.Callbacks.OSCarouselChangeEvent): void {
			this._onChange = callback;
			this._setOnchangeEvent();
		}

		public setFocusOnItemOption(itemsPerSlide: number): void {
			let currentFocus;
			switch (this._configs.OptionalConfigs.FocusOnItem) {
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

		public updateCarousel(): void {
			this._setInitialCssClasses();
			this._prepareCarouselItems();
			this._provider.refresh();
		}

		public updateOnRender(): void {
			console.log('render');
			this.updateCarousel();
		}
	}
}
