/// <reference path="../AbstractNoUiSlider.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.RangeSlider.NoUISlider.IntervalSlider {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUINoUiSliderInterval extends AbstractNoUiSlider<NoUISlider.SliderInterval.NoUiSliderIntervalConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new NoUISlider.SliderInterval.NoUiSliderIntervalConfig(configs));
		}

		// Method to trigger the a destroy & creation of new provider instance, with configs updated
		private _updateRangeSlider(): void {
			// Get values so the the Range Slider keeps the same values as before is destroyed
			const value = this.getValue();

			this.configs.StartingValueFrom = value[0];
			this.configs.StartingValueTo = value[1];

			this.providerOptions = this.configs.getProviderConfig();

			super.updateRangeSlider();
		}

		// Handler to trigger the OnValueChange event
		private _valueChangeCallback(value?: number[]): void {
			if (value !== undefined) {
				//if we received value, means that this was a callback from the Provider. Let's update the values.
				this.configs.StartingValueFrom = value[0];
				this.configs.StartingValueTo = value[1];
			}

			//If we're not waiting to send the information
			if (this.throttleTimer === undefined) {
				//Then let's wait _throttleTimeValue ms and send the latest value to the platform
				this.throttleTimer = setTimeout(() => {
					this.platformEventValueChange(
						this.widgetId,
						this.configs.StartingValueFrom,
						this.configs.StartingValueTo
					);
					this.throttleTimer = undefined;
				}, this.throttleTimeValue);
			}
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

		/**
		 * Method to set the Accessibility attributes
		 *
		 * @protected
		 * @memberof OSUINoUiSliderInterval
		 */
		protected setA11yProperties(): void {
			this.providerOptions.handleAttributes = [
				{ 'aria-label': RangeSlider.NoUiSlider.Enum.NoUISliderLabels.Lower },
				{ 'aria-label': RangeSlider.NoUiSlider.Enum.NoUISliderLabels.Upper },
			];
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected setCallbacks(): void {
			this.eventProviderValueChanged = this._valueChangeCallback.bind(this);
		}

		/**
		 * Method to build the pattern
		 *
		 * @memberof OSUINoUiSliderInterval
		 */
		public build(): void {
			super.build();

			this.setCallbacks();

			this.prepareConfigs();

			this.setA11yProperties();

			this.finishBuild();
		}

		/**
		 * Method used to change given propertyName at OnParametersChange platform event
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSUINoUiSliderInterval
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.StartingValueTo:
						console.warn(
							`${OSUIFramework.GlobalEnum.PatternsNames.RangeSliderInterval}': (${this.widgetId}): changes to ${OSUIFramework.Patterns.RangeSlider.Enum.Properties.StartingValueTo} parameter do not affect the ${OSUIFramework.GlobalEnum.PatternsNames.RangeSliderInterval}'. Use a distinct variable to assign on the OnValueChange event`
						);
						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.ShowTickMarks:
						// Library only supports update on some options, so we need to
						// destroy the object and create a new RangeSlider
						this._updateRangeSlider();
						break;
				}
			}
		}
	}
}
