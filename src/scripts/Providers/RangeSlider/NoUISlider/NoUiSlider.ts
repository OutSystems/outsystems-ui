// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.RangeSlider.NoUISlider {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUINoUiSlider
		extends OSUIFramework.Patterns.RangeSlider.AbstractRangeSlider<NoUiSlider, RangeSlider.NoUiSliderConfig>
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		implements OSUIFramework.Patterns.RangeSlider.IRangeSlider
	{
		private _changeEventDuringSlide: boolean;
		private _eventProviderEnd: OSUIFramework.Callbacks.Generic;
		private _eventProviderStart: OSUIFramework.Callbacks.Generic;
		private _eventProviderValueChanged: OSUIFramework.Callbacks.Generic;
		// Store if the slider is being dragged
		private _isSliding: boolean;
		// RangeSlider events
		private _platformEventInitialize: OSUIFramework.Callbacks.OSRangeSliderInitializeEvent;
		private _platformEventValueChange: OSUIFramework.Callbacks.OSRangeSliderOnValueChangeEvent;
		// Store the provider options
		private _providerOptions: NoUiSliderOptions;
		// Store the provider target elem
		private _rangeSliderProviderElem: HTMLElement;
		// Trottle before invoking the platform
		private _trottleTimeValue = 200;
		// Trottle timer id
		private _trottleTimer: unknown;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new NoUiSliderConfig(configs));

			this._trottleTimer = undefined;
			/* TODO: change this for when client action is created*/
			this._changeEventDuringSlide = true;
		}

		/**
		 * Method that will create the provider
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _createProviderRangeSlider(): void {
			// Set inital library options
			this.setInitialStates();

			// Init provider
			this._provider = window.noUiSlider.create(this._rangeSliderProviderElem, this._providerOptions);

			// Trigger platform's OnInitialize event (done by us, the library doesn't have a 'mount' event)
			this._setOnInitializedEvent();

			// Set the correct type of event to add (Change only triggers when stoping the drag)
			const changeEvent = this._changeEventDuringSlide
				? Enum.NoUISliderEvents.Slide
				: Enum.NoUISliderEvents.Change;

			// Set OnValueChange event
			this._setOnValueChangeEvent(changeEvent);

			// Add these events, to keep stored when the range slider is being dragged.
			// This is later used on changeProperty for InitialValue, to prevent a loop being created when
			// the developer is manipulating the IntialValue variable directly on the OnValueChange event
			// (and by doing that triggering the parameterChange again, and creating a loop)
			if (changeEvent === Enum.NoUISliderEvents.Slide) {
				this.provider.on(Enum.NoUISliderEvents.Start, this._eventProviderStart);
				this.provider.on(Enum.NoUISliderEvents.End, this._eventProviderEnd);
			}
		}

		/**
		 * Handler to trigger the OnEnd event
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _endCallback(): void {
			this._toggleSlideStatus(false);
		}

		/**
		 * Method to handle the pips options from the library
		 *
		 * @private
		 * @param {boolean} isUpdate
		 * @return {*}  {void}
		 * @memberof OSUINoUiSlider
		 */
		private _handleRangePips(isUpdate = true): void {
			let pipsValues = Math.floor(this.configs.TickMarksInterval);

			//To avoid performance issues
			if (pipsValues > this.configs.MaxValue) {
				pipsValues = this.configs.MaxValue;
			}

			// Pips, when they exist, can't be less than 1 (library restraint)
			if (pipsValues < 1) {
				console.warn(
					'Pips, when they exist, can not be less than one (library restraint). If you do not want pips to show, set the ShowPips paramater to false.'
				);
				return;
			}

			// To avoid the creation of minor pips, whatever the value
			const pipsDensity = pipsValues * 100;

			// array to receive the list of pips
			const list = [];

			// pip iterator used on the while
			let pip = this.configs.MinValue;

			// Fill the array with the numbers from min to max values, respecting the interval set on the pipsStepParam
			while (pip <= this.configs.MaxValue) {
				list.push(pip);
				pip += pipsValues;
			}

			// To make sure that a pip is always created for the MaxValue
			if (pip !== this.configs.MaxValue) {
				list.push(this.configs.MaxValue);
			}

			const pips = {
				values: list,
				density: pipsDensity,
				mode: Enum.NoUiSliderModeOptions.Values,
			};

			if (isUpdate) {
				this.provider.updateOptions({ pips });
			} else {
				this._providerOptions.pips = pips;
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
			OSUIFramework.Helper.AsyncInvocation(this._platformEventInitialize, this.widgetId);
		}

		/**
		 * Method to set the OnValueChangeEvent
		 *
		 * @private
		 * @param {Enum.NoUISliderEvents} changeEvent
		 * @memberof OSUINoUiSlider
		 */
		private _setOnValueChangeEvent(changeEvent: Enum.NoUISliderEvents): void {
			this.provider.on(changeEvent, this._eventProviderValueChanged);
		}

		/**
		 * Method to create/update the Size CSS Variable
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _setSize(): void {
			OSUIFramework.Helper.Dom.Styles.SetStyleAttribute(
				this._selfElem,
				OSUIFramework.Patterns.RangeSlider.Enum.CssProperties.Size,
				this.configs.Size
			);
		}

		/**
		 * Handler to trigger the OnStart event
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _startCallback(): void {
			this._toggleSlideStatus(true);
		}

		/**
		 * Method to toggle the _IsSliding property
		 *
		 * @private
		 * @param {boolean} status
		 * @memberof OSUINoUiSlider
		 */
		private _toggleSlideStatus(status: boolean): void {
			this._isSliding = status;
		}

		/**
		 * Method to remove and destroy RangeSlider instance
		 *
		 * @private
		 * @memberof OSUINoUiSlider
		 */
		private _updateRangeSlider(): void {
			// Get values so the the Range Slider keeps the same values as before is destroyed
			const value = this.getValue();

			if (this.configs.IsInterval) {
				this.configs.StartingValueStart = value[0];
				this.configs.StartingValueEnd = value[1];
			} else {
				this.configs.StartingValueStart = value as number;
			}

			this.provider.destroy();
			this._createProviderRangeSlider();
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
		private _valueChangeCallback(value?: number[]): void {
			if (value !== undefined) {
				//if we received value, means that this was a callback from the Provider. Let's update the values.
				this.configs.StartingValueStart = value[0];
				if (this.configs.IsInterval) {
					this.configs.StartingValueEnd = value[1];
				}
			}

			//If we're not waiting to send the information
			if (this._trottleTimer === undefined) {
				//Then let's wait _trottleTimeValue ms and send the latest value to the platform
				this._trottleTimer = setTimeout(() => {
					this._platformEventValueChange(
						this.widgetId,
						this.configs.StartingValueStart,
						this.configs.IsInterval ? this.configs.StartingValueEnd : undefined
					);
					this._trottleTimer = undefined;
				}, this._trottleTimeValue);
			}
		}

		/**
		 * Method to set a default to aria-label on handles, to avoid Lighthouse audit errors
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected setA11yProperties(): void {
			if (this.configs.IsInterval) {
				this._providerOptions.handleAttributes = [
					{ 'aria-label': Enum.NoUISliderLabels.Lower },
					{ 'aria-label': Enum.NoUISliderLabels.Upper },
				];
			} else {
				this._providerOptions.handleAttributes = [{ 'aria-label': Enum.NoUISliderLabels.Single }];
			}
		}

		/**
		 * Sets the callbacks to be used with the provider.
		 *
		 * @protected
		 * @memberof OSUINoUiSlider
		 */
		protected setCallbacks(): void {
			this._eventProviderValueChanged = this._valueChangeCallback.bind(this);
			this._eventProviderEnd = this._endCallback.bind(this);
			this._eventProviderStart = this._startCallback.bind(this);
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
			if (this._configs.Orientation === OSUIFramework.GlobalEnum.Orientation.Vertical) {
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
			this._providerOptions = this.configs.getProviderConfig();

			this.setA11yProperties();

			if (this.configs.ShowTickMarks) {
				this._handleRangePips(false);
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
			this._eventProviderValueChanged = undefined;
			this._eventProviderEnd = undefined;
			this._eventProviderStart = undefined;
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

		public build(): void {
			super.build();

			this.setCallbacks();
			this.setHtmlElements();
			this.setInitialCSSClasses();

			this._createProviderRangeSlider();

			this.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			// Check which property changed and call respective method to update it
			// Library only supports update on some options, so in most cases we need to
			// destroy the object and create a new RangeSlider
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.MinValue:
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.MaxValue:
						this._updateRangeValues();
						this._handleRangePips();

						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.Orientation:
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.ShowTickMarks:
						this._updateRangeSlider();
						this.setInitialCSSClasses();

						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.IsDisabled:
						this._setIsDisabled();

						break;
					case OSUIFramework.Patterns.RangeSlider.Enum.Properties.TickMarksInterval:
						this._handleRangePips();

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
					if (this._platformEventInitialize === undefined) {
						this._platformEventInitialize = callback;
					}
					break;
				case OSUIFramework.Patterns.RangeSlider.Enum.RangeSliderEvents.OnValueChange:
					if (this._platformEventValueChange === undefined) {
						this._platformEventValueChange = callback;
					}
					break;
			}
		}
	}
}
