// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DatePickerAPI {
	const _datePickerItemsMap = new Map<string, OSFramework.Patterns.DatePicker.IDatePicker>(); //DatePicker.uniqueId -> DatePicker obj

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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePickerItem = GetDatePickerItemById(datePickerId);

			_datePickerItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function used to Resets the selected dates (if any) and clears the input from a Given Id datepicker
	 *
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.DatePicker.IDatePicker}
	 */
	export function Clear(datePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePickerItem = GetDatePickerItemById(datePickerId);

			_datePickerItem.clear();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailClear;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function used to Close the Datepicker with the Given Id
	 *
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.DatePicker.IDatePicker}
	 */
	export function Close(datePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePickerItem = GetDatePickerItemById(datePickerId);

			_datePickerItem.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailClose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new DatePickerItem instance and add it to the datePickerItemsMap
	 *
	 * @export
	 * @param {string} datePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @param {string} mode Set which calendar type should be created (SingleDate, RangeDate).
	 * @param {string} provider Set which provider should be used to create the calendar instance.
	 * @return {*}  {OSFramework.Patterns.DatePicker.IDatePicker}
	 */
	export function Create(
		datePickerId: string,
		configs: string,
		mode: OSFramework.Patterns.DatePicker.Enum.Mode,
		provider: string
	): OSFramework.Patterns.DatePicker.IDatePicker {
		if (_datePickerItemsMap.has(datePickerId)) {
			throw new Error(`There is already an DatePicker registered under id: ${datePickerId}`);
		}

		const _datePickerItem = OSFramework.Patterns.DatePicker.Factory.NewDatePicker(
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
	 * @return {*}  {string}
	 */
	export function ToggleNativeBehavior(datePickerId: string, IsNative: boolean): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePicker = this.GetDatePickerItemById(datePickerId);
			_datePicker.toggleNativeBehavior(IsNative);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will dispose the instance of the given DatePickerItem Id
	 *
	 * @export
	 * @param {string} datePickerId
	 */
	export function Dispose(datePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePickerItem = GetDatePickerItemById(datePickerId);

			_datePickerItem.dispose();

			_datePickerItemsMap.delete(_datePickerItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the DatePicker instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllDatePickerItemsMap(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_datePickerItemsMap);
	}

	/**
	 * Function that gets the instance of DatePicker, by a given ID.
	 *
	 * @export
	 * @param {string} datePickerId ID of the DatePicker that will be looked for.
	 * @return {*}  {OSFramework.Patterns.DatePicker.IDatePicker;}
	 */
	export function GetDatePickerItemById(datePickerId: string): OSFramework.Patterns.DatePicker.IDatePicker {
		return OSFramework.Helper.MapOperation.FindInMap(
			'DatePicker',
			datePickerId,
			_datePickerItemsMap
		) as OSFramework.Patterns.DatePicker.IDatePicker;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.DatePicker.IDatePicker}
	 */
	export function Initialize(datePickerId: string): OSFramework.Patterns.DatePicker.IDatePicker {
		const _datePickerItem = GetDatePickerItemById(datePickerId);

		_datePickerItem.build();

		return _datePickerItem;
	}

	/**
	 * Function used to Open the Datepicker with the Given Id
	 *
	 * @param {string} datePickerId ID of the DatePickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.DatePicker.IDatePicker}
	 */
	export function Open(datePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePickerItem = GetDatePickerItemById(datePickerId);

			_datePickerItem.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailOpen;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {string} eventName
	 * @param {OSFramework.GlobalCallbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		datePickerId: string,
		eventName: string,
		callback: OSFramework.GlobalCallbacks.OSGeneric
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePicker = this.GetDatePickerItemById(datePickerId);

			_datePicker.registerCallback(eventName, callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will/should be triggered after some parameters changed
	 *
	 * @export
	 * @param {string} datePickerId
	 */
	export function Redraw(datePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePicker = this.GetDatePickerItemById(datePickerId);

			_datePicker.redraw();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will set a different language to a given DatePickerId
	 *
	 * @param datePickerId
	 * @param isoCode ISO Code language that will be assigned
	 * @returns
	 */
	export function SetLanguage(datePickerId: string, isoCode: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePicker = this.GetDatePickerItemById(datePickerId);

			_datePicker.setLanguage(isoCode);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will update the InitialDate fot a given DatepickerId
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
	 */
	export function UpdateInitialDate(datePickerId: string, date1: string, date2?: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePicker = this.GetDatePickerItemById(datePickerId);

			_datePicker.updateInitialDate(date1, date2);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will set the input as editable
	 *
	 * @export
	 * @param {string} datePickerId
	 * @param {boolean} IsEditable
	 * @return {*}  {string}
	 */
	export function SetEditableInput(datePickerId: string, IsEditable: boolean): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _datePicker = this.GetDatePickerItemById(datePickerId);
			_datePicker.setEditableInput(IsEditable);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DatePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}
}
