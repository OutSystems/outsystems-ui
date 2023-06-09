/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.Carousel.Splide {
	export class SplideConfig extends OSFramework.OSUI.Patterns.Carousel.AbstractCarouselConfig {
		// Store configs set using extensibility
		private _providerExtendedOptions: SplideOpts;
		// Store provider configs
		private _providerOptions: SplideOpts;

		// Prepare Arrows expected config
		private _getArrowConfig(): boolean {
			let arrows: boolean;
			switch (this.Navigation) {
				case OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.None:
					arrows = false;
					break;
				case OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.Dots:
					arrows = false;
					break;
				case OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.Arrows:
					arrows = true;
					break;
				case OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.Both:
					arrows = true;
					break;
			}

			return arrows;
		}

		// Prepare Direction expected config
		private _getDirectionConfig():
			| OSFramework.OSUI.GlobalEnum.Direction.LTR
			| OSFramework.OSUI.GlobalEnum.Direction.RTL
			| OSFramework.OSUI.GlobalEnum.Direction.TTB {
			let direction:
				| OSFramework.OSUI.GlobalEnum.Direction.LTR
				| OSFramework.OSUI.GlobalEnum.Direction.RTL
				| OSFramework.OSUI.GlobalEnum.Direction.TTB;
			if (this.Direction === undefined && OutSystems.OSUI.Utils.GetIsRTL()) {
				direction = OSFramework.OSUI.GlobalEnum.Direction.RTL;
			} else {
				direction = this.Direction || OSFramework.OSUI.GlobalEnum.Direction.LTR;
			}

			return direction;
		}

		// Prepare Pagination expected config
		private _getPaginationConfig(): boolean {
			let pagination: boolean;
			switch (this.Navigation) {
				case OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.None:
					pagination = false;
					break;
				case OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.Dots:
					pagination = true;
					break;
				case OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.Arrows:
					pagination = false;
					break;
				case OSFramework.OSUI.Patterns.Carousel.Enum.Navigation.Both:
					pagination = true;
					break;
			}

			return pagination;
		}

		/**
		 * Method to get and merge internal and external provider configs
		 *
		 * @return {*}  {SplideOpts}
		 * @memberof Providers.OSUI.Carousel.Splide.SplideConfig
		 */
		public getProviderConfig(): SplideOpts {
			this._providerOptions = {
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
				snap: true,
				dragMinThreshold: 30,
			};

			return this.mergeConfigs(this._providerOptions, undefined, this._providerExtendedOptions);
		}

		/**
		 * Method to set and save the extensibility provider configs
		 *
		 * @param {SplideOpts} newConfigs
		 * @memberof Providers.OSUI.Carousel.Splide.SplideConfig
		 */
		public setExtensibilityConfigs(newConfigs: SplideOpts): void {
			this._providerExtendedOptions = newConfigs;
		}
	}
}
