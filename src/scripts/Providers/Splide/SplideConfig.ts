/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Carousel {
	export class SplideConfig extends OSUIFramework.Patterns.Carousel.AbstractCarouselConfig {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): any {
			// eslint-disable-next-line prefer-const
			let providerOptions = {
				direction: OutSystems.OSUI.Utils.GetIsRTL()
					? OSUIFramework.GlobalEnum.Direction.RTL
					: OSUIFramework.GlobalEnum.Direction.LTR,

				type: this.Loop ? Enum.TypeOptions.Loop : Enum.TypeOptions.Slide,

				focus: Providers.Carousel.OSUISplide.prototype.setFocusOnItemOption(
					this.FocusOnItem,
					this.ItemsPerSlide.Desktop
				),

				perPage: this.ItemsPerSlide.Desktop,
				autoplay: this.AutoPlay,
				padding: this.Padding,
				gap: this.Gap,
				start: this.InitialPosition,
			};

			//Cleanning undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions;
		}
	}
}
