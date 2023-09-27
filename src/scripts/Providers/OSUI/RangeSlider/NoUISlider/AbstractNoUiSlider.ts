// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.RangeSlider.NoUISlider {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export abstract class AbstractNoUiSlider<C extends NoUiSlider.AbstractNoUiSliderConfig>
		extends OSFramework.OSUI.Patterns.RangeSlider.AbstractRangeSlider<NoUiSlider, C>
		implements INoUiSlider
	{
		// Store if the mode is Interval
		private _isInterval: boolean;
		// Store the provider target elem
		private _rangeSliderProviderElem: HTMLElement;
		// RangeSlider events
		protected eventProviderValueChanged: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Store the provider options
		protected noUiSliderOpts: NoUiSliderOptions;
		protected platformEventValueChange: OSFramework.OSUI.Patterns.RangeSlider.Callbacks.OSOnValueChangeEvent;
		// throttle before invoking the platform
		protected throttleTimeValue = 200;
		// throttle timer id
		protected throttleTimer = undefined;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);

			this._isInterval =
				this.configs.rangeSliderMode === OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode.Interval;
		}

		// Method to togghe the disabled attribute
		private _setIsDisabled(isDisabled: boolean): void {
			isDisabled ? this.provider.disable() : this.provider.enable();
		}

		// Method to set the OnValueChangeEvent
		private _setOnValueChangeEvent(changeEvent: RangeSlider.NoUiSlider.Enum.NoUISliderEvents): void {
			this.provider.on(changeEvent, this.eventProviderValueChanged);
		}

		// Method to create/update the Size CSS Variable
		private _setSize(): void {
			if (this.configs.Size.includes('%') && parseFloat(this.configs.Size) > 100) {
				this.configs.Size = OSFramework.OSUI.Patterns.RangeSlider.Enum.DefaultValues.PercentualSize;

				console.warn(
					`The value of the Size property on the '${this.widgetId}' ${OSFramework.OSUI.GlobalEnum.PatternName.RangeSlider} can't be smaller than '${OSFramework.OSUI.Patterns.RangeSlider.Enum.DefaultValues.PercentualSize}'.`
				);
			}

			OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
				this.selfElement,
				OSFramework.OSUI.Patterns.RangeSlider.Enum.CssProperties.Size,
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
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		protected createProviderInstance(): void {
			// Init provider
			this.provider = window.noUiSlider.create(this._rangeSliderProviderElem, this.noUiSliderOpts);

			// Set inital visual configs, like size and disabled status
			this.setInitialStates();

			// Set provider Info to be used by setProviderConfigs API calls
			this.updateProviderEvents({
				name: RangeSlider.NoUiSlider.Enum.ProviderInfo.Name,
				version: RangeSlider.NoUiSlider.Enum.ProviderInfo.Version,
				events: this.provider, //this.provider will also contain all the supported lib configs
			});

			this.setInitialCSSClasses();

			// Set OnValueChange event
			this._setOnValueChangeEvent(RangeSlider.NoUiSlider.Enum.NoUISliderEvents.Slide);

			/**
			 * Trigger Innitialized Event.
			 * - This is needed for the patterns based on a provider since at the Initialized Event at the
			 * Platform side, custom code can be added in order to add customization to the provider.
			 * - This way, Initialized Event will be triggered every time a redraw occurs.
			 */
			this.triggerPlatformInitializedEventCallback();
		}

		/**
		 * Method to set the html elements used
		 *
		 * @protected
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		protected setHtmlElements(): void {
			// Element that will be used to init the provider
			this._rangeSliderProviderElem = OSFramework.OSUI.Helper.Dom.ClassSelector(
				this.selfElement,
				OSFramework.OSUI.Patterns.RangeSlider.Enum.CssClass.RangeSliderProviderElem
			);
		}

		/**
		 * Method to set the initial CSS Classes
		 *
		 * @protected
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		protected setInitialCSSClasses(): void {
			// If Orientation is vertical add class
			if (this.configs.Orientation === OSFramework.OSUI.GlobalEnum.Orientation.Vertical) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(
					this.selfElement,
					OSFramework.OSUI.Patterns.RangeSlider.Enum.CssClass.ClassModifier +
						OSFramework.OSUI.GlobalEnum.Orientation.Vertical
				);
				// Otherwise it's horizontal and we don't need a class
			} else if (OSFramework.OSUI.GlobalEnum.Orientation.Horizontal) {
				OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
					this.selfElement,
					OSFramework.OSUI.Patterns.RangeSlider.Enum.CssClass.ClassModifier +
						OSFramework.OSUI.GlobalEnum.Orientation.Vertical
				);
			}

			if (this.configs.ShowTickMarks) {
				OSFramework.OSUI.Helper.Dom.Styles.AddClass(
					this.selfElement,
					OSFramework.OSUI.Patterns.RangeSlider.Enum.CssClass.HasTicks
				);
			} else {
				OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
					this.selfElement,
					OSFramework.OSUI.Patterns.RangeSlider.Enum.CssClass.HasTicks
				);
			}
		}

		/**
		 * Method to set initial visual states from the configs
		 *
		 * @private
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		protected setInitialStates(): void {
			this._setSize();

			this._setIsDisabled(this.configs.IsDisabled);
		}

		/**
		 * Unsets the callbacks.
		 *
		 * @protected
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		protected unsetCallbacks(): void {
			this.eventProviderValueChanged = undefined;
			super.unsetCallbacks();
		}

		/**
		 * Unsets the HTML elements.
		 *
		 * @protected
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		protected unsetHtmlElements(): void {
			this._rangeSliderProviderElem = undefined;
		}

		/**
		 * Builds the Pattern
		 *
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// Check which property changed and call respective method to update it

			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.MinValue:
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.MaxValue:
						this._updateRangeValues();

						break;
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.Orientation:
						this.redraw();
						break;
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.IsDisabled:
						this._setIsDisabled(this.configs.IsDisabled);

						break;
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.TickMarksInterval:
						this.provider.updateOptions({ pips: this.configs.getPipsConfig() });

						break;
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.Step:
						this.provider.updateOptions({ step: this.configs.Step });

						break;
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.Size:
						this._setSize();

						break;
					case OSFramework.OSUI.Patterns.RangeSlider.Enum.Properties.ShowFloatingLabel:
						this.provider.updateOptions({ tooltips: this.configs.getTooltipFormat() });

						break;
				}
			}
		}

		/**
		 * Method to set the RangeSlider instance to disabled
		 *
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		public disable(): void {
			this._setIsDisabled(true);
		}

		/**
		 * Method to remove and destroy RangeSlider instance
		 *
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
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
		 * Method to set the RangeSlider instance to enabled
		 *
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		public enable(): void {
			this._setIsDisabled(false);
		}

		/**
		 * Method to get current RangeSlider value
		 *
		 * @return {*}  {(number | number[])}
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		public getValue(): number | number[] {
			return this.provider.get();
		}

		/**
		 * Sets the callbacks to be used to invoke the platform code.
		 *
		 * @param {string} eventName
		 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		public registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case OSFramework.OSUI.Patterns.RangeSlider.Enum.RangeSliderEvents.OnValueChange:
					if (this.platformEventValueChange === undefined) {
						this.platformEventValueChange = callback;
					}
					break;
				default:
					super.registerCallback(eventName, callback);
					break;
			}
		}

		/**
		 * Method used to set all the extended NoUiSlider properties across the different types of instances
		 *
		 * @param {NoUiSliderOptions} newConfigs
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		public setProviderConfigs(newConfigs: NoUiSliderOptions): void {
			this.configs.setExtensibilityConfigs(newConfigs);

			this.redraw();
			super.setProviderConfigs(newConfigs);
		}

		/**
		 * Method to change the Range Slider trigger to on DragEnd
		 *
		 * @memberof Providers.OSUI.RangeSlider.NoUISlider.AbstractNoUiSlider
		 */
		public setRangeIntervalChangeOnDragEnd(): void {
			// Remove slide default event
			this.provider.off(RangeSlider.NoUiSlider.Enum.NoUISliderEvents.Slide, this.eventProviderValueChanged);
			// Set new Change event
			this._setOnValueChangeEvent(RangeSlider.NoUiSlider.Enum.NoUISliderEvents.Change);
		}

		// Common method all RangeSliders must implement
		protected abstract prepareConfigs(): void;
	}
}
