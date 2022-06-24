/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Splide {
	export class SplideConfig extends OSUIFramework.Patterns.Carousel.AbstractCarouselConfig {
		private _getArrowConfig(): boolean {
			let arrows: boolean;
			switch (this.Navigation) {
				case OSUIFramework.Patterns.Carousel.Enum.Navigation.None:
					arrows = false;
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Navigation.Dots:
					arrows = false;
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Navigation.Arrows:
					arrows = true;
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Navigation.Both:
					arrows = true;
					break;
			}

			return arrows;
		}

		private _getDirectionConfig(): string {
			let direction: string;
			if (
				this.Direction === undefined &&
				this.Direction === OSUIFramework.Patterns.Carousel.Enum.Direction.None &&
				OutSystems.OSUI.Utils.GetIsRTL()
			) {
				direction = OSUIFramework.GlobalEnum.Direction.RTL;
			} else {
				direction = this.Direction || OSUIFramework.GlobalEnum.Direction.LTR;
			}

			return direction;
		}

		private _getPaginationConfig(): boolean {
			let pagination: boolean;
			switch (this.Navigation) {
				case OSUIFramework.Patterns.Carousel.Enum.Navigation.None:
					pagination = false;
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Navigation.Dots:
					pagination = true;
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Navigation.Arrows:
					pagination = false;
					break;
				case OSUIFramework.Patterns.Carousel.Enum.Navigation.Both:
					pagination = true;
					break;
			}

			return pagination;
		}

		public getProviderConfig(): SplideOpts {
			const providerOptions = {
				arrows: this._getArrowConfig(),
				breakpoints: {
					768: {
						perPage: this.ItemsPhone,
					},
					1024: {
						perPage: this.ItemsTablet,
					},
				},
				keyboard: Enum.KeyboardOptions.Focused,
				direction: this._getDirectionConfig(),
				height: this.Height,
				type: this.Loop ? Enum.TypeOptions.Loop : Enum.TypeOptions.Slide,
				focus: 0,
				perPage: this.ItemsDesktop,
				autoplay: this.AutoPlay,
				padding: this.Padding,
				pagination: this._getPaginationConfig(),
				gap: this.ItemsGap,
				start: this.StartingPosition,
			};

			//Cleanning undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions;
		}
	}
}
