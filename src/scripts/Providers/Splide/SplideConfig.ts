/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Carousel {
	export class SplideConfig extends OSUIFramework.Patterns.Carousel.AbstractCarouselConfig {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// eslint-disable-next-line prefer-const
			let providerOptions = {};

			//Cleanning undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions;
		}
	}
}
