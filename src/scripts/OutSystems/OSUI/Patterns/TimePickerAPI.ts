// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TimePickerAPI {
	const _timePickerItemsMap = new Map<string, OSFramework.OSUI.Patterns.TimePicker.ITimePicker>(); //TimePicker.uniqueId -> TimePicker obj

	/**
	 * Function that will change the property of a given TimePicker Id.
	 *
	 * @param timePickerId ID of the TimePicker where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(timePickerId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailChangeProperty,
			callback: () => {
				const _timePickerItem = GetTimePickerItemById(timePickerId);

				_timePickerItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Function used to Resets the selected time (if any) and clears the input from a Given Id timepicker
	 *
	 * @param timePickerId ID of the TimePickerItem that will be initialized.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Clear(timePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailClear,
			callback: () => {
				const _timePickerItem = GetTimePickerItemById(timePickerId);

				_timePickerItem.clear();
			},
		});

		return result;
	}

	/**
	 * Function used to Close the Timepicker with the Given Id
	 *
	 * @param timePickerId ID of the TimePickerItem that will be initialized.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Close(timePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailClose,
			callback: () => {
				const _timePickerItem = GetTimePickerItemById(timePickerId);

				_timePickerItem.close();
			},
		});

		return result;
	}

	/**
	 * Create the new TimePickerItem instance and add it to the timePickerItemsMap
	 *
	 * @param timePickerId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @param provider Set which provider should be used to create the calendar instance.
	 * @returns the TimePicker instance
	 */
	export function Create(
		timePickerId: string,
		configs: string | Configs,
		provider: string
	): OSFramework.OSUI.Patterns.TimePicker.ITimePicker {
		if (_timePickerItemsMap.has(timePickerId)) {
			throw new Error(`There is already an TimePicker registered under id: ${timePickerId}`);
		}

		const _timePickerItem = OSFramework.OSUI.Patterns.TimePicker.Factory.NewTimePicker(
			timePickerId,
			configs,
			provider
		);

		_timePickerItemsMap.set(timePickerId, _timePickerItem);

		return _timePickerItem;
	}

	/**
	 * Function that will disable the native behavior of TimePicker
	 *
	 * @param timePickerId ID of the TimePicker pattern.
	 * @param isNative True to use the native (mobile) picker, false to keep the provider dropdown.
	 * @returns Response object as a JSON string
	 */
	export function ToggleNativeBehavior(timePickerId: string, isNative: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailToggleNativeBehavior,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);
				_timePicker.toggleNativeBehavior(isNative);
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given TimePickerItem Id
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(timePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailDispose,
			callback: () => {
				const _timePickerItem = GetTimePickerItemById(timePickerId);

				_timePickerItem.dispose();

				_timePickerItemsMap.delete(_timePickerItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the TimePicker instances at the page
	 *
	 * @returns Array<string>
	 */
	export function GetAllTimePickerItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_timePickerItemsMap);
	}

	/**
	 * Function that gets the instance of TimePicker, by a given ID.
	 *
	 * @param timePickerId ID of the TimePicker that will be looked for.
	 * @returns the TimePicker instance
	 */
	export function GetTimePickerItemById(timePickerId: string): OSFramework.OSUI.Patterns.TimePicker.ITimePicker {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.Timepicker,
			timePickerId,
			_timePickerItemsMap
		) as OSFramework.OSUI.Patterns.TimePicker.ITimePicker;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param timePickerId ID of the TimePickerItem that will be initialized.
	 * @returns the TimePicker instance
	 */
	export function Initialize(timePickerId: string): OSFramework.OSUI.Patterns.TimePicker.ITimePicker {
		const _timePickerItem = GetTimePickerItemById(timePickerId);

		_timePickerItem.build();

		return _timePickerItem;
	}

	/**
	 * Function that will be triggered everytime there is a render at TimePicker
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function OnRender(timePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailOnRender,
			callback: () => {
				const _timePickerItem = this.GetTimePickerItemById(timePickerId);

				_timePickerItem.onRender();
			},
		});

		return result;
	}

	/**
	 * Function used to Open the Timepicker with the Given Id
	 *
	 * @param timePickerId ID of the TimePickerItem that will be initialized.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Open(timePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailOpen,
			callback: () => {
				const _timePickerItem = GetTimePickerItemById(timePickerId);

				_timePickerItem.open();
			},
		});

		return result;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		timePickerId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailRegisterCallback,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);

				_timePicker.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function that will/should be triggered after some parameters changed
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Redraw(timePickerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailRedraw,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);

				_timePicker.redraw();
			},
		});

		return result;
	}

	/**
	 * Function that will set a different language to a given TimePickerId
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @param isoCode ISO Code language that will be assigned
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetLanguage(timePickerId: string, isoCode: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailSetLanguage,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);

				_timePicker.setLanguage(isoCode);
			},
		});

		return result;
	}

	/**
	 * Function that will update the InitialTime fot a given TimepickerId
	 * @param timePickerId The id of the TimePicker element
	 * @param time The value for the InitialTime
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UpdateInitialTime(timePickerId: string, time: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailUpdateInitialTime,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);
				_timePicker.updateInitialTime(time);
			},
		});

		return result;
	}

	/**
	 * Function that will update the prompt message for a given TimePickerId
	 *
	 * @param timePickerId ID of the TimePicker pattern.
	 * @param promptMessage The value for the prompt message
	 * @returns Response Object as a JSON String
	 */
	export function UpdatePrompt(timePickerId: string, promptMessage: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailUpdatePrompt,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);

				_timePicker.updatePrompt(promptMessage);
			},
		});

		return result;
	}

	/**
	 * Function to set providerConfigs by extensibility
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @param providerConfigs The provider configuration options as a JSON string or object
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetProviderConfigs(timePickerId: string, providerConfigs: TimePickerProviderConfigs): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailRegisterProviderConfig,
			callback: () => {
				const timePicker = GetTimePickerItemById(timePickerId);

				timePicker.setProviderConfigs(providerConfigs);
			},
		});

		return result;
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetProviderEvent(
		timePickerId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.Generic
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailRegisterProviderEvent,
			hasValue: true,
			callback: () => {
				const _eventUniqueId = OSFramework.OSUI.Helper.Dom.GenerateUniqueId();
				const timePicker = GetTimePickerItemById(timePickerId);
				timePicker.setProviderEvent(eventName, callback, _eventUniqueId);

				return _eventUniqueId;
			},
		});

		return result;
	}

	/**
	 * Function to remove providerEvents added by extensibility
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @param eventId The id of the provider event
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UnsetProviderEvent(timePickerId: string, eventId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailRemoveProviderEvent,
			callback: () => {
				const timePicker = GetTimePickerItemById(timePickerId);
				timePicker.unsetProviderEvent(eventId);
			},
		});

		return result;
	}

	/**
	 * Function that will set the input as editable
	 *
	 * @param timePickerId The id of the TimePicker element
	 * @param isEditable Whether the input accepts typed values
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetEditableInput(timePickerId: string, isEditable: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailSetEditableInput,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);
				_timePicker.setEditableInput(isEditable);
			},
		});

		return result;
	}
}
