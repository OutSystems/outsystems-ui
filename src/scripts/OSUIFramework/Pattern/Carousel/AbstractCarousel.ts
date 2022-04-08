// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Carousel {
	export abstract class AbstractCarousel<P, C extends AbstractCarouselConfig>
		extends AbstractProviderPattern<P, C>
		implements ICarousel, Interface.IProviderPattern<P>
	{
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public build(): void {
			super.build();
		}

		public get provider(): P {
			return this._provider;
		}

		public set provider(p: P) {
			this._provider = p;
		}

		public abstract goTo(index: number): void;
		public abstract next(): void;
		public abstract previous(): void;
		public abstract registerCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void;
		public abstract toggleDrag(hasDrag: boolean): void;
		public abstract updateOnRender(): void;
	}
}
