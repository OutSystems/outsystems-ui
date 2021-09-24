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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new RangeSliderConfig(configs));
		}

		private _createProviderRangeSlider(): void {
			window.NoUiSlider.create(this._selfElem, {
				start: [20],
				connect: 'lower',
				range: {
					min: 0,
					max: 100,
				},
			});
		}

		public build(): void {
			super.build();

			this._createProviderRangeSlider();

			this.finishBuild();
		}

		// Provider getter
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		public get provider(): NoUiSlider {
			return this._provider;
		}

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
