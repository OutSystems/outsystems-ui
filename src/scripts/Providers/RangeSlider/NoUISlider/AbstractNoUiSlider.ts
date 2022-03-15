// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.RangeSlider.NoUISlider {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export abstract class AbstractNoUiSlider<C extends NoUiSlider.AbstractNoUiSliderConfig>
		extends OSUIFramework.Patterns.RangeSlider.AbstractRangeSlider<NoUiSlider, C>
		implements INoUiSlider
	{
		// Store the provider target elem
		private _rangeSliderProviderElem: HTMLElement;

		protected eventProviderValueChanged: OSUIFramework.Callbacks.Generic;
		// RangeSlider events
		protected platformEventInitialize: OSUIFramework.Callbacks.OSRangeSliderInitializeEvent;
		protected platformEventValueChange: OSUIFramework.Callbacks.OSRangeSliderOnValueChangeEvent;
		// Store the provider options
		protected providerOptions: NoUiSliderOptions;
		// Trottle before invoking the platform
		protected trottleTimeValue = 200;
		// Trottle timer id
		protected trottleTimer: unknown;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			this.trottleTimer = undefined;
		}

		/**
		 * Method to handle the ticks options from the library
		 *
		 * @private
		 * @param {boolean} isUpdate
		 * @return {*}  {void}
		 * @memberof OSUINoUiSlider
		 */
		private _handleRangeTicks(isUpdate = true): void {
			let tickMarksValues = Math.floor(this.configs.TickMarksInterval);

			//To avoid performance issues
			if (tickMarksValues > this.configs.MaxValue) {
				tickMarksValues = this.configs.MaxValue;
			}
			// Ticks, when they exist, can't be decimal (library restraint)
			if (tickMarksValues < 1) {
				console.warn(
					'The interval between tick marks, when they exist, can not be smaller than one or a decimal number (library restraint). If you do not want TickMarks to show, set the ShowTickMarks parameter to false.'
				);
				this.configs.TickMarksInterval = 1;
				return;
			}

			// To avoid the creation of minor ticks, whatever the value
			const ticksDensity = tickMarksValues * 100;

			// array to receive the list of ticks
			const list = [];

			// tick iterator used on the while
			let tick = this.configs.MinValue;

			// Fill the array with the numbers from min to max values, respecting the interval set on the TickMarksInterval
			while (tick <= this.configs.MaxValue) {
				list.push(tick);
				tick += tickMarksValues;
			}

			// To make sure that a tick is always created for the MaxValue
			if (tick !== this.configs.MaxValue) {
				list.push(this.configs.MaxValue);
			}

			const ticks = {
				values: list,
				density: ticksDensity,
				mode: RangeSlider.NoUiSlider.Enum.NoUiSliderModeOptions.Values,
			};

			if (isUpdate) {
				this.provider.updateOptions({ pips: ticks });
			} else {
				this.providerOptions.pips = ticks;
			}
		}

		/**
		 * Method to togghe the disabled attribute
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _setIsDisabled(): void {
			if (this.configs.IsDisabled) {
				OSUIFramework.Helper.Dom.Disable(this._rangeSliderProviderElem);
			} else {
				OSUIFramework.Helper.Dom.Enable(this._rangeSliderProviderElem);
			}
		}

		/**
		 * Method to set the OnInitializeEvent
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _setOnInitializedEvent(): void {
			OSUIFramework.Helper.AsyncInvocation(this.platformEventInitialize, this.widgetId);
		}

		/**
		 * Method to set the OnValueChangeEvent
		 *
		 * @private
		 * @param {Enum.NoUISliderEvents} changeEvent
		 * @memberof OSUINoUiSlider
		 */
		private _setOnValueChangeEvent(changeEvent: RangeSlider.NoUiSlider.Enum.NoUISliderEvents): void {
			this.provider.on(changeEvent, this.eventProviderValueChanged);
		}

		/**
		 * Method to create/update the Size CSS Variable
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _setSize(): void {
			if (this.configs.Size.indexOf('%') > -1 && parseFloat(this.configs.Size) > 100) {
				this.configs.Size = OSUIFramework.Patterns.RangeSlider.Enum.DefaultValues.PercentualSize;

				console.warn(
					`The value of the Size property on the '${this.widgetId}' ${OSUIFramework.GlobalEnum.PatternsNames.RangeSlider} can't be smaller than '${OSUIFramework.Patterns.RangeSlider.Enum.DefaultValues.PercentualSize}'.`
				);
			}

			OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				OSUIFramework.Patterns.RangeSlider.Enum.CssProperties.Size,
				this.configs.Size
			);
		}

		/**
		 * Method to update range values on RangeSlider
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _updateRangeValues(): void {
			this.provider.updateOptions({
				range: this.configs.getRangeConfig(),
			});

			if (this.configs.ShowTickMarks) {
				this._handleRangeTicks();
			}
		}

		/**
		 * Method to update tooltips visibility on RangeSlider
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _updateTooltipVisibility(): void {
			this.provider.updateOptions({
				tooltips: this.configs.setTooltipVisibility(this.configs.ShowFloatingLabel),
			});
		}

		/**
		 * Handler to trigger the OnValueChange event
		 *
		 * @private
		 * @param {(number | number[])} value
		 * @memberof OSUINoUiSlider
		 */
		/* 		private _valueChangeCallback(value?: number[]): void {
			if (value !== undefined) {
				//if we received value, means that this was a callback from the Provider. Let's update the values.
				this.configs.StartingValueFrom = value[0];
				if (this.configs.IsInterval) {
					this.configs.StartingValueTo = value[1];
				}
			}

			//If we're not waiting to send the information
			if (this._trottleTimer === undefined) {
				//Then let's wait _trottleTimeValue ms and send the latest value to the platform
				this._trottleTimer = setTimeout(() => {
					this.platformEventValueChange(
						this.widgetId,
						this.configs.StartingValueFrom,
						this.configs.IsInterval ? this.configs.StartingValueTo : undefined
					);
					this._trottleTimer = undefined;
				}, this._trottleTimeValue);
			}
		} */

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

			// Trigger platform's OnInitialize event (done by us, the library doesn't have a 'mount' event)
			this._setOnInitializedEvent();

			// Set OnValueChange event
			this._setOnValueChangeEvent(RangeSlider.NoUiSlider.Enum.NoUISliderEvents.Slide);
		}

		/**
		 * Method to set a default to aria-label on handles, to avoid Lighthouse audit errors
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected setA11yProperties(): void {
			if (this.configs.IsInterval) {
				this.providerOptions.handleAttributes = [
					{ 'aria-label': RangeSlider.NoUiSlider.Enum.NoUISliderLabels.Lower },
					{ 'aria-label': RangeSlider.NoUiSlider.Enum.NoUISliderLabels.Upper },
				];
			} else {
				this.providerOptions.handleAttributes = [
					{ 'aria-label': RangeSlider.NoUiSlider.Enum.NoUISliderLabels.Single },
				];
			}
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected setCallbacks(): void {
			//this.eventProviderValueChanged = this._valueChangeCallback.bind(this);
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected setHtmlElements(): void {
			// Element that will be used to init the provider
			this._rangeSliderProviderElem = OSUIFramework.Helper.Dom.ClassSelector(
				this._selfElem,
				OSUIFramework.Patterns.RangeSlider.Enum.CssClass.RangeSliderProviderElem
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
			if (this.configs.Orientation === OSUIFramework.GlobalEnum.Orientation.Vertical) {
				OSUIFramework.Helper.Dom.Styles.AddClass(
					this._selfElem,
					OSUIFramework.Patterns.RangeSlider.Enum.CssClass.ClassModifier +
						OSUIFramework.GlobalEnum.Orientation.Vertical
				);
				// Otherwise it's horizontal and we don't need a class
			} else if (OSUIFramework.GlobalEnum.Orientation.Horizontal) {
				OSUIFramework.Helper.Dom.Styles.RemoveClass(
					this._selfElem,
					OSUIFramework.Patterns.RangeSlider.Enum.CssClass.ClassModifier +
						OSUIFramework.GlobalEnum.Orientation.Vertical
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
			this.providerOptions = this.configs.getProviderConfig();

			this.setA11yProperties();

			if (this.configs.ShowTickMarks) {
				this._handleRangeTicks(false);
			}

			if (this.configs.Orientation) {
				this._setSize();
			}

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
			// Get values so the the Range Slider keeps the same values as before is destroyed
			const value = this.getValue();

			if (this.configs.IsInterval) {
				this.configs.StartingValueFrom = value[0];
				this.configs.StartingValueTo = value[1];
			} else {
				this.configs.StartingValueFrom = value as number;
			}

			this.provider.destroy();
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
			this.setCallbacks();
			this.setHtmlElements();
			this.setInitialCSSClasses();

			this.createProviderInstance();

			this.finishBuild();
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
			// Library only supports update on some options, so in most cases we need to
			// destroy the object and create a new RangeSlider
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.StartingValueFrom:
						console.warn(
							`RangeSlider${this.configs.IsInterval ? 'Interval' : ''} (${this.widgetId}): changes to ${
								OSUIFramework.Patterns.RangeSlider.Enum.Properties.StartingValueFrom
							} parameter do not affect the RangeSlider${
								this.configs.IsInterval ? 'Interval' : ''
							}. Use a distinct variable to assign on the OnValueChange event`
						);
						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.StartingValueTo:
						console.warn(
							`RangeSlider${this.configs.IsInterval ? 'Interval' : ''} (${this.widgetId}): changes to ${
								OSUIFramework.Patterns.RangeSlider.Enum.Properties.StartingValueTo
							} parameter do not affect the RangeSlider${
								this.configs.IsInterval ? 'Interval' : ''
							}. Use a distinct variable to assign on the OnValueChange event`
						);
						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.MinValue:
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.MaxValue:
						this._updateRangeValues();

						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.Orientation:
						console.warn(
							`RangeSlider${this.configs.IsInterval ? 'Interval' : ''} (${this.widgetId}): changes to ${
								OSUIFramework.Patterns.RangeSlider.Enum.Properties.Orientation
							} parameter do not affect the RangeSlider${
								this.configs.IsInterval ? 'Interval' : ''
							}. Use a distinct variable to assign on the OnValueChange event`
						);
						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.IsDisabled:
						this._setIsDisabled();

						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.TickMarksInterval:
						this._handleRangeTicks();

						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.Step:
						this.provider.updateOptions({ step: this.configs.Step });

						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.Size:
						this._setSize();

						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.ShowFloatingLabel:
						this._updateTooltipVisibility();

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
		 * @param {OSUIFramework.Callbacks.OSGeneric} callback
		 * @memberof OSUINoUiSlider
		 */
		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.RangeSlider.Enum.RangeSliderEvents.OnInitialize:
					if (this.platformEventInitialize === undefined) {
						this.platformEventInitialize = callback;
					}
					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.RangeSliderEvents.OnValueChange:
					if (this.platformEventValueChange === undefined) {
						this.platformEventValueChange = callback;
					}
					break;
			}
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
