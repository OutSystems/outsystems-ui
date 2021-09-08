/* eslint-disable @typescript-eslint/explicit-member-accessibility */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Carousel {
	export class CarouselConfig extends AbstractConfiguration {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ItemsPerSlide: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Navigation: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		OptionalConfigs: any;
		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
