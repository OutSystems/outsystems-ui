// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TimePickerAPI {
	const _timePickerItemsMap = new Map<string, OSFramework.Patterns.TimePicker.ITimePicker>(); //TimePicker.uniqueId -> TimePicker obj

	/**
	 * Function that will change the property of a given TimePicker Id.
	 *
	 * @export
	 * @param {string} timePickerId ID of the TimePicker where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(timePickerId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePickerItem = GetTimePickerItemById(timePickerId);

			_timePickerItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function used to Resets the selected time (if any) and clears the input from a Given Id timepicker
	 *
	 * @param {string} timePickerId ID of the TimePickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.TimePicker.ITimePicker}
	 */
	export function Clear(timePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePickerItem = GetTimePickerItemById(timePickerId);

			_timePickerItem.clear();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailClear;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function used to Close the Timepicker with the Given Id
	 *
	 * @param {string} timePickerId ID of the TimePickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.TimePicker.ITimePicker}
	 */
	export function Close(timePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePickerItem = GetTimePickerItemById(timePickerId);

			_timePickerItem.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailClose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new TimePickerItem instance and add it to the timePickerItemsMap
	 *
	 * @export
	 * @param {string} timePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @param {string} provider Set which provider should be used to create the calendar instance.
	 * @return {*}  {OSFramework.Patterns.TimePicker.ITimePicker}
	 */
	export function Create(
		timePickerId: string,
		configs: string,
		provider: string
	): OSFramework.Patterns.TimePicker.ITimePicker {
		if (_timePickerItemsMap.has(timePickerId)) {
			throw new Error(`There is already an TimePicker registered under id: ${timePickerId}`);
		}

		const _timePickerItem = OSFramework.Patterns.TimePicker.Factory.NewTimePicker(timePickerId, configs, provider);

		_timePickerItemsMap.set(timePickerId, _timePickerItem);

		return _timePickerItem;
	}

	/**
	 * Function that will disable the native behavior of TimePicker
	 *
	 * @export
	 * @param {string} timePickerId
	 * @return {*}  {string}
	 */
	export function ToggleNativeBehavior(timePickerId: string, IsNative: boolean): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePicker = this.GetTimePickerItemById(timePickerId);
			_timePicker.toggleNativeBehavior(IsNative);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will dispose the instance of the given TimePickerItem Id
	 *
	 * @export
	 * @param {string} timePickerId
	 */
	export function Dispose(timePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePickerItem = GetTimePickerItemById(timePickerId);

			_timePickerItem.dispose();

			_timePickerItemsMap.delete(_timePickerItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the TimePicker instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllTimePickerItemsMap(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_timePickerItemsMap);
	}

	/**
	 * Function that gets the instance of TimePicker, by a given ID.
	 *
	 * @export
	 * @param {string} timePickerId ID of the TimePicker that will be looked for.
	 * @return {*}  {OSFramework.Patterns.TimePicker.ITimePicker;}
	 */
	export function GetTimePickerItemById(timePickerId: string): OSFramework.Patterns.TimePicker.ITimePicker {
		return OSFramework.Helper.MapOperation.FindInMap(
			'TimePicker',
			timePickerId,
			_timePickerItemsMap
		) as OSFramework.Patterns.TimePicker.ITimePicker;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} timePickerId ID of the TimePickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.TimePicker.ITimePicker}
	 */
	export function Initialize(timePickerId: string): OSFramework.Patterns.TimePicker.ITimePicker {
		const _timePickerItem = GetTimePickerItemById(timePickerId);

		_timePickerItem.build();

		return _timePickerItem;
	}

	/**
	 * Function used to Open the Timepicker with the Given Id
	 *
	 * @param {string} timePickerId ID of the TimePickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.TimePicker.ITimePicker}
	 */
	export function Open(timePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePickerItem = GetTimePickerItemById(timePickerId);

			_timePickerItem.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailOpen;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} timePickerId
	 * @param {string} eventName
	 * @param {OSFramework.GlobalCallbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		timePickerId: string,
		eventName: string,
		callback: OSFramework.GlobalCallbacks.OSGeneric
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePicker = this.GetTimePickerItemById(timePickerId);

			_timePicker.registerCallback(eventName, callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will/should be triggered after some parameters changed
	 *
	 * @export
	 * @param {string} timePickerId
	 */
	export function Redraw(timePickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePicker = this.GetTimePickerItemById(timePickerId);

			_timePicker.redraw();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will set a different language to a given TimePickerId
	 *
	 * @param timePickerId
	 * @param isoCode ISO Code language that will be assigned
	 * @returns
	 */
	export function SetLanguage(timePickerId: string, isoCode: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePicker = this.GetTimePickerItemById(timePickerId);

			_timePicker.setLanguage(isoCode);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will update the InitialDate fot a given TimepickerId
	 * 	When:
	 * 		SingleDate
	 * 			=> Date1 = InitialDate
	 * 			=> Date2 = Ignored!
	 *
	 * 		RangeDate
	 * 			=> Date1 = InitialStartDate
	 * 			=> Date2 = InitialEndDate
	 *
	 * @param {string} timePickerId
	 * @param {string} date1 The value for the date1
	 * @param {string} date2 The value for the date2
	 
	export function UpdateInitialDate(timePickerId: string, date1: string, date2?: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePicker = this.GetTimePickerItemById(timePickerId);

			_timePicker.updateInitialDate(date1, date2);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}*/

	/**
	 * Function to set providerConfigs by extensibility
	 *
	 * @export
	 * @param {string} timePickerId
	 * @param {TimePickerProviderConfigs} providerConfigs
	 * @return {*}  {string}
	 */
	export function SetProviderConfigs(timePickerId: string, providerConfigs: TimePickerProviderConfigs): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const timePicker = GetTimePickerItemById(timePickerId);

			timePicker.setProviderConfigs(providerConfigs);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRegisterProviderConfig;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @export
	 * @param {string} timePickerId
	 * @param {string} eventName
	 * @param {OSFramework.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
	 */
	export function SetProviderEvent(
		timePickerId: string,
		eventName: string,
		callback: OSFramework.GlobalCallbacks.Generic
	): string {
		const _eventUniqueId = OSFramework.Helper.Dom.GenerateUniqueId();

		const responseObj = {
			uniqueId: _eventUniqueId,
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const timePicker = GetTimePickerItemById(timePickerId);
			timePicker.setProviderEvent(eventName, callback, _eventUniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRegisterProviderEvent;
			responseObj.uniqueId = undefined;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to remove providerEvents added by extensibility
	 *
	 * @export
	 * @param {string} timePickerId
	 * @param {string} eventId
	 * @return {*}  {string}
	 */
	export function UnsetProviderEvent(timePickerId: string, eventId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const timePicker = GetTimePickerItemById(timePickerId);
			timePicker.unsetProviderEvent(eventId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRemoveProviderEvent;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will set the input as editable
	 *
	 * @export
	 * @param {string} timePickerId
	 * @param {boolean} IsEditable
	 * @return {*}  {string}
	 */
	export function SetEditableInput(timePickerId: string, IsEditable: boolean): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _timePicker = this.GetTimePickerItemById(timePickerId);
			_timePicker.setEditableInput(IsEditable);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TimePicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}
}
