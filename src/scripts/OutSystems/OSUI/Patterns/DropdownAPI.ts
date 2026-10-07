// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DropdownAPI {
	const _dropdownItemsMap = new Map<string, OSFramework.OSUI.Patterns.Dropdown.IDropdown>(); //Dropdown.uniqueId -> Dropdown obj

	/**
	 * Function that will change the property of a given Dropdown Id.
	 *
	 * @param dropdownId ID of the Dropdown where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @param dropdownId The id of the Dropdown element
	 * @param silentOnChangedEvent Whether the OnChanged event stays silent for this change
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @param dropdownId The id of the Dropdown element
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @param dropdownId ID of the Pattern that a new instance will be created.
	 * @param mode Dropdown mode (search, tags or server-side).
	 * @param provider Provider that renders the dropdown (VirtualSelect or OSUIComponents).
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the Dropdown instance
	 */
	export function Create(
		dropdownId: string,
		mode: string,
		provider: string,
		configs: string | Configs
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
	 * @param dropdownId The id of the Dropdown element
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @param dropdownId The id of the Dropdown element
	 * @param isEnabled Whether the pattern is enabled
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @param dropdownId The id of the Dropdown element
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @param dropdownId The id of the Dropdown element
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @returns Array<string>
	 */
	export function GetAllDropdowns(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_dropdownItemsMap);
	}

	/**
	 * Function that gets the instance of Dropdown, by a given ID.
	 *
	 * @param dropdownId ID of the DropdownId that will be looked for.
	 * @returns the Dropdown instance
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
	 * @param dropdownId The id of the Dropdown element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param dropdownId The id of the Dropdown element
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @param dropdownId ID of the DropdownItem that will be initialized.
	 * @returns the Dropdown instance
	 */
	export function Initialize(dropdownId: string): OSFramework.OSUI.Patterns.Dropdown.IDropdown {
		const _dropdownItem = GetDropdownById(dropdownId);

		_dropdownItem.build();

		return _dropdownItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param dropdownId The id of the Dropdown element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		dropdownId: string,
		eventName: EventName,
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
	 * @param dropdownId The id of the Dropdown element
	 * @param providerConfigs The provider configuration options as a JSON string or object
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetProviderConfigs(dropdownId: string, providerConfigs: DatePickerProviderConfigs): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Dropdown.FailRegisterProviderConfig,
			callback: () => {
				const _dropdownItem = GetDropdownById(dropdownId);

				// Check if the given Dropdown has a provider (DropdownServerSide do not have it!)
				if ((_dropdownItem as unknown as { provider?: unknown }).provider !== undefined) {
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
	 * @param dropdownId The id of the Dropdown element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param dropdownId The id of the Dropdown element
	 * @param eventId The id of the provider event
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param dropdownId The id of the Dropdown element
	 * @param isValid Whether the value is valid
	 * @param validationMessage The message shown when the value is not valid
	 * @returns Return Message Success or message of error info if it's the case.
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
	 * @param dropdownId The id of the Dropdown element
	 * @param selectedValues The values to select, as a JSON string
	 * @param silentOnChangedEvent Whether the OnChanged event stays silent for this change
	 * @returns Return Message Success or message of error info if it's the case.
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
