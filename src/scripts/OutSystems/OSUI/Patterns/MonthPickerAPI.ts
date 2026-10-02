// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.MonthPickerAPI {
	const _monthPickerItemsMap = new Map<string, OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker>(); //MonthPicker.uniqueId -> MonthPicker obj

	/**
	 * Function that will change the property of a given MonthPicker Id.
	 *
	 * @param monthPickerId ID of the MonthPicker where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(monthPickerId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailChangeProperty,
			callback: () => {
				const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

				_monthPickerItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Function used to Resets the selected month (if any) and clears the input from a Given Id monthpicker
	 *
	 * @param monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Clear(monthPickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailClear,
			callback: () => {
				const _MonthPickerItem = GetMonthPickerItemById(monthPickerId);

				_MonthPickerItem.clear();
			},
		});

		return result;
	}

	/**
	 * Function used to Close the monthpicker with the Given Id
	 *
	 * @param monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Close(monthPickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailClose,
			callback: () => {
				const _MonthPickerItem = GetMonthPickerItemById(monthPickerId);

				_MonthPickerItem.close();
			},
		});

		return result;
	}

	/**
	 * Create the new MonthPickerItem instance and add it to the monthPickerItemsMap
	 *
	 * @param monthPickerId ID of the Pattern that a new instance will be created.
	 * @param configs Set which provider should be used to create the monthPicker instance.
	 * @param provider Configurations for the Pattern in JSON format.
	 * @returns the MonthPicker instance
	 */
	export function Create(
		monthPickerId: string,
		configs: string | Configs,
		provider: string
	): OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker {
		if (_monthPickerItemsMap.has(monthPickerId)) {
			throw new Error('There is already an MonthPicker registered under id: ' + monthPickerId);
		}

		const _monthPickerItem = OSFramework.OSUI.Patterns.MonthPicker.Factory.NewMonthPicker(
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
	 * @param monthPickerId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(monthPickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailDispose,
			callback: () => {
				const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

				_monthPickerItem.dispose();

				_monthPickerItemsMap.delete(_monthPickerItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the MonthPicker instances at the page
	 *
	 * @returns Array<string>
	 */
	export function GetAllMonthPickerItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_monthPickerItemsMap);
	}

	/**
	 * Function that gets the instance of MonthPicker, by a given ID.
	 *
	 * @param monthPickerId ID of the MonthPicker that will be looked for.
	 * @returns the MonthPicker instance
	 */
	export function GetMonthPickerItemById(monthPickerId: string): OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'MonthPicker',
			monthPickerId,
			_monthPickerItemsMap
		) as OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @returns the MonthPicker instance
	 */
	export function Initialize(monthPickerId: string): OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker {
		const _monthPickerItem = GetMonthPickerItemById(monthPickerId);

		_monthPickerItem.build();

		return _monthPickerItem;
	}

	/**
	 * Function used to Open the monthpicker with the Given Id
	 *
	 * @param monthPickerId ID of the MonthPickerItem that will be initialized.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Open(monthPickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailOpen,
			callback: () => {
				const _MonthPickerItem = GetMonthPickerItemById(monthPickerId);

				_MonthPickerItem.open();
			},
		});

		return result;
	}

	/**
	 * Function that will be triggered everytime there is a render at MonthPicker
	 *
	 * @param monthPickerId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function OnRender(monthPickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailOnRender,
			callback: () => {
				const _monthPicker = this.GetMonthPickerItemById(monthPickerId);

				_monthPicker.onRender();
			},
		});

		return result;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param monthPickerId
	 * @param eventName
	 * @param callback
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		monthPickerId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailRegisterCallback,
			callback: () => {
				const _monthPicker = this.GetMonthPickerItemById(monthPickerId);

				_monthPicker.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function to set providerConfigs by extensibility
	 *
	 * @param monthPickerId
	 * @param providerConfigs
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetProviderConfigs(monthPickerId: string, providerConfigs: MonthPickerProviderConfigs): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailRegisterProviderConfig,
			callback: () => {
				const monthPicker = GetMonthPickerItemById(monthPickerId);

				monthPicker.setProviderConfigs(providerConfigs);
			},
		});

		return result;
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @param monthPickerId
	 * @param eventName
	 * @param callback
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetProviderEvent(
		monthPickerId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.Generic
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailRegisterProviderEvent,
			hasValue: true,
			callback: () => {
				const _eventUniqueId = OSFramework.OSUI.Helper.Dom.GenerateUniqueId();

				const monthPicker = GetMonthPickerItemById(monthPickerId);
				monthPicker.setProviderEvent(eventName, callback, _eventUniqueId);

				return _eventUniqueId;
			},
		});

		return result;
	}

	/**
	 * Function that will set a different language to a given MonthPickerId
	 *
	 * @param monthPickerId
	 * @param isoCode
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetLanguage(monthPickerId: string, isoCode: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailSetLanguage,
			callback: () => {
				const _monthPicker = this.GetMonthPickerItemById(monthPickerId);

				_monthPicker.setLanguage(isoCode);
			},
		});

		return result;
	}

	/**
	 * Function that will set the input as editable
	 *
	 * @param monthPickerId
	 * @param isEditable
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetEditableInput(monthPickerId: string, isEditable: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailSetEditableInput,
			callback: () => {
				const _monthPicker = this.GetMonthPickerItemById(monthPickerId);
				_monthPicker.setEditableInput(isEditable);
			},
		});

		return result;
	}

	/**
	 * Function to remove providerEvents added by extensibility
	 *
	 * @param monthPickerId
	 * @param eventId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UnsetProviderEvent(monthPickerId: string, eventId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailRemoveProviderEvent,
			callback: () => {
				const monthPicker = GetMonthPickerItemById(monthPickerId);
				monthPicker.unsetProviderEvent(eventId);
			},
		});

		return result;
	}

	/**
	 * Function that will update the InitialMonth fot a given MonthpickerId
	 * @param monthPickerId
	 * @param monthYear The value for the InitialMonth
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UpdateInitialMonth(monthPickerId: string, monthYear: MonthYear): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailUpdateInitialMonth,
			callback: () => {
				const _monthPicker = this.GetMonthPickerItemById(monthPickerId);
				_monthPicker.updateInitialMonth(monthYear);
			},
		});

		return result;
	}

	/**
	 * Function that will update the prompt message for a given MonthPickerId
	 *
	 * @param monthPickerId
	 * @param promptMessage The value for the prompt message
	 * @returns Response Object as a JSON String
	 */
	export function UpdatePrompt(monthPickerId: string, promptMessage: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.MonthPicker.FailUpdatePrompt,
			callback: () => {
				const _monthPicker = this.GetMonthPickerItemById(monthPickerId);

				_monthPicker.updatePrompt(promptMessage);
			},
		});

		return result;
	}
}
