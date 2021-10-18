// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Carousel {
	export abstract class AbstractCarousel<C extends AbstractCarouselConfig>
		extends AbstractPattern<C>
		implements ICarousel
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public build(): void {
			super.build();
		}
	}
}
