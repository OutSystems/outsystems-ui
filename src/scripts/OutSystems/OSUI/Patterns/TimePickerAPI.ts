// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TimePickerAPI {
	const _timePickerItemsMap = new Map<string, OSFramework.OSUI.Patterns.TimePicker.ITimePicker>(); //TimePicker.uniqueId -> TimePicker obj

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
	 * @param {string} timePickerId ID of the TimePickerItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.TimePicker.ITimePicker}
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
	 * @param {string} timePickerId ID of the TimePickerItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.TimePicker.ITimePicker}
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
	 * @export
	 * @param {string} timePickerId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @param {string} provider Set which provider should be used to create the calendar instance.
	 * @return {*}  {OSFramework.OSUI.Patterns.TimePicker.ITimePicker}
	 */
	export function Create(
		timePickerId: string,
		configs: string,
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
	 * @export
	 * @param {string} timePickerId
	 * @return {*}  {string}
	 */
	export function ToggleNativeBehavior(timePickerId: string, IsNative: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailToggleNativeBehavior,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);
				_timePicker.toggleNativeBehavior(IsNative);
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given TimePickerItem Id
	 *
	 * @export
	 * @param {string} timePickerId
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
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllTimePickerItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_timePickerItemsMap);
	}

	/**
	 * Function that gets the instance of TimePicker, by a given ID.
	 *
	 * @export
	 * @param {string} timePickerId ID of the TimePicker that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.TimePicker.ITimePicker;}
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
	 * @export
	 * @param {string} timePickerId ID of the TimePickerItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.TimePicker.ITimePicker}
	 */
	export function Initialize(timePickerId: string): OSFramework.OSUI.Patterns.TimePicker.ITimePicker {
		const _timePickerItem = GetTimePickerItemById(timePickerId);

		_timePickerItem.build();

		return _timePickerItem;
	}

	/**
	 * Function that will be triggered everytime there is a render at TimePicker
	 *
	 * @export
	 * @param {string} timePickerId
	 * @return {*}  {string}
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
	 * @param {string} timePickerId ID of the TimePickerItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.TimePicker.ITimePicker}
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
	 * @export
	 * @param {string} timePickerId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		timePickerId: string,
		eventName: string,
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
	 * @export
	 * @param {string} timePickerId
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
	 * @param timePickerId
	 * @param isoCode ISO Code language that will be assigned
	 * @returns
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
	 * Function that will set a different language to all TimePickers
	 *
	 * @export
	 * @param {string} isoCode
	 * @return {*}  {string}
	 */
	export function SetLanguageAllPickers(isoCode: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailSetLanguage,
			callback: () => {
				// Set the language to all TimePickers
				_timePickerItemsMap.forEach((timePicker) => {
					timePicker.setLanguage(isoCode);
				});
			},
		});
		return result;
	}

	/**
	 * Function that will update the InitialTime fot a given TimepickerId
	 * @param {string} timePickerId
	 * @param {string} time The value for the InitialTime
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
	 * @param {string} TimePickerId
	 * @param {string} promptMessage The value for the prompt message
	 * @return {*} Response Object as a JSON String
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
	 * @export
	 * @param {string} timePickerId
	 * @param {TimePickerProviderConfigs} providerConfigs
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} timePickerId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} timePickerId
	 * @param {string} eventId
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} timePickerId
	 * @param {boolean} IsEditable
	 * @return {*}  {string}
	 */
	export function SetEditableInput(timePickerId: string, IsEditable: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TimePicker.FailSetEditableInput,
			callback: () => {
				const _timePicker = this.GetTimePickerItemById(timePickerId);
				_timePicker.setEditableInput(IsEditable);
			},
		});

		return result;
	}
}
