/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Splide {
	export class SplideConfig extends OSFramework.Patterns.Carousel.AbstractCarouselConfig {
		// Store provider configs
		private _providerOptions: SplideOpts;
		// Store configs set using extensibility
		protected _providerExtendedOptions: SplideOpts;

		private _getArrowConfig(): boolean {
			let arrows: boolean;
			switch (this.Navigation) {
				case OSFramework.Patterns.Carousel.Enum.Navigation.None:
					arrows = false;
					break;
				case OSFramework.Patterns.Carousel.Enum.Navigation.Dots:
					arrows = false;
					break;
				case OSFramework.Patterns.Carousel.Enum.Navigation.Arrows:
					arrows = true;
					break;
				case OSFramework.Patterns.Carousel.Enum.Navigation.Both:
					arrows = true;
					break;
			}

			return arrows;
		}

		private _getDirectionConfig(): 'ltr' | 'rtl' | 'ttb' {
			let direction: 'ltr' | 'rtl' | 'ttb';
			if (this.Direction === undefined && OutSystems.OSUI.Utils.GetIsRTL()) {
				direction = OSFramework.GlobalEnum.Direction.RTL;
			} else {
				direction = this.Direction || OSFramework.GlobalEnum.Direction.LTR;
			}

			return direction;
		}

		private _getPaginationConfig(): boolean {
			let pagination: boolean;
			switch (this.Navigation) {
				case OSFramework.Patterns.Carousel.Enum.Navigation.None:
					pagination = false;
					break;
				case OSFramework.Patterns.Carousel.Enum.Navigation.Dots:
					pagination = true;
					break;
				case OSFramework.Patterns.Carousel.Enum.Navigation.Arrows:
					pagination = false;
					break;
				case OSFramework.Patterns.Carousel.Enum.Navigation.Both:
					pagination = true;
					break;
			}

			return pagination;
		}

		/**
		 * Method to get and merge internal and external provider configs
		 *
		 * @return {*}  {SplideOpts}
		 * @memberof SplideConfig
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
		 * @memberof SplideConfig
		 */
		public setExtensibilityConfigs(newConfigs: SplideOpts): void {
			this._providerExtendedOptions = newConfigs;
		}
	}
}
