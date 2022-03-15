/// <reference path="../AbstractNoUiSlider.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.RangeSlider.NoUISlider.SingleSlider {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUINoUiSliderSingle extends AbstractNoUiSlider<NoUISlider.SliderSingle.NoUiSliderSingleConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new NoUISlider.SliderSingle.NoUiSliderSingleConfig(configs));
		}

		private _updateRangeSlider(): void {
			// Get values so the the Range Slider keeps the same values as before is destroyed
			const value = this.getValue();

			this.configs.StartingValueFrom = value as number;
			this.providerOptions = this.configs.getProviderConfig();

			super.updateRangeSlider();
		}

		/**
		 * Handler to trigger the OnValueChange event
		 */
		private _valueChangeCallback(value?: number[]): void {
			if (value !== undefined) {
				//if we received value, means that this was a callback from the Provider. Let's update the values.
				this.configs.StartingValueFrom = value[0];
			}

			//If we're not waiting to send the information
			if (this.trottleTimer === undefined) {
				//Then let's wait _trottleTimeValue ms and send the latest value to the platform
				this.trottleTimer = setTimeout(() => {
					this.platformEventValueChange(this.widgetId, this.configs.StartingValueFrom, undefined);
					this.trottleTimer = undefined;
				}, this.trottleTimeValue);
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

			console.log(this.providerOptions);

			// Instance will be Created!
			super.createProviderInstance();
		}

		protected setA11yProperties(): void {
			this.providerOptions.handleAttributes = [
				{ 'aria-label': RangeSlider.NoUiSlider.Enum.NoUISliderLabels.Single },
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

		public build(): void {
			super.build();

			console.log('Single Class');

			this.prepareConfigs();

			this.setA11yProperties();

			this.finishBuild();
		}

		// Method used to change given propertyName at OnParametersChange platform event
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.ShowTickMarks:
						this._updateRangeSlider();
						break;
				}
			}
		}
	}
}
