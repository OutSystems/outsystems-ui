// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Carousel/AbstractCarousel.ts
namespace OSFramework.Patterns.Carousel {
========
namespace OSFramework.OSUI.Patterns.Carousel {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Carousel/AbstractCarousel.ts
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
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Carousel/AbstractCarousel.ts
========

		// Common methods that all Carousels must implement!
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Carousel/AbstractCarousel.ts
		public abstract goTo(index: number): void;
		public abstract next(): void;
		public abstract previous(): void;
		public abstract setCarouselDirection(direction: string): void;
		public abstract toggleDrag(hasDrag: boolean): void;
		public abstract toggleOnRender(blockOnRender: boolean): void;
		public abstract updateOnRender(): void;
	}
}
