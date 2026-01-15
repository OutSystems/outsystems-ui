/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.MonthPicker.Flatpickr {
	/**
	 * Class that represents the custom configurations received by the Monthpicker.
	 *
	 * @export
	 * @class FlatpickrMonthConfig
	 * @extends {AbstractFlatpickrConfig}
	 */
	export class FlatpickrMonthConfig extends OSFramework.OSUI.Patterns.MonthPicker.AbstractMonthPickerConfig {
		// Store the language that will be assigned as a locale to the MonthPicker
		private _lang: string;
		// Store the Provider Options
		private _providerOptions: FlatpickrOptions;
		// Store configs set using extensibility
		protected providerExtendedOptions: FlatpickrOptions;
		// Stores the ability to allow inputs to be editable or not
		public AllowInput = false;
		// Stores the ability to disable the mobile flatpickr behavior. False is the default provider option
		public DisableMobile = true;
		// Set the OnChange Event that will be defined in the specific context for each Flatpickr mode
		public OnChangeEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Store the OnClose callback to be defined to the Flatpicker config instance
		public OnCloseEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Store the OnOpen callback to be defined to the Flatpicker config instance
		public OnOpenEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;

		// Store the Server Date format that will be used to casting the selected dates into a knowned date by/for Flatpickr
		public ServerDateFormat: string;

		constructor(config: JSON) {
			super(config);

			// Set the lang based on the language that has been defined already
			this._lang = OSFramework.OSUI.Helper.Language.ShortLang;
		}

		// Method used to manage the AM/PM time when it's on use
		private _checkDateFormat(): string {
			// If DateFormat hasn't been defined, set the same format as server date
			return this.DateFormat !== '' ? this._mapProviderDateFormat() : this.ServerDateFormat;
		}

		// Method used to check the language and also map it into Flatpickr expected format
		private _checkLocale(): FlatpickrLocale {
			// FlatpickrLocale script file is already loaded
			let _locale: FlatpickrLocale;
			try {
				// Set the locale in order to define the calendar language
				_locale = window.flatpickr.l10ns[this._lang];
			} catch (error) {
				throw new Error(`${Flatpickr.ErrorCodes.FailSetLocale}: Locale '${this._lang}' not found!`);
			}

			return _locale;
		}

		// Method used to check the serverDateFormat and map it into the Flatpickr expected format
		private _checkServerDateFormat(): void {
			this.ServerDateFormat = OSFramework.OSUI.Helper.Dates.ServerFormat.replace(
				OSFramework.OSUI.GlobalEnum.DateFormat.YYYY,
				OSFramework.OSUI.GlobalEnum.DateFormat.Y
			)
				.replace(OSFramework.OSUI.GlobalEnum.DateFormat.MM, OSFramework.OSUI.GlobalEnum.DateFormat.m)
				.replace(OSFramework.OSUI.GlobalEnum.DateFormat.DD, OSFramework.OSUI.Constants.EmptyString);
		}

		// Method to get a valid Date from the month and year configs
		private _getDateFromMonthYear(monthYear: MonthYear): Date {
			const _monthIndex = OSFramework.OSUI.Constants.Months.indexOf(monthYear.Month);
			const _validatedYear = monthYear.Year < 1900 ? null : monthYear.Year;
			let _newDate = undefined;

			if (_monthIndex !== -1 && _validatedYear !== null) {
				_newDate = new Date(_validatedYear, _monthIndex, 1);
			}

			return _newDate;
		}

		// Method used to mapping DateFormat style and map it into Flatpickr expected one
		private _mapProviderDateFormat(): string {
			const _dateFormat = this.DateFormat.replace(/[^a-zA-Z]/g, ' ').split(' ');
			for (const format of _dateFormat) {
				switch (format) {
					// Map Year
					case OSFramework.OSUI.GlobalEnum.DateFormat.YYYY:
						this.DateFormat = this.DateFormat.replace(
							OSFramework.OSUI.GlobalEnum.DateFormat.YYYY,
							OSFramework.OSUI.GlobalEnum.DateFormat.Y
						);
						break;

					case 'YY':
						this.DateFormat = this.DateFormat.replace(
							OSFramework.OSUI.GlobalEnum.DateFormat.YY,
							OSFramework.OSUI.GlobalEnum.DateFormat.y
						);
						break;

					// Map Month
					case 'MMM':
						this.DateFormat = this.DateFormat.replace(
							OSFramework.OSUI.GlobalEnum.DateFormat.MMM,
							OSFramework.OSUI.GlobalEnum.DateFormat.M
						);
						break;

					case 'MM':
						this.DateFormat = this.DateFormat.replace(
							OSFramework.OSUI.GlobalEnum.DateFormat.MM,
							OSFramework.OSUI.GlobalEnum.DateFormat.m
						);
						break;
				}
			}

			return this.DateFormat;
		}

		/**
		 * Method used to set all the config properties for the Month mode type
		 *
		 * @returns {FlatpickrOptions} FlatpickrOptions
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.FlatpickrMonthConfig
		 */
		public getProviderConfig(): FlatpickrOptions {
			this._checkServerDateFormat();
			this._checkDateFormat();

			this._providerOptions = {
				altInput: true,
				allowInput: this.AllowInput,
				dateFormat: this.ServerDateFormat,
				defaultDate: this._getDateFromMonthYear(this.InitialMonth),
				disableMobile: this.DisableMobile,
				maxDate: this._getDateFromMonthYear(this.MaxMonth),
				minDate: this._getDateFromMonthYear(this.MinMonth),
				onChange: this.OnChangeEventCallback,
				onClose: this.OnCloseEventCallback,
				onOpen: this.OnOpenEventCallback,
				plugins: [
					// Provider doesn't has the expected type difined
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-expect-error
					new monthSelectPlugin({
						shorthand: true,
						dateFormat: this.ServerDateFormat,
						altFormat: this.DateFormat,
					}),
				],
				position: OutSystems.OSUI.Utils.GetIsRTL() ? 'below right' : 'below left',
			} as FlatpickrOptions;

			// Make sure locale is not undefined, as when definig the providerOptions defaults in the costructor, the window.locale is no yet available
			if (this._providerOptions.locale === undefined) {
				this._providerOptions.locale = this._checkLocale();
			}

			return this.mergeConfigs(this._providerOptions, undefined, this.providerExtendedOptions);
		}

		/**
		 * Method to set and save the extensibility provider configs
		 *
		 * @param {FlatpickrOptions} newConfigs
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.FlatpickrMonthConfig
		 */
		public setExtensibilityConfigs(newConfigs: FlatpickrOptions): void {
			this.providerExtendedOptions = newConfigs;
		}

		/**
		 * Getter that allows to obtain the MonthPicker Locale language
		 *
		 * @readonly
		 * @type {string}
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.FlatpickrMonthConfig
		 */
		public get Lang(): string {
			return this._lang;
		}

		/**
		 * Set MonthPicker Locale
		 *
		 * @memberof Providers.OSUI.MonthPicker.Flatpickr.FlatpickrMonthConfig
		 */
		public set Lang(value: string) {
			// substring is needed to avoid passing values like "en-EN" since we must use only "en"
			this._lang = value.substring(0, 2);
		}
	}
}
