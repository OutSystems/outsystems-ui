// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SubmenuAPI {
	const _submenusMap = new Map<string, OSFramework.OSUI.Patterns.Submenu.ISubmenu>(); //Submenu.uniqueId -> Submenu obj

	/**
	 * Function that will change the property of a given Submenu.
	 *
	 * @param submenuId ID of the Submenu where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(submenuId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailChangeProperty,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 *
	 * Function that will toggle the behaviour to close submenu when clicking the body
	 * @param submenuId The id of the Submenu element
	 * @param clickOutsideToClose Whether a click outside the submenu closes it
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ClickOutsideToClose(submenuId: string, clickOutsideToClose: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailClickOutsideToClose,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.clickOutsideToClose(clickOutsideToClose);
			},
		});

		return result;
	}

	/**
	 * Function that will close a given submenu.
	 *
	 * @param submenuId ID of the submenu that will be closed
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Close(submenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailClose,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.close();
			},
		});

		return result;
	}

	/**
	 * Function that will open a given submenu.
	 *
	 * @param submenuId ID of the submenu that will be closed
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Open(submenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailOpen,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.open();
			},
		});

		return result;
	}

	/**
	 * Create the new submenu instance and add it to the submenusMap
	 *
	 * @param submenuId ID of the Submenu where the instance will be created.
	 * @param configs configurations for the Submenu in JSON format.
	 * @returns the Submenu instance
	 */
	export function Create(submenuId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Submenu.ISubmenu {
		if (_submenusMap.has(submenuId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Submenu} registered under id: ${submenuId}`
			);
		}

		const _newSubmenu = new OSFramework.OSUI.Patterns.Submenu.Submenu(
			submenuId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_submenusMap.set(submenuId, _newSubmenu);

		return _newSubmenu;
	}

	/**
	 * Function that will destroy the instance of the given submenu
	 *
	 * @param submenuId The id of the Submenu element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(submenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailDispose,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.dispose();

				_submenusMap.delete(submenuId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Submenu instances at the page
	 *
	 * @returns the ids of every Submenu instance
	 */
	export function GetAllSubmenus(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_submenusMap);
	}

	/**
	 * Function that gets the instance of submenu, by a given ID.
	 *
	 * @param submenuId ID of the Submenu that will be looked for.
	 * @returns the Submenu instance
	 */
	export function GetSubmenuById(submenuId: string): OSFramework.OSUI.Patterns.Submenu.ISubmenu {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.Submenu,
			submenuId,
			_submenusMap
		) as OSFramework.OSUI.Patterns.Submenu.ISubmenu;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param submenuId ID of the Submenu that will be initialized.
	 * @returns the Submenu instance
	 */
	export function Initialize(submenuId: string): OSFramework.OSUI.Patterns.Submenu.ISubmenu {
		const submenu = GetSubmenuById(submenuId);

		submenu.build();

		return submenu;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param submenuId The id of the Submenu element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		submenuId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailRegisterCallback,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function that will set the hover trigger to a given submenu.
	 *
	 * @param submenuId The id of the Submenu element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SubmenuOpenOnHover(submenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailOpenOnHover,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.setOpenOnHover();
			},
		});

		return result;
	}

	/**
	 * Function that will run  on the pattern's OnRender.
	 *
	 * @param submenuId The id of the Submenu element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UpdateOnRender(submenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailUpdate,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.updateOnRender();
			},
		});

		return result;
	}
}
