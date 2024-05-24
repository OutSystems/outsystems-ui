// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DropdownAPI {
	const _dropdownItemsMap = new Map<string, OSFramework.OSUI.Patterns.Dropdown.IDropdown>(); //Dropdown.uniqueId -> Dropdown obj

	/**
	 * Function that will change the property of a given Dropdown Id.
	 *
	 * @export
	 * @param {string} dropdownId ID of the Dropdown where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function ChangeProperty(dropdownId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailChangeProperty,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				_dropdownItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Function that will clear any selected values from the Dropdown with given Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {boolean} silentOnChangedEvent
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Clear(dropdownId: string, silentOnChangedEvent = true): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailClear,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId) as VirtualSelect;

				_dropdownItem.clear(silentOnChangedEvent);
			},
		});

		return result;
	}

	/**
	 * Function that will Close the Dropdown with the given Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Close(dropdownId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailClose,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				_dropdownItem.close();
			},
		});

		return result;
	}

	/**
	 * Create the new DropdownItem instance and add it to the dropdownItemsMap
	 *
	 * @export
	 * @param {string} dropdownId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Dropdown.IDropdown}
	 */
	export function Create(
		dropdownId: string,
		mode: string,
		provider: string,
		configs: string
	): OSFramework.OSUI.Patterns.Dropdown.IDropdown {
		if (_dropdownItemsMap.has(dropdownId)) {
			throw new Error(`There is already an Dropdown registered under id: ${dropdownId}`);
		}

		const _dropdownItem = OSFramework.OSUI.Patterns.Dropdown.Factory.NewDropdown(
			dropdownId,
			mode,
			provider,
			configs
		);

		_dropdownItemsMap.set(dropdownId, _dropdownItem);

		return _dropdownItem;
	}

	/**
	 * Function that will set Dropdown with given ID as Disabled
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Disable(dropdownId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailDisable,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				_dropdownItem.disable();
			},
		});

		return result;
	}

	/**
	 * Function that toggle the dropbox as popup on small screen like mobile
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {boolean} isEnabled
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function TogglePopup(dropdownId: string, isEnabled: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailTogglePopup,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId) as VirtualSelect;
				_dropdownItem.togglePopup(isEnabled);
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given DropDownItem Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Dispose(dropdownId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailDispose,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				_dropdownItem.dispose();

				_dropdownItemsMap.delete(_dropdownItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will set Dropdown with given ID as enabled
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Enable(dropdownId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailEnable,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				_dropdownItem.enable();
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Dropdown instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllDropdowns(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_dropdownItemsMap);
	}

	/**
	 * Function that gets the instance of Dropdown, by a given ID.
	 *
	 * @export
	 * @param {string} dropdownId ID of the DropdownId that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.Dropdown.IDropdown}
	 */
	export function GetDropdownById(dropdownId: string): OSFramework.OSUI.Patterns.Dropdown.IDropdown {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.Dropdown,
			dropdownId,
			_dropdownItemsMap
		) as OSFramework.OSUI.Patterns.Dropdown.IDropdown;
	}

	/**
	 * Fucntion that will return all the selected values from a given Dropdown Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*}  {string}
	 */
	export function GetSelectedValues(dropdownId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailGetSelectedValues,
			hasValue: true,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				return _dropdownItem.getSelectedValues();
			},
		});

		return result;
	}

	/**
	 * Function that will Open the Dropdown with the given Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Open(dropdownId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailOpen,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				_dropdownItem.open();
			},
		});

		return result;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} dropdownId ID of the DropdownItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.Dropdown.IDropdown}
	 */
	export function Initialize(dropdownId: string): OSFramework.OSUI.Patterns.Dropdown.IDropdown {
		const _dropdownItem = GetDropdownById(dropdownId);

		_dropdownItem.build();

		return _dropdownItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		dropdownId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailRegisterCallback,
			callback: () => {
				const _dropdownItem = this.GetDropdownById(dropdownId);

				_dropdownItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function to set providerConfigs by extensibility
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {DropdownProviderConfigs} providerConfigs
	 * @return {*}  {string}
	 */
	export function SetProviderConfigs(dropdownId: string, providerConfigs: DatePickerProviderConfigs): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailRegisterProviderConfig,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				// Check if the given Dropdown has a provider (DropdownServerSide do not have it!)
				if (_dropdownItem['provider'] !== undefined) {
					_dropdownItem.setProviderConfigs(providerConfigs);
				} else {
					throw new Error(`Dropdown with Id:${dropdownId} does not have a provider.`);
				}
			},
		});

		return result;
	}

	/**
	 * Function to set providerEvents by extensibility
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
	 */
	export function SetProviderEvent(
		dropdownId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.Generic
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailRegisterProviderEvent,
			hasValue: true,
			callback: () => {
				const _eventUniqueId = OSFramework.OSUI.Helper.Dom.GenerateUniqueId();
				const dropdown = GetDropdownById(dropdownId);
				dropdown.setProviderEvent(eventName, callback, _eventUniqueId);

				return _eventUniqueId;
			},
		});

		return result;
	}

	/**
	 * Function to remove providerEvents added by extensibility
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {string} eventId
	 * @return {*}  {string}
	 */
	export function UnsetProviderEvent(dropdownId: string, eventId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailRemoveProviderEvent,
			callback: () => {
				const dropdown = GetDropdownById(dropdownId);
				dropdown.unsetProviderEvent(eventId);
			},
		});

		return result;
	}

	/**
	 * Function used to set the validation status to the given Dropdown Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {boolean} isValid
	 * @param {string} validationMessage
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function SetValidation(dropdownId: string, isValid: boolean, validationMessage: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailSetValidation,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				_dropdownItem.validation(isValid, validationMessage);
			},
		});

		return result;
	}

	/**
	 * Function used to set the value(s) of a given Dropdown Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {string} selectedValues
	 * @param {boolean} silentOnChangedEvent
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function SetValues(dropdownId: string, selectedValues: string, silentOnChangedEvent = true): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailSetValues,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId) as VirtualSelect;

				_dropdownItem.setValue(JSON.parse(selectedValues), silentOnChangedEvent);
			},
		});

		return result;
	}
}
