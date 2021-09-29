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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnEnd: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnStart: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventOnValueChangeEvent: any;
		// Store if the slider is being dragged
		private _isSliding: boolean;
		// RangeSlider events
		private _onInitialize: OSUIFramework.Callbacks.OSRangeSliderInitializeEvent;
		private _onValueChange: OSUIFramework.Callbacks.OSRangeSliderOnValueChangeEvent;
		// Store the provider reference
		private _provider: NoUiSlider;
		// Store the provider options
		private _providerOptions: NoUiSliderOptions;
		// Store the provider target elem
		private _rangeSliderProviderElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new RangeSliderConfig(configs));

			this._eventOnValueChangeEvent = this._triggerOnValueChangeEvent.bind(this);
			this._eventOnEnd = this._triggerOnEndEvent.bind(this);
			this._eventOnStart = this._triggerOnStartEvent.bind(this);
		}

		// Method that will create the provider
		private _createProviderRangeSlider(): void {
			// Set inital library options
			this._setInitialLibraryOptions();

			// Init provider
			this._provider = window.noUiSlider.create(this._rangeSliderProviderElem, this._providerOptions);

			// Trigger platform's OnInitialize event (done by us, the library doesn't have a 'mount' event)
			this._setOnInitializedEvent();

			// Set the correct type of event to add (Change only triggers when stoping the drag)
			const changeEvent = this._configs.ChangeEventDuringSlide
				? Enum.NoUISpliderEvents.Slide
				: Enum.NoUISpliderEvents.Change;

			// Set OnValueChange event
			this._setOnValueChangeEvent(changeEvent);

			// Add these events, to keep stored when the range slider is being dragged.
			// This is later used on changeProperty for InitialValue, to prevent a loop being created when
			// the developer is manipulating the IntialValue variable directly on the OnValueChange event
			// (and by doing that triggering the parameterChange again, and creating a loop)
			if (changeEvent === Enum.NoUISpliderEvents.Slide) {
				this._provider.on(Enum.NoUISpliderEvents.Start, this._eventOnStart);
				this._provider.on(Enum.NoUISpliderEvents.End, this._eventOnEnd);
			}
		}

		// Method to set the html elements used
		private _setHtmllElements(): void {
			// Element that will be used to init the provider
			this._rangeSliderProviderElem = this._selfElem.querySelector(
				OSUIFramework.Constants.Dot + OSUIFramework.Patterns.RangeSlider.Enum.CssClass.RangeSliderProviderElem
			);
		}

		// Method to set the library options from the config
		private _setInitialLibraryOptions(): void {
			this._providerOptions = this._configs.getProviderConfig();

			if (this._configs.ShowPips) {
				this.handleRangePips(this._configs.PipsStep, false);
			}

			if (this._configs.IsVertical) {
				this.setVerticalHeight(this._configs.VerticalHeight);
			}

			this.setIsDisabled(this._configs.IsDisabled);
		}

		// Method to set the OnInitializeEvent
		private _setOnInitializedEvent(): void {
			setTimeout(() => {
				this._onInitialize(this.widgetId);
			}, 0);
		}

		// Method to set the OnValueChangeEvent
		private _setOnValueChangeEvent(changeEvent): void {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this._provider.on(changeEvent, this._eventOnValueChangeEvent);
		}

		// Method to toggle the _IsSliding property
		private _toggleSlideStatus(status: boolean): void {
			this._isSliding = status;
		}

		// Handler to trigger the OnEnd event
		private _triggerOnEndEvent(): void {
			this._toggleSlideStatus(false);
		}

		// Handler to trigger the OnStart event
		private _triggerOnStartEvent(): void {
			this._toggleSlideStatus(true);
		}

		// Handler to trigger the OnValueChange event
		private _triggerOnValueChangeEvent(value: number): void {
			setTimeout(() => {
				this._onValueChange(this.widgetId, Math.floor(value));
			}, 0);
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
			// Library only supports update on some options, so in most cases we need to
			// destroy the object and create a new RangeSlider
			switch (propertyName) {
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.MinValue:
					this.updateRangeValues(propertyValue, this._configs.MaxValue);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.MaxValue:
					this.updateRangeValues(this._configs.MinValue, propertyValue);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.InitialValue:
					this._configs.InitialValue = propertyValue;
					if (!this._isSliding) {
						this.setValue(propertyValue);
					}

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.ChangeEventDuringSlide:
					this._configs.ChangeEventDuringSlide = propertyValue;
					this.updateRangeSlider();

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.IsDisabled:
					this._configs.IsDisabled = propertyValue;
					this.setIsDisabled(propertyValue);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.IsVertical:
					this._configs.IsVertical = propertyValue;
					this.updateRangeSlider();

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.PipsStep:
					this._configs.PipsStep = propertyValue;
					this.handleRangePips(propertyValue, true);

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.ShowPips:
					this._configs.ShowPips = propertyValue;
					this.updateRangeSlider();

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.Step:
					this._configs.Step = propertyValue;
					this._provider.updateOptions({ step: propertyValue });

					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.Properties.VerticalHeight:
					this._configs.VerticalHeight = propertyValue;
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

		// Method to get current RangeSlider value
		public getValue(): number {
			return this.provider.get();
		}

		// Method to handle the pips options from the library
		public handleRangePips(pipsStepParam: number, isUpdate: boolean): void {
			let pipsValues = Math.floor(pipsStepParam);

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
						mode: Enum.NoUiSpliderModeOptions.Count,
					},
				});
			} else {
				this._providerOptions.pips = {
					values: pipsValues,
					density: pipsDensity,
					stepped: true,
					mode: Enum.NoUiSpliderModeOptions.Count,
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

		// Method to togghe the disabled attribute
		public setIsDisabled(isDisabled: boolean): void {
			const isRangeSliderDisabled = OSUIFramework.Helper.Attribute.Get(this._rangeSliderProviderElem, 'disabled');

			if (isDisabled) {
				OSUIFramework.Helper.Attribute.Set(this._rangeSliderProviderElem, 'disabled', 'true');
			} else if (!isDisabled && isRangeSliderDisabled) {
				OSUIFramework.Helper.Attribute.Remove(this._rangeSliderProviderElem, 'disabled');
			}
		}

		// Method to set a new value to the RangeSlider
		public setValue(value: number): void {
			this.provider.set(value);
			// Trigger platform event after setting the value
			this._triggerOnValueChangeEvent(value);
		}

		// Method to create/update the VerticalHieght CSS Variable
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

		// Method to update range values on RangeSlider
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
