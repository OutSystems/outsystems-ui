/* eslint-disable @typescript-eslint/explicit-member-accessibility */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Carousel {
	export abstract class AbstractCarouselConfig extends Patterns.AbstractProviderConfiguration {
		public AutoPlay: boolean;
		public Gap: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public ItemsPerSlide: any;
		public Loop: boolean;
		public Navigation: string;
		public Padding: string;
		public StartingPosition: number;

		constructor(config: JSON) {
			super(config);
		}
	}
}
