/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.Carousel.Factory {
	/**
	 * Create the new Carousel instance object according given provider
	 *
	 * @export
	 * @param {string} carouselId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.ICarousel}
	 */
	export function NewCarousel(
		carouselId: string,
		configs: string,
		provider: string
	): OSUIFramework.Patterns.Carousel.ICarousel {
		let _carouselItem = null;

		if (provider === Enum.Provider.Splide) {
			_carouselItem = new Providers.Splide.OSUISplide(carouselId, JSON.parse(configs));
		} else {
			throw new Error(
				`There is no  ${OSUIFramework.GlobalEnum.PatternsNames.Carousel}  of the ${provider} provider`
			);
		}

		return _carouselItem;
	}
}
