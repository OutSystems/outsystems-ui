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
		private _carouselItems: [string];
		private _carouselList: HTMLElement;
		private _onChange: OSUIFramework.Callbacks.OSCarouselChangeEvent;
		private _placeholderContent: NodeList;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _provider: any;
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
		private _splideOptions: Record<string, any> = {};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new OSUIFramework.Patterns.Carousel.CarouselConfig(configs));
		}

		private _createCarouselItems(): string {
			let carouselList = '';

			for (const item of this._placeholderContent) {
				const wrapper = document.createElement('li');
				wrapper.appendChild(item.cloneNode(true));

				carouselList += `<li class=${Enum.CssClass.SplideSlide}>${wrapper.innerHTML}</li>`;
			}

			return carouselList;
		}

		private _createHtmlStructure(): void {
			this._selfElem.innerHTML = `
			<div class=${Enum.CssClass.SplideTrack}>
				<ul class=${Enum.CssClass.SplideList}>
					${this._createCarouselItems()}
				</ul>
			</div>
			`;
		}

		private _createSplideCarousel(): void {
			//this._provider = new Splide(this._selfElem, this._splideOptions).mount()
			// eslint-disable-next-line no-debugger
			debugger;
		}

		private _getPlaceholderContent(): NodeList {
			this._placeholderContent = this._selfElem.querySelector(
				OSUIFramework.Constants.Dot + OSUIFramework.Patterns.Carousel.Enum.CssClass.Content
			).childNodes;

			return this._placeholderContent;
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			//
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			OSUIFramework.Helper.Style.AddClass(this._selfElem, Enum.CssClass.Splide);
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
				direction: OutSystems.OSUI.Utils.GetIsRTL ? 'rtl' : 'ltr',
				perPage: this._configs.ItemsPerSlide.Desktop,
				autoplay: this._configs.OptionalConfigs.Autoplay,
				type: this._configs.OptionalConfigs.Loop ? 'loop' : 'slide',
				focus: this._configs.OptionalConfigs.FocusCenter ? 'center' : '0',
				padding: this._configs.OptionalConfigs.Padding,
				start: this._configs.OptionalConfigs.InitialPosition,
				breakpoints: {
					768: {
						perPage: this._configs.ItemsPerSlide.Phone,
					},
					1024: {
						perPage: this._configs.ItemsPerSlide.Tablet,
					},
				},
			};

			// Manage Scale option
			this.handleScale(true);
		}

		public build(): void {
			super.build();

			this._getPlaceholderContent();

			this._createHtmlStructure();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setLibraryOptions();

			this._createSplideCarousel();

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

		// Set callbacks for the onToggle event
		public registerCallback(callback: OSUIFramework.Callbacks.OSCarouselChangeEvent): void {
			this._onChange = callback;
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

		public updateOnRender(): void {
			console.log('render');
		}
	}
}
