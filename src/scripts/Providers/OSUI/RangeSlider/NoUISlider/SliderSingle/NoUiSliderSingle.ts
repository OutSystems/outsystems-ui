/// <reference path="../AbstractNoUiSlider.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.RangeSlider.NoUISlider.SingleSlider {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUINoUiSliderSingle extends AbstractNoUiSlider<NoUISlider.SliderSingle.NoUiSliderSingleConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new NoUISlider.SliderSingle.NoUiSliderSingleConfig(configs));
		}

		// Handler to trigger the OnValueChange event
		private _valueChangeCallback(value?: number[]): void {
			if (value !== undefined) {
				//if we received value, means that this was a callback from the Provider. Let's update the values.
				this.configs.StartingValueFrom = value[0];
			}

			//If we're not waiting to send the information
			if (this.throttleTimer === undefined) {
				//Then let's wait _throttleTimeValue ms and send the latest value to the platform
				this.throttleTimer = setTimeout(() => {
					this.platformEventValueChange(this.widgetId, this.configs.StartingValueFrom, undefined);
					this.throttleTimer = undefined;
				}, this.throttleTimeValue);
			}
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this.noUiSliderOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance();
		}

		/**
		 * Redraw the pattern
		 *
		 * @protected
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.IntervalSlider.OSUINoUiSliderInterval
		 */
		protected redraw(): void {
			// Get values so the the Range Slider keeps the same values as before is destroyed
			const value = this.getValue();

			this.configs.StartingValueFrom = value as number;

			super.redraw();
		}

		/**
		 * Method to set the Accessibility attributes
		 *
		 * @protected
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle
		 */
		protected setA11YProperties(): void {
			this.noUiSliderOpts.handleAttributes = [
				{ 'aria-label': RangeSlider.NoUiSlider.Enum.NoUISliderLabels.Single },
			];
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle
		 */
		protected setCallbacks(): void {
			this.eventProviderValueChanged = this._valueChangeCallback.bind(this);
		}

		/**
		 * Builds the Pattern
		 *
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle
		 */
		public build(): void {
			super.build();

			this.setCallbacks();

			this.prepareConfigs();

			this.setA11YProperties();

			this.finishBuild();
		}

		/**
		 * Method used to change given propertyName at OnParametersChange platform event
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.StartingValueFrom:
						this.setValue(propertyValue as number);
						break;
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.ShowTickMarks:
						// Library only supports update on some options, so we need to
						// destroy the object and create a new RangeSlider
						this.redraw();
						break;
				}
			}
		}

		/**
		 * Method to set current RangeSlider value
		 *
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle
		 */
		public resetValue(): void {
			this.configs.StartingValueFrom = this.configs.InitialValueFrom;
			this.provider.set(this.configs.InitialValueFrom);
		}

		/**
		 * Method to set current RangeSlider value
		 *
		 * @param {number} value
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.SingleSlider.OSUINoUiSliderSingle
		 */
		public setValue(value: number): void {
			if (value >= this.configs.MinValue && value <= this.configs.MaxValue) {
				this.configs.StartingValueFrom = value;
				this.provider.set(value);
			} else {
				throw new Error(
					`${OSFramework.OSUI.ErrorCodes.RangeSlider.FailSetValue}: The value must be between the minimum value and maximum value set.`
				);
			}
		}
	}
}
