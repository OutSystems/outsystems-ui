// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DropdownAPI {
	const _dropdownItemsMap = new Map<string, OSUIFramework.Patterns.Dropdown.IDropdown>(); //Dropdown.uniqueId -> Dropdown obj

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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownItem = GetDropdownById(dropdownId);

			_dropdownItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Dropdown.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will clear any selected values from the Dropdown with given Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Clear(dropdownId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownItem = GetDropdownById(dropdownId);

			_dropdownItem.clear();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Dropdown.FailClear;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new DropdownItem instance and add it to the dropdownItemsMap
	 *
	 * @export
	 * @param {string} dropdownId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Dropdown.IDropdown}
	 */
	export function Create(
		dropdownId: string,
		mode: string,
		provider: string,
		configs: string
	): OSUIFramework.Patterns.Dropdown.IDropdown {
		if (_dropdownItemsMap.has(dropdownId)) {
			throw new Error(`There is already an Dropdown registered under id: ${dropdownId}`);
		}

		const _dropdownItem = OSUIFramework.Patterns.Dropdown.Factory.NewDropdown(dropdownId, mode, provider, configs);

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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownItem = GetDropdownById(dropdownId);

			_dropdownItem.disable();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Dropdown.FailDisable;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will dispose the instance of the given DropDownItem Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Dispose(dropdownId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownItem = GetDropdownById(dropdownId);

			_dropdownItem.dispose();

			_dropdownItemsMap.delete(_dropdownItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Dropdown.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will set Dropdown with given ID as enabled
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function Enable(dropdownId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownItem = GetDropdownById(dropdownId);

			_dropdownItem.enable();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Dropdown.FailEnable;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the Dropdown instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllDropDownItemsInScreen(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_dropdownItemsMap);
	}

	/**
	 * Function that gets the instance of Dropdown, by a given ID.
	 *
	 * @export
	 * @param {string} dropdownId ID of the DropdownId that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.Dropdown.IDropdown}
	 */
	export function GetDropdownById(dropdownId: string): OSUIFramework.Patterns.Dropdown.IDropdown {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			OSUIFramework.GlobalEnum.PatternsNames.Dropdown,
			dropdownId,
			_dropdownItemsMap
		) as OSUIFramework.Patterns.Dropdown.IDropdown;
	}

	/**
	 * Fucntion that will return all the selected values from a given Dropdown Id
	 *
	 * @export
	 * @param {string} dropdownId
	 * @return {*}  {string}
	 */
	export function GetSelectedValues(dropdownId: string): string {
		const responseObj = {
			code: ErrorCodes.Success.code,
			isSuccess: true,
			message: ErrorCodes.Success.message,
			value: '',
		};

		try {
			const _dropdownItem = GetDropdownById(dropdownId);

			responseObj.value = _dropdownItem.getSelectedValues();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Dropdown.FailGetSelectedValues;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} dropdownId ID of the DropdownItem that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.Dropdown.IDropdown}
	 */
	export function Initialize(dropdownId: string): OSUIFramework.Patterns.Dropdown.IDropdown {
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
	 * @param {OSUIFramework.Callbacks.OSGeneric} callback
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		dropdownId: string,
		eventName: string,
		callback: OSUIFramework.Callbacks.OSGeneric
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownItem = this.GetDropdownById(dropdownId);

			_dropdownItem.registerCallback(eventName, callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Dropdown.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownItem = GetDropdownById(dropdownId);

			_dropdownItem.validation(isValid, validationMessage);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Dropdown.FailSetValidation;
		}

		return JSON.stringify(responseObj);
	}
}
