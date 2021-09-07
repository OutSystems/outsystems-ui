/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Carousel.Splide.Carousel {
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
			// Set IsOpen class
			// if (this._isOpen) {
			// 	Helper.Style.AddClass(this._selfElem, Enum.CssClass.IsOpen);
			// }
		}

		public build(): void {
			super.build();

			this._getPlaceholderContent();

			this._createHtmlStructure();

			this._setHtmlElements();

			this._setInitialCssClasses();

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

		public updateOnRender(): void {
			console.log('render');
		}
	}
}
