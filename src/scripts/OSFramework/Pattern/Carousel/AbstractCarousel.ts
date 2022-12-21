// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Carousel {
	export abstract class AbstractCarousel<P, C extends AbstractCarouselConfig>
		extends AbstractProviderPattern<P, C>
		implements ICarousel
	{
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public build(): void {
			super.build();
		}

		// Common methods that all Carousels must implement!
		public abstract goTo(index: number): void;
		public abstract next(): void;
		public abstract previous(): void;
		public abstract setCarouselDirection(direction: string): void;
		public abstract toggleDrag(hasDrag: boolean): void;
		public abstract toggleOnRender(blockOnRender: boolean): void;
		public abstract updateOnRender(): void;
	}
}
