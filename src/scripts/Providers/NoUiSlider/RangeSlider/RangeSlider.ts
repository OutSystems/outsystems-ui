// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.RangeSlider {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class RangeSlider
		extends OSUIFramework.Patterns.RangeSlider.AbstractRangeSlider<Providers.RangeSlider.RangeSliderConfig>
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		implements Providers.RangeSlider.IRangeSliderProvider
	{
		private _onInitialize: OSUIFramework.Callbacks.OSRangeSliderInitializeEvent;
		private _onValueChange: OSUIFramework.Callbacks.OSRangeSliderOnValueChangeEvent;
		// Store the provider reference
		private _provider: NoUiSlider;
		private _providerOptions: NoUiSliderOptions;
		private _rangeSliderProviderElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new RangeSliderConfig(configs));
		}

		private _createProviderRangeSlider(): void {
			this._setInitialLibraryOptions();

			this._provider = window.noUiSlider.create(this._rangeSliderProviderElem, this._providerOptions);

			this._setOnInitializedEvent();

			const changeEvent = this._configs.OptionalConfigs.ChangeEventDuringSlide
				? Enum.NoUISpliderEvents.Update
				: Enum.NoUISpliderEvents.Change;

			this._setOnValueChangeEvent(changeEvent);
		}

		private _setHtmllElements(): void {
			this._rangeSliderProviderElem = this._selfElem.querySelector(
				OSUIFramework.Constants.Dot + OSUIFramework.Patterns.RangeSlider.Enum.CssClass.RangeSliderProviderElem
			);
		}

		private _setInitialLibraryOptions(): void {
			this._providerOptions = {
				direction: OutSystems.OSUI.Utils.GetIsRTL() ? 'rtl' : 'ltr',
				start: [this._configs.InitialValue],
				step: this._configs.OptionalConfigs.Step,
				connect: 'lower',
				orientation: this._configs.OptionalConfigs.IsVertical ? 'vertical' : 'horizontal',
				range: {
					min: this._configs.MinValue,
					max: this._configs.MaxValue === this._configs.MinValue ? 100 : this._configs.MaxValue,
				},
			};

			if (this._configs.OptionalConfigs.ShowPips) {
				this.handleRangePips(this._configs.OptionalConfigs.PipsStep, false);
			}

			if (this._configs.OptionalConfigs.IsVertical) {
				this.setVerticalHeight(this._configs.OptionalConfigs.VerticalHeight);
			}

			this.setIsDisabled(this._configs.OptionalConfigs.IsDisabled);
		}

		// Method to set the OnInitializeEvent
		private _setOnInitializedEvent(): void {
			setTimeout(() => {
				this._onInitialize(this.widgetId);
			});
		}

		// Method to set the OnValueChangeEvent
		private _setOnValueChangeEvent(changeEvent): void {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this._provider.on(changeEvent, (value: number) => {
				setTimeout(() => {
					this._onValueChange(this.widgetId, Math.floor(value));
				}, 0);
			});
		}

		public build(): void {
			super.build();

			this._setHtmllElements();

			this._createProviderRangeSlider();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			switch (propertyName) {
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.MinValue:
					this.updateRangeValues(propertyValue, this._configs.MaxValue);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.MaxValue:
					this.updateRangeValues(this._configs.MinValue, propertyValue);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.InitialValue:
					this._configs.InitialValue = propertyValue;
					this.setValue(propertyValue);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.ChangeEventDuringSlide:
					this._configs.OptionalConfigs.ChangeEventDuringSlide = propertyValue;
					this.updateRangeSlider();

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.IsDisabled:
					this._configs.OptionalConfigs.IsDisabled = propertyValue;
					this.setIsDisabled(propertyValue);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.IsVertical:
					this._configs.OptionalConfigs.IsVertical = propertyValue;
					this.updateRangeSlider();

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.PipsStep:
					this._configs.OptionalConfigs.PipsStep = propertyValue;
					this.handleRangePips(propertyValue, true);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.ShowPips:
					this._configs.OptionalConfigs.ShowPips = propertyValue;
					this.updateRangeSlider();

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.Step:
					this._configs.OptionalConfigs.Step = propertyValue;
					this._provider.updateOptions({ step: propertyValue });

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.VerticalHeight:
					this._configs.OptionalConfigs.VerticalHeight = propertyValue;
					this.setVerticalHeight(propertyValue);

					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		// Method to remove and destroy RangeSlider instance
		public dispose(): void {
			// Check if provider is ready
			if (this.isBuilt) {
				this._provider.destroy();
			}

			super.dispose();
		}

		public getValue(): number {
			return this.provider.get();
		}

		public handleRangePips(pipsStepParam: number, isUpdate: boolean): void {
			let pipsValues = Math.floor(pipsStepParam);
			const mode = pipsValues > 10 ? 'range' : 'count';

			if (pipsValues <= 1) {
				// steps, when they exist, can't be less than 2 (library restraint)
				pipsValues = 2;
			}

			const pipsDensity = (pipsValues - 1) * 100;

			if (isUpdate) {
				this._provider.updateOptions({
					pips: {
						values: pipsValues,
						density: pipsDensity,
						mode: mode,
					},
				});
			} else {
				this._providerOptions.pips = {
					values: pipsValues,
					density: pipsDensity,
					stepped: true,
					mode: mode,
				};
			}
		}

		// Provider getter
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		public get provider(): NoUiSlider {
			return this._provider;
		}

		public registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
			switch (eventName) {
				case OSUIFramework.Patterns.RangeSlider.Enum.RangeSliderEvents.OnValueChange:
					this._onValueChange = callback;
					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.RangeSliderEvents.OnInitialize:
					this._onInitialize = callback;
					break;
			}
		}

		public setIsDisabled(isDisabled: boolean): void {
			const isRangeSliderDisabled = OSUIFramework.Helper.Attribute.Get(this._rangeSliderProviderElem, 'disabled');

			if (isDisabled) {
				OSUIFramework.Helper.Attribute.Set(this._rangeSliderProviderElem, 'disabled', 'true');
			} else if (!isDisabled && isRangeSliderDisabled) {
				OSUIFramework.Helper.Attribute.Remove(this._rangeSliderProviderElem, 'disabled');
			}
		}

		public setValue(value: number): void {
			this.provider.set(value);
		}

		public setVerticalHeight(height: number): void {
			OSUIFramework.Helper.Style.SetStyleAttribute(
				this._selfElem,
				OSUIFramework.Patterns.RangeSlider.Enum.CssProperties.VerticalHeight,
				height + OSUIFramework.GlobalEnum.Units.Pixel
			);
		}

		// Method to remove and destroy RangeSlider instance
		public updateRangeSlider(): void {
			if (typeof this._provider === 'object') {
				this._provider.destroy();
			}

			this._createProviderRangeSlider();
		}

		public updateRangeValues(min: number, max: number): void {
			this.provider.updateOptions({
				range: {
					min: min,
					max: max === min ? 100 : max,
				},
			});

			this._configs.MinValue = min;
			this._configs.MaxValue = max;
		}
	}
}
