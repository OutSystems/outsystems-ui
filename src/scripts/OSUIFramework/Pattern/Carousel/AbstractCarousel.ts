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

		public abstract goTo(index: number): void;
		public abstract next(): void;
		public abstract previous(): void;
		public abstract registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void;
		public abstract toggleDrag(hasDrag: boolean): void;
		public abstract updateOnRender(): void;
	}
}
