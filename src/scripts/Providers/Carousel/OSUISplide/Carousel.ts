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

				this._selfElem.parentNode.append(this._listWidget);
			}
		}

		private _createHtmlStructure(): void {
			// Create element to be the splide__track
			this._splideTrack = document.createElement('div');
			// Move this element abole the placeholder container
			this._placeholder.parentNode.replaceChild(this._splideTrack, this._placeholder);
			// Append the placeholder container inside the new div created
			this._splideTrack.innerHTML = this._placeholder.outerHTML;

			// Update elements reference after DOM manipulation
			this._setHtmlElements();

			// Add the placeholder content alreay with the correct html structure per item, expected ny the library
			this._placeholder.innerHTML = this._getCarouselItemsHtml();

			if (this._hasList) {
				this._listWidget.style.display = 'none';
			}
		}

		private _createSplideCarousel(): void {
			//this._provider = new Splide(this._selfElem, this._splideOptions).mount()
			// eslint-disable-next-line no-debugger
			debugger;
		}

		private _getCarouselItemsHtml(): string {
			let carouselList = '';

			for (const item of this._placeholderContent) {
				const wrapper = document.createElement('div');
				wrapper.appendChild(item.cloneNode(true));
				// For each element inside the platform's placeholder, wrap it on a div with the class expected by the library
				carouselList += `<div class=${Enum.CssClass.SplideSlide}>${wrapper.innerHTML}</div>`;
			}

			return carouselList;
		}

		private _getPlaceholderContent(): NodeList {
			if (this._hasList) {
				this._placeholderContent = this._listWidget.childNodes;
			} else {
				this._placeholderContent = this._placeholder.childNodes;
			}

			return this._placeholderContent;
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._placeholder = this._selfElem.querySelector(
				OSUIFramework.Constants.Dot + OSUIFramework.Patterns.Carousel.Enum.CssClass.Content
			);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			OSUIFramework.Helper.Style.AddClass(this._selfElem, Enum.CssClass.Splide);
			OSUIFramework.Helper.Style.AddClass(this._placeholder, Enum.CssClass.SplideList);
			OSUIFramework.Helper.Style.AddClass(this._splideTrack, Enum.CssClass.SplideTrack);
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
				focus: 'center',
				autoWidth: this._configs.OptionalConfigs.AutoWidth,
				padding: this._configs.OptionalConfigs.Padding,
				gap: this._configs.OptionalConfigs.Gap,
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
			this.handleScale(this._configs.OptionalConfigs.Scale);
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._checkListWidget();

			this._getPlaceholderContent();

			this._createHtmlStructure();

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
