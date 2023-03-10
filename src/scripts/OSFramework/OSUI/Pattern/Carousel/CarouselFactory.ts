/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Patterns.Carousel.Factory {
	/**
	 * Create the new Carousel instance object according given provider
	 *
	 * @export
	 * @param {string} carouselId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {Patterns.Carousel.ICarousel}
	 */
	export function NewCarousel(carouselId: string, configs: string, provider: string): Patterns.Carousel.ICarousel {
		let _carouselItem = null;

		if (provider === Enum.Provider.Splide) {
			_carouselItem = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
				OSFramework.OSUI.GlobalEnum.PatternName.Carousel,
				carouselId,
				JSON.parse(configs),
				provider
			) as OSFramework.OSUI.Patterns.Carousel.ICarousel;
		} else {
			throw new Error(`There is no  ${GlobalEnum.PatternName.Carousel}  of the ${provider} provider`);
		}

		return _carouselItem;
	}
}
