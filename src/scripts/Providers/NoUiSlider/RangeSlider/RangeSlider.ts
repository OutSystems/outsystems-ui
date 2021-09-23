// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.RangeSlider {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class RangeSlider
		extends OSUIFramework.Patterns.RangeSlider.AbstractRangeSlider<Providers.RangeSlider.RangeSliderConfig>
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		implements Providers.RangeSlider.IRangeSliderProvider
	{
		// Store the provider reference
		private _provider: NoUiSlider;

		// Provider getter
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		public get provider(): NoUiSlider {
			return this._provider;
		}
		//Implement you code here
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			// switch (eventName) {
			// 	case OSUIFramework.Patterns.Carousel.Enum.CarouselEvents.OnSlideMoved:
			// 		this._onSlideMoved = callback;
			// 		break;
			// 	case OSUIFramework.Patterns.Carousel.Enum.CarouselEvents.OnInitialize:
			// 		this._onInitialize = callback;
			// 		break;
			// }
		}
	}
}
