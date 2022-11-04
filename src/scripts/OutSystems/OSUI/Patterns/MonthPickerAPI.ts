// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.MonthPickerAPI {
	const _monthPickerItemsMap = new Map<string, OSFramework.Patterns.MonthPicker.IMonthPicker>(); //MonthPicker.uniqueId -> MonthPicker obj

	/**
	 * Function that will change the property of a given MonthPicker Id.
	 *
	 * @export
	 * @param {string} monthPickerId ID of the MonthPicker where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(monthPickerId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

			_monthPickerItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function used to Resets the selected month (if any) and clears the input from a Given Id monthpicker
	 *
	 * @param {string} monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker}
	 */
	export function Clear(monthPickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _MonthPickerItem = GetMonthPickerItemById(monthPickerId);

			_MonthPickerItem.clear();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailClear;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function used to Close the monthpicker with the Given Id
	 *
	 * @param {string} monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker}
	 */
	export function Close(monthPickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _MonthPickerItem = GetMonthPickerItemById(monthPickerId);

			_MonthPickerItem.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailClose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new MonthPickerItem instance and add it to the monthPickerItemsMap
	 *
	 * @export
	 * @param {string} monthPickerId ID of the Pattern that a new instance will be created.
	 * @param {string} provider Set which provider should be used to create the monthPicker instance.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker}
	 */
	export function Create(
		monthPickerId: string,
		configs: string,
		provider: string
	): OSFramework.Patterns.MonthPicker.IMonthPicker {
		if (_monthPickerItemsMap.has(monthPickerId)) {
			throw new Error('There is already an MonthPicker registered under id: ' + monthPickerId);
		}

		const _monthPickerItem = OSFramework.Patterns.MonthPicker.Factory.NewMonthPicker(
			monthPickerId,
			provider,
			configs
		);

		_monthPickerItemsMap.set(monthPickerId, _monthPickerItem);

		return _monthPickerItem;
	}

	/**
	 * Function that will dispose the instance of the given MonthPickerItem Id
	 *
	 * @export
	 * @param {string} monthPickerId
	 */
	export function Dispose(monthPickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

			_monthPickerItem.dispose();

			_monthPickerItemsMap.delete(_monthPickerItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will return the Map with all the MonthPicker instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllMonthPickerItemsMap(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_monthPickerItemsMap);
	}

	/**
	 * Function that gets the instance of MonthPicker, by a given ID.
	 *
	 * @export
	 * @param {string} monthPickerId ID of the MonthPicker that will be looked for.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker;}
	 */
	export function GetMonthPickerItemById(monthPickerId: string): OSFramework.Patterns.MonthPicker.IMonthPicker {
		return OSFramework.Helper.MapOperation.FindInMap(
			'MonthPicker',
			monthPickerId,
			_monthPickerItemsMap
		) as OSFramework.Patterns.MonthPicker.IMonthPicker;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker}
	 */
	export function Initialize(monthPickerId: string): OSFramework.Patterns.MonthPicker.IMonthPicker {
		const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

		_monthPickerItem.build();

		return _monthPickerItem;
	}

	/**
	 * Function used to Open the monthpicker with the Given Id
	 *
	 * @param {string} monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.MonthPicker.IMonthPicker}
	 */
	export function Open(monthPickerId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _MonthPickerItem = GetMonthPickerItemById(monthPickerId);

			_MonthPickerItem.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailOpen;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} monthPickerId
	 * @param {string} eventName
	 * @param {OSFramework.Callbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		monthPickerId: string,
		eventName: string,
		callback: OSFramework.GlobalCallbacks.OSGeneric
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _monthPicker = this.GetMonthPickerItemById(monthPickerId);

			_monthPicker.registerCallback(eventName, callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to set providerConfigs by extensibility
	 *
	 * @export
	 * @param {string} monthPickerId
	 * @param {MonthPickerProviderConfigs} providerConfigs
	 * @return {*}  {string}
	 */
	export function SetProviderConfigs(monthPickerId: string, providerConfigs: MonthPickerProviderConfigs): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const monthPicker = GetMonthPickerItemById(monthPickerId);

			monthPicker.setProviderConfigs(providerConfigs);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailRegisterProviderConfig;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @export
	 * @param {string} monthPickerId
	 * @param {string} eventName
	 * @param {OSFramework.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
	 */
	export function SetProviderEvent(
		monthPickerId: string,
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
			const monthPicker = GetMonthPickerItemById(monthPickerId);
			monthPicker.setProviderEvent(eventName, callback, _eventUniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailRegisterProviderEvent;
			responseObj.uniqueId = undefined;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to remove providerEvents added by extensibility
	 *
	 * @export
	 * @param {string} monthPickerId
	 * @param {string} eventId
	 * @return {*}  {string}
	 */
	export function UnsetProviderEvent(monthPickerId: string, eventId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const monthPicker = GetMonthPickerItemById(monthPickerId);
			monthPicker.unsetProviderEvent(eventId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailRemoveProviderEvent;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will set a different language to a given MonthPickerId
	 *
	 * @export
	 * @param {string} monthPickerId
	 * @param {string} isoCode
	 * @return {*}  {string}
	 */
	export function SetLanguage(monthPickerId: string, isoCode: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _monthPicker = this.GetMonthPickerItemById(monthPickerId);

			_monthPicker.setLanguage(isoCode);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailRedraw;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will set the input as editable
	 *
	 * @export
	 * @param {string} monthPickerId
	 * @param {boolean} IsEditable
	 * @return {*}  {string}
	 */
	export function SetEditableInput(monthPickerId: string, IsEditable: boolean): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _monthPicker = this.GetMonthPickerItemById(monthPickerId);
			_monthPicker.setEditableInput(IsEditable);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.MonthPicker.FailSetEditableInput;
		}

		return JSON.stringify(responseObj);
	}
}
