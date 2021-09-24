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
					max: this._configs.MinValue === this._configs.MinValue ? 100 : this._configs.MinValue,
				},
			};

			if (this._configs.OptionalConfigs.ShowPips) {
				const pipsStep = Math.floor(this._configs.OptionalConfigs.PipsStep);
				const pipsValues = pipsStep <= 1 ? 2 : pipsStep;
				const mode = pipsValues > 10 ? window.NoUiSliderPipsMode.Count : window.NoUiSliderPipsMode.Range;
				const pipsDensity = (pipsValues - 1) * 100;

				this._providerOptions.pips = {
					values: pipsValues,
					density: pipsDensity,
					stepped: true,
					mode: mode,
				};
			}
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
			this._provider.on(changeEvent, (value: any) => {
				setTimeout(() => {
					this._onValueChange(this.widgetId, parseFloat(value));
				}, 0);
			});
		}

		public build(): void {
			super.build();

			this._setHtmllElements();

			this._setInitialLibraryOptions();

			this._createProviderRangeSlider();

			this.finishBuild();
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
	}
}
