// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.RangeSlider.NoUISlider {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export abstract class AbstractNoUiSlider<C extends NoUiSlider.AbstractNoUiSliderConfig>
		extends OSFramework.Patterns.RangeSlider.AbstractRangeSlider<NoUiSlider, C>
		implements INoUiSlider
	{
		// Store if the mode is Interval
		private _isInterval: boolean;
		// Store the provider target elem
		private _rangeSliderProviderElem: HTMLElement;
		// RangeSlider events
		protected eventProviderValueChanged: OSFramework.GlobalCallbacks.Generic;
		protected platformEventInitialize: OSFramework.GlobalCallbacks.OSGeneric;
		protected platformEventValueChange: OSFramework.Patterns.RangeSlider.Callbacks.OSOnValueChangeEvent;
		// Store the provider options
		protected providerOptions: NoUiSliderOptions;
		// throttle before invoking the platform
		protected throttleTimeValue = 200;
		// throttle timer id
		protected throttleTimer = undefined;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			this._isInterval = this.configs.rangeSliderMode === OSFramework.Patterns.RangeSlider.Enum.Mode.Interval;
		}

		// Method to togghe the disabled attribute
		private _setIsDisabled(): void {
			if (this.configs.IsDisabled) {
				OSFramework.Helper.Dom.Disable(this._rangeSliderProviderElem);
			} else {
				OSFramework.Helper.Dom.Enable(this._rangeSliderProviderElem);
			}
		}

		// Method to set the OnValueChangeEvent
		private _setOnValueChangeEvent(changeEvent: RangeSlider.NoUiSlider.Enum.NoUISliderEvents): void {
			this.provider.on(changeEvent, this.eventProviderValueChanged);
		}

		// Method to create/update the Size CSS Variable
		private _setSize(): void {
			if (this.configs.Size.includes('%') && parseFloat(this.configs.Size) > 100) {
				this.configs.Size = OSFramework.Patterns.RangeSlider.Enum.DefaultValues.PercentualSize;

				console.warn(
					`The value of the Size property on the '${this.widgetId}' ${OSFramework.GlobalEnum.PatternName.RangeSlider} can't be smaller than '${OSFramework.Patterns.RangeSlider.Enum.DefaultValues.PercentualSize}'.`
				);
			}

			OSFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				OSFramework.Patterns.RangeSlider.Enum.CssProperties.Size,
				this.configs.Size
			);
		}

		// Method to update range values on RangeSlider
		private _updateRangeValues(): void {
			this.provider.updateOptions({
				range: this.configs.getRangeConfig(),
			});

			if (this.configs.ShowTickMarks) {
				this.provider.updateOptions({ pips: this.configs.getPipsConfig() });
			}
		}

		/**
		 * Method that will create the provider
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		protected createProviderInstance(): void {
			// Set inital library options
			this.setInitialStates();

			// Init provider
			this.provider = window.noUiSlider.create(this._rangeSliderProviderElem, this.providerOptions);

			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: RangeSlider.NoUiSlider.Enum.ProviderInfo.Name,
				version: RangeSlider.NoUiSlider.Enum.ProviderInfo.Version,
				supportedConfigs: this.provider, //this.provider will also contain all the supported lib configs
			});

			// Set OnValueChange event
			this._setOnValueChangeEvent(RangeSlider.NoUiSlider.Enum.NoUISliderEvents.Slide);

			// Trigger platform's InstanceIntializedHandler client Action
			this.triggerPlatformEventInitialized(this.platformEventInitialize);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected setHtmlElements(): void {
			// Element that will be used to init the provider
			this._rangeSliderProviderElem = OSFramework.Helper.Dom.ClassSelector(
				this._selfElem,
				OSFramework.Patterns.RangeSlider.Enum.CssClass.RangeSliderProviderElem
			);
		}

		/**
		 * Method to set the initial CSS Classes
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected setInitialCSSClasses(): void {
			// If Orientation is vertical add class
			if (this.configs.Orientation === OSFramework.GlobalEnum.Orientation.Vertical) {
				OSFramework.Helper.Dom.Styles.AddClass(
					this._selfElem,
					OSFramework.Patterns.RangeSlider.Enum.CssClass.ClassModifier +
						OSFramework.GlobalEnum.Orientation.Vertical
				);
				// Otherwise it's horizontal and we don't need a class
			} else if (OSFramework.GlobalEnum.Orientation.Horizontal) {
				OSFramework.Helper.Dom.Styles.RemoveClass(
					this._selfElem,
					OSFramework.Patterns.RangeSlider.Enum.CssClass.ClassModifier +
						OSFramework.GlobalEnum.Orientation.Vertical
				);
			}

			if (this.configs.ShowTickMarks) {
				OSFramework.Helper.Dom.Styles.AddClass(
					this._selfElem,
					OSFramework.Patterns.RangeSlider.Enum.CssClass.HasTicks
				);
			} else {
				OSFramework.Helper.Dom.Styles.RemoveClass(
					this._selfElem,
					OSFramework.Patterns.RangeSlider.Enum.CssClass.HasTicks
				);
			}
		}

		/**
		 * Method to set the library options from the config
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		protected setInitialStates(): void {
			this._setSize();

			this._setIsDisabled();
		}

		/**
		 * Unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected unsetCallbacks(): void {
			this.eventProviderValueChanged = undefined;
		}

		/**
		 * Unsets the HTML elements.
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected unsetHtmlElements(): void {
			this._rangeSliderProviderElem = undefined;
		}

		/**
		 * Method to remove and destroy RangeSlider instance
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		protected updateRangeSlider(): void {
			this.provider.destroy();
			this.providerOptions = this.configs.getProviderConfig();
			this.createProviderInstance();
			this.setInitialCSSClasses();
		}

		/**
		 * Method to build the pattern.
		 *
		 * @memberof OSUINoUiSlider
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setInitialCSSClasses();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSUINoUiSlider
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// Check which property changed and call respective method to update it

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.Patterns.RangeSlider.Enum.Properties.StartingValueFrom:
						console.warn(
							`${
								this._isInterval
									? OSFramework.GlobalEnum.PatternName.RangeSliderInterval
									: OSFramework.GlobalEnum.PatternName.RangeSlider
							} (${this.widgetId}): changes to ${
								OSFramework.Patterns.RangeSlider.Enum.Properties.StartingValueFrom
							} parameter do not affect the ${
								this._isInterval
									? OSFramework.GlobalEnum.PatternName.RangeSliderInterval
									: OSFramework.GlobalEnum.PatternName.RangeSlider
							}. Use a distinct variable to assign on the OnValueChange event`
						);
						break;
					case OSFramework.Patterns.RangeSlider.Enum.Properties.MinValue:
					case OSFramework.Patterns.RangeSlider.Enum.Properties.MaxValue:
						this._updateRangeValues();

						break;
					case OSFramework.Patterns.RangeSlider.Enum.Properties.Orientation:
						console.warn(
							`RangeSlider${
								this._isInterval ? OSFramework.Patterns.RangeSlider.Enum.Mode.Interval : ''
							} (${this.widgetId}): changes to ${
								OSFramework.Patterns.RangeSlider.Enum.Properties.Orientation
							} parameter do not affect the ${
								this._isInterval
									? OSFramework.GlobalEnum.PatternName.RangeSliderInterval
									: OSFramework.GlobalEnum.PatternName.RangeSlider
							}. Use a distinct variable to assign on the OnValueChange event.`
						);
						break;
					case OSFramework.Patterns.RangeSlider.Enum.Properties.IsDisabled:
						this._setIsDisabled();

						break;
					case OSFramework.Patterns.RangeSlider.Enum.Properties.TickMarksInterval:
						this.provider.updateOptions({ pips: this.configs.getPipsConfig() });

						break;
					case OSFramework.Patterns.RangeSlider.Enum.Properties.Step:
						this.provider.updateOptions({ step: this.configs.Step });

						break;
					case OSFramework.Patterns.RangeSlider.Enum.Properties.Size:
						this._setSize();

						break;
					case OSFramework.Patterns.RangeSlider.Enum.Properties.ShowFloatingLabel:
						this.provider.updateOptions({ tooltips: this.configs.getTooltipFormat() });

						break;
				}
			}
		}

		/**
		 * Method to remove and destroy RangeSlider instance
		 *
		 * @memberof OSUINoUiSlider
		 */
		public dispose(): void {
			if (this.isBuilt) {
				this.unsetCallbacks();
				this.unsetHtmlElements();

				this.provider.destroy();
			}

			super.dispose();
		}

		/**
		 * Method to get current RangeSlider value
		 *
		 * @return {*}  {(number | number[])}
		 * @memberof OSUINoUiSlider
		 */
		public getValue(): number | number[] {
			return this.provider.get();
		}

		/**
		 * Sets the callbacks to be used to invoke the platform code.
		 *
		 * @param {string} eventName
		 * @param {OSFramework.GlobalCallbacks.OSGeneric} callback
		 * @memberof OSUINoUiSlider
		 */
		public registerCallback(eventName: string, callback: OSFramework.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.Patterns.RangeSlider.Enum.RangeSliderEvents.OnInitialize:
					if (this.platformEventInitialize === undefined) {
						this.platformEventInitialize = callback;
					}
					break;
				case OSFramework.Patterns.RangeSlider.Enum.RangeSliderEvents.OnValueChange:
					if (this.platformEventValueChange === undefined) {
						this.platformEventValueChange = callback;
					}
					break;
				default:
					throw new Error(
						`${OSFramework.ErrorCodes.RangeSlider.FailRegisterCallback}:	The given '${eventName}' event name is not defined.`
					);
			}
		}

		/**
		 * Method used to set all the extended NoUiSlider properties across the different types of instances
		 *
		 * @param {NoUiSliderOptions} newConfigs
		 * @memberof AbstractNoUiSlider
		 */
		public setProviderConfigs(newConfigs: NoUiSliderOptions): void {
			this.configs.validateExtensibilityConfigs(newConfigs, this.providerInfo);

			this.updateRangeSlider();
		}

		/**
		 * Method to change the Range Slider trigger to on DragEnd
		 *
		 * @memberof OSUINoUiSlider
		 */
		public setRangeIntervalChangeOnDragEnd(): void {
			// Remove slide default event
			this.provider.off(RangeSlider.NoUiSlider.Enum.NoUISliderEvents.Slide, this.eventProviderValueChanged);
			// Set new Change event
			this._setOnValueChangeEvent(RangeSlider.NoUiSlider.Enum.NoUISliderEvents.Change);
		}

		protected abstract prepareConfigs(): void;
	}
}
