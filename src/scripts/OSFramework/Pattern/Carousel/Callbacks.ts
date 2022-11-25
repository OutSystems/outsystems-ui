// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Carousel.Callbacks {
	export type OSOnSlideMovedEvent = {
		(carouselId: string, index: number): void;
	};
}
