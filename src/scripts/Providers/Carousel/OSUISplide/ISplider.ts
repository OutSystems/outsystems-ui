/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Carousel.OSUISplide {
	/**
	 * Defines the interface for OutSystemsUI Splide Carousel
	 */
	export interface ISlider
		extends OSUIFramework.Patterns.Carousel.ICarousel,
			Providers.Interface.IProviderPattern<Splide> {}
}
