// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DatePickerAPI {
	const _datePickerItemsMap = new Map<string, OSFramework.OSUI.Patterns.DatePicker.IDatePicker>(); //DatePicker.uniqueId -> DatePicker obj

	/**
	 * Function that will change the property of a given DatePicker Id.
	 *
	 * @param datePickerId ID of the DatePicker where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(datePickerId: string, propertyName: string, propertyValue: unknown): string {
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
	 * @param datePickerId ID of the DatePickerItem that will be initialized.
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId ID of the DatePickerItem that will be initialized.
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @param mode Set which calendar type should be created (SingleDate, RangeDate).
	 * @param provider Set which provider should be used to create the calendar instance.
	 * @returns (OSFramework.OSUI.Patterns.DatePicker.IDatePicker) - Instance created of the new DatePicker
	 */
	export function Create(
		datePickerId: string,
		configs: string | Configs,
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
	 * @param datePickerId ID of the DatePicker pattern.
	 * @param isNative True to use the native (mobile) picker, false to keep the provider calendar.
	 * @returns Response Object as a JSON String
	 */
	export function ToggleNativeBehavior(datePickerId: string, isNative: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailToggleNativeBehavior,
			callback: () => {
				const _datePicker = this.GetDatePickerItemById(datePickerId);
				_datePicker.toggleNativeBehavior(isNative);
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given DatePickerItem Id
	 *
	 * @param datePickerId The id of the DatePicker element
	 * @returns Response Object as a JSON String
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
	 * @returns Array containing all the Ids of the DatePickers existing in the current screen.
	 */
	export function GetAllDatePickerItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_datePickerItemsMap);
	}

	/**
	 * Function that gets the instance of DatePicker, by a given ID.
	 *
	 * @param datePickerId ID of the DatePicker that will be looked for.
	 * @returns (OSFramework.OSUI.Patterns.DatePicker.IDatePicker) - Instance of the given DatePicker Id.
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
	 * @param datePickerId ID of the DatePickerItem that will be initialized.
	 * @returns (OSFramework.OSUI.Patterns.DatePicker.IDatePicker) - Instance of the given DatePicker Id.
	 */
	export function Initialize(datePickerId: string): OSFramework.OSUI.Patterns.DatePicker.IDatePicker {
		const _datePickerItem = GetDatePickerItemById(datePickerId);

		_datePickerItem.build();

		return _datePickerItem;
	}

	/**
	 * Function used to Open the Datepicker with the Given Id
	 *
	 * @param datePickerId ID of the DatePickerItem that will be initialized.
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param datePickerId The id of the DatePicker element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns Response Object as a JSON String
	 */
	export function RegisterCallback(
		datePickerId: string,
		eventName: EventName,
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
	 * @param datePickerId The id of the DatePicker element
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param isoCode ISO Code language that will be assigned
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param date1 The value for the date1
	 * @param date2 The value for the date2
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param promptMessage The value for the prompt message
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param disableDays The dates to disable, as a JSON array of ISO dates
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param disableWeekDays The week days to disable, 0 (Sunday) to 6
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param providerConfigs The provider configuration options as a JSON string or object
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param eventId The id of the provider event
	 * @returns Response Object as a JSON String
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
	 * @param datePickerId The id of the DatePicker element
	 * @param isEditable Whether the input accepts typed values
	 * @returns Response Object as a JSON String
	 */
	export function SetEditableInput(datePickerId: string, isEditable: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DatePicker.FailSetEditableInput,
			callback: () => {
				const _datePicker = this.GetDatePickerItemById(datePickerId);
				_datePicker.setEditableInput(isEditable);
			},
		});

		return result;
	}
}
