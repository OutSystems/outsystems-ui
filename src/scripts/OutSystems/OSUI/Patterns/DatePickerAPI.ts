// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DatePickerAPI {
	const _datePickerItemsMap = new Map<string, OSFramework.OSUI.Patterns.DatePicker.IDatePicker>(); //DatePicker.uniqueId -> DatePicker obj

	/**
	 * Function that will change the property of a given DatePicker Id.
	 *
	 * @export
	 * @param {string} datePickerId ID of the DatePicker where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(datePickerId: string, propertyName: string, propertyValue: any): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailChangeProperty,
			callback: () => {
				const _datePickerItem = GetDatePickerItemById(datePickerId);

				_datePickerItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Function used to Resets the selected dates (if any) and clears the input from a Given Id datepicker
	 *
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*} Response Object as a JSON String
	 */
	export function Clear(datePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailClear,
			callback: () => {
				const _datePickerItem = GetDatePickerItemById(datePickerId);

				_datePickerItem.clear();
			},
		});

		return result;
	}

	/**
	 * Function used to Close the Datepicker with the Given Id
	 *
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*} Response Object as a JSON String
	 */
	export function Close(datePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailClose,
			callback: () => {
				const _datePickerItem = GetDatePickerItemById(datePickerId);

				_datePickerItem.close();
			},
		});

		return result;
	}

	/**
	 * Create the new DatePickerItem instance and add it to the datePickerItemsMap
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @param {string} mode Set which calendar type should be created (SingleDate, RangeDate).
	 * @param {string} provider Set which provider should be used to create the calendar instance.
	 * @return {*} (OSFramework.OSUI.Patterns.DatePicker.IDatePicker) - Instance created of the new DatePicker
	 */
	export function Create(
		datePickerId: string,
		configs: string,
		mode: OSFramework.OSUI.Patterns.DatePicker.Enum.Mode,
		provider: string
	): OSFramework.OSUI.Patterns.DatePicker.IDatePicker {
		if (_datePickerItemsMap.has(datePickerId)) {
			throw new Error(`There is already an DatePicker registered under id: ${datePickerId}`);
		}

		const _datePickerItem = OSFramework.OSUI.Patterns.DatePicker.Factory.NewDatePicker(
			datePickerId,
			configs,
			mode,
			provider
		);

		_datePickerItemsMap.set(datePickerId, _datePickerItem);

		return _datePickerItem;
	}

	/**
	 * Function that will disable the native behavior of DatePicker
	 *
	 * @export
	 * @param {string} datePickerId
	 * @return {*} Response Object as a JSON String
	 */
	export function ToggleNativeBehavior(datePickerId: string, IsNative: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailToggleNativeBehavior,
			callback: () => {
				const _datePicker = this.GetDatePickerItemById(datePickerId);
				_datePicker.toggleNativeBehavior(IsNative);
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given DatePickerItem Id
	 *
	 * @export
	 * @param {string} datePickerId
	 * @return {*} Response Object as a JSON String
	 */
	export function Dispose(datePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailDispose,
			callback: () => {
				const _datePickerItem = GetDatePickerItemById(datePickerId);

				_datePickerItem.dispose();

				_datePickerItemsMap.delete(_datePickerItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the DatePicker instances at the page
	 *
	 * @export
	 * @return {*}  Array containing all the Ids of the DatePickers existing in the current screen.
	 */
	export function GetAllDatePickerItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_datePickerItemsMap);
	}

	/**
	 * Function that gets the instance of DatePicker, by a given ID.
	 *
	 * @export
	 * @param {string} datePickerId ID of the DatePicker that will be looked for.
	 * @return {*}  (OSFramework.OSUI.Patterns.DatePicker.IDatePicker) - Instance of the given DatePicker Id.
	 */
	export function GetDatePickerItemById(datePickerId: string): OSFramework.OSUI.Patterns.DatePicker.IDatePicker {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'DatePicker',
			datePickerId,
			_datePickerItemsMap
		) as OSFramework.OSUI.Patterns.DatePicker.IDatePicker;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*} (OSFramework.OSUI.Patterns.DatePicker.IDatePicker) - Instance of the given DatePicker Id.
	 */
	export function Initialize(datePickerId: string): OSFramework.OSUI.Patterns.DatePicker.IDatePicker {
		const _datePickerItem = GetDatePickerItemById(datePickerId);

		_datePickerItem.build();

		return _datePickerItem;
	}

	/**
	 * Function used to Open the Datepicker with the Given Id
	 *
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*} Response Object as a JSON String
	 */
	export function Open(datePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailOpen,
			callback: () => {
				const _datePickerItem = GetDatePickerItemById(datePickerId);

				_datePickerItem.open();
			},
		});

		return result;
	}

	/**
	 * Function that will be triggered everytime there is a render at DatePicker
	 *
	 * @export
	 * @param {string} datePickerId
	 * @return {*}  {string}
	 */
	export function OnRender(datePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailOnRender,
			callback: () => {
				const _datePickerItem = GetDatePickerItemById(datePickerId);

				_datePickerItem.onRender();
			},
		});

		return result;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*} Response Object as a JSON String
	 */
	export function RegisterCallback(
		datePickerId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailRegisterCallback,
			callback: () => {
				const _datePicker = this.GetDatePickerItemById(datePickerId);

				_datePicker.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will/should be triggered after some parameters changed
	 *
	 * @export
	 * @param {string} datePickerId
	 * @return {*} Response Object as a JSON String
	 */
	export function Redraw(datePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailRedraw,
			callback: () => {
				const _datePicker = this.GetDatePickerItemById(datePickerId);

				_datePicker.redraw();
			},
		});

		return result;
	}

	/**
	 * Function that will set a different language to a given DatePickerId
	 *
	 * @param datePickerId
	 * @param isoCode ISO Code language that will be assigned
	 * @return {*} Response Object as a JSON String
	 */
	export function SetLanguage(datePickerId: string, isoCode: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailSetLanguage,
			callback: () => {
				const _datePicker = this.GetDatePickerItemById(datePickerId);

				_datePicker.setLanguage(isoCode);
			},
		});

		return result;
	}

	/**
	 * Function that will update the InitialDate for a given DatepickerId
	 * 	When:
	 * 		SingleDate
	 * 			=> Date1 = InitialDate
	 * 			=> Date2 = Ignored!
	 *
	 * 		RangeDate
	 * 			=> Date1 = InitialStartDate
	 * 			=> Date2 = InitialEndDate
	 *
	 * @param {string} datePickerId
	 * @param {string} date1 The value for the date1
	 * @param {string} date2 The value for the date2
	 * @return {*} Response Object as a JSON String
	 */
	export function UpdateInitialDate(datePickerId: string, date1: string, date2?: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailUpdateInitialDate,
			callback: () => {
				if (OSFramework.OSUI.Helper.Dates.IsNull(date1)) {
					throw new Error(`Given Date: '${date1}', can't be Null.`);
				} else if (
					OSFramework.OSUI.Helper.Dates.IsNull(date1) === false &&
					date2 !== undefined &&
					OSFramework.OSUI.Helper.Dates.IsNull(date2) === false &&
					OSFramework.OSUI.Helper.Dates.IsBeforeThan(date1, date2) === false
				) {
					throw new Error(`Date1: '${date1}', can't be after Date2: '${date2}'.`);
				} else {
					const _datePicker = this.GetDatePickerItemById(datePickerId);
					_datePicker.updateInitialDate(date1, date2);
				}
			},
		});

		return result;
	}

	/**
	 * Function that will update the prompt message for a given DatepickerId
	 *
	 * @param {string} datePickerId
	 * @param {string} promptMessage The value for the prompt message
	 * @return {*} Response Object as a JSON String
	 */
	export function UpdatePrompt(datePickerId: string, promptMessage: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailUpdatePrompt,
			callback: () => {
				const _datePicker = this.GetDatePickerItemById(datePickerId);

				_datePicker.updatePrompt(promptMessage);
			},
		});

		return result;
	}

	/**
	 * Function to disable days
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {string} disableDays
	 * @return {*} Response Object as a JSON String
	 */
	export function DisableDays(datePickerId: string, disableDays: string[]): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailDisableDays,
			callback: () => {
				const datePicker = GetDatePickerItemById(datePickerId);

				datePicker.disableDays(disableDays);
			},
		});

		return result;
	}

	/**
	 * Function to disable weekdays
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {string} disableWeekDays
	 * @return {*} Response Object as a JSON String
	 */
	export function DisableWeekDays(datePickerId: string, disableWeekDays: number[]): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailDisableWeekDays,
			callback: () => {
				const datePicker = GetDatePickerItemById(datePickerId);

				datePicker.disableWeekDays(disableWeekDays);
			},
		});

		return result;
	}

	/**
	 * Function to set providerConfigs by extensibility
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {DatePickerProviderConfigs} providerConfigs
	 * @return {*} Response Object as a JSON String
	 */
	export function SetProviderConfigs(datePickerId: string, providerConfigs: DatePickerProviderConfigs): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailRegisterProviderConfig,
			callback: () => {
				const datePicker = GetDatePickerItemById(datePickerId);

				datePicker.setProviderConfigs(providerConfigs);
			},
		});

		return result;
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.Generic} callback
	 * @return {*} Response Object as a JSON String
	 */
	export function SetProviderEvent(
		datePickerId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.Generic
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailRegisterProviderEvent,
			hasValue: true,
			callback: () => {
				const _eventUniqueId = OSFramework.OSUI.Helper.Dom.GenerateUniqueId();
				const datePicker = GetDatePickerItemById(datePickerId);
				datePicker.setProviderEvent(eventName, callback, _eventUniqueId);

				return _eventUniqueId;
			},
		});

		return result;
	}

	/**
	 * Function to remove providerEvents added by extensibility
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {string} eventId
	 * @return {*} Response Object as a JSON String
	 */
	export function UnsetProviderEvent(datePickerId: string, eventId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailRemoveProviderEvent,
			callback: () => {
				const datePicker = GetDatePickerItemById(datePickerId);
				datePicker.unsetProviderEvent(eventId);
			},
		});

		return result;
	}

	/**
	 * Function that will set the input as editable
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {boolean} IsEditable
	 * @return {*} Response Object as a JSON String
	 */
	export function SetEditableInput(datePickerId: string, IsEditable: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailSetEditableInput,
			callback: () => {
				const _datePicker = this.GetDatePickerItemById(datePickerId);
				_datePicker.setEditableInput(IsEditable);
			},
		});

		return result;
	}
}
