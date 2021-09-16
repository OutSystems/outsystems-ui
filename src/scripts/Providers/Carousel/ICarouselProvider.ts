/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Carousel {
	/**
	 * Defines the interface for OutSystemsUI Splide Carousel
	 */
	export interface ICarouselProvider
		extends OSUIFramework.Patterns.Carousel.ICarousel,
			OSUIFramework.Interface.IProviderPattern<Splide> {}
}
