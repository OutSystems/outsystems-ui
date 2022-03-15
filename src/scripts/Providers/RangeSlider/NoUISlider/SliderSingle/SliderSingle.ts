/// <reference path="../AbstractNoUiSlider.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.RangeSlider.NoUISlider.SingleSlider {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUINoUiSliderSingleSlider extends AbstractNoUiSlider<NoUISlider.SliderSingle.NoUiSliderSingleConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new NoUISlider.SliderSingle.NoUiSliderSingleConfig(configs));
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof OSUINoUiSliderSingleSlider
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this.providerOptions = this.configs.getProviderConfig();

			// Instance will be Created!
			super.createProviderInstance();
		}

		public build(): void {
			super.build();

			this.prepareConfigs();

			this.finishBuild();
		}

		// Method used to change given propertyName at OnParametersChange platform event
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
		}
	}
}
