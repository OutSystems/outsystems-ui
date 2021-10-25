/* eslint-disable @typescript-eslint/explicit-member-accessibility */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Carousel {
	export abstract class AbstractCarouselConfig extends Patterns.AbstractProviderConfiguration {
		public AutoPlay: boolean;
		public FocusOnItem: string;
		public Gap: string;
		public InitialPosition: number;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public ItemsPerSlide: any;
		public Loop: boolean;
		public Navigation: string;
		public Padding: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
