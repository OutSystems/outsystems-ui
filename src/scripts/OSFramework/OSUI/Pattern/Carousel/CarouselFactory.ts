/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.Carousel.Factory {
	/**
	 * Create the new Carousel instance object according given provider
	 *
	 * @param carouselId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @param provider
	 */
	export function NewCarousel(
		carouselId: string,
		configs: string | Record<string, unknown>,
		provider: string
	): Patterns.Carousel.ICarousel {
		let _carouselItem = null;

		if (provider === Enum.Provider.Splide) {
			_carouselItem = new Providers.OSUI.Carousel.Splide.OSUISplide(
				carouselId,
				OSFramework.OSUI.Helper.ParseConfigs(configs)
			);
		} else {
			throw new Error(`There is no  ${GlobalEnum.PatternName.Carousel}  of the ${provider} provider`);
		}

		return _carouselItem;
	}
}
