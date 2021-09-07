// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Carousel.OSUISplider.Carousel {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Carousel
		extends OSUIFramework.Patterns.AbstractPattern<OSUIFramework.Patterns.Carousel.CarouselConfig>
		implements OSUIFramework.Patterns.Carousel.ICarousel
	{
		private _onChange: OSUIFramework.Callbacks.OSCarouselChangeEvent;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new OSUIFramework.Patterns.Carousel.CarouselConfig(configs));
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			console.log('set html');
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
