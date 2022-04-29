// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SubmenuAPI {
	const _submenusMap = new Map<string, OSUIFramework.Patterns.Submenu.ISubmenu>(); //Submenu.uniqueId -> Submenu obj

	/**
	 * Function that will change the property of a given Submenu.
	 *
	 * @export
	 * @param {string} submenuId ID of the Submenu where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(submenuId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const submenu = GetSubmenuById(submenuId);

			submenu.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Submenu.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will close a given submenu.
	 *
	 * @export
	 * @param {string} submenuId ID of the submenu that will be closed
	 */
	export function Close(submenuId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const submenu = GetSubmenuById(submenuId);

			submenu.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Submenu.FailClose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will open a given submenu.
	 *
	 * @export
	 * @param {string} submenuId ID of the submenu that will be closed
	 */
	export function Open(submenuId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const submenu = GetSubmenuById(submenuId);

			submenu.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Submenu.FailOpen;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will set the hover trigger to a given submenu.
	 *
	 * @export
	 * @param {string} submenuId
	 */
	export function SubmenuOpenOnHover(submenuId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const submenu = GetSubmenuById(submenuId);

			submenu.changeProperty(OSUIFramework.Patterns.Submenu.Enum.Properties.OpenOnHover, true);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Submenu.FailOpenOnHover;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new submenu instance and add it to the submenusMap
	 *
	 * @export
	 * @param {string} submenuId ID of the Submenu where the instance will be created.
	 * @param {string} configs configurations for the Submenu in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.ISubmenu}
	 */
	export function Create(submenuId: string, configs: string): OSUIFramework.Patterns.Submenu.ISubmenu {
		if (_submenusMap.has(submenuId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.Submenu} registered under id: ${submenuId}`
			);
		}

		const _newSubmenu = new OSUIFramework.Patterns.Submenu.Submenu(submenuId, JSON.parse(configs));

		_submenusMap.set(submenuId, _newSubmenu);

		return _newSubmenu;
	}

	/**
	 * Function that will destroy the instance of the given submenu
	 *
	 * @export
	 * @param {string} submenuId
	 */
	export function Dispose(submenuId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const submenu = GetSubmenuById(submenuId);

			submenu.dispose();

			_submenusMap.delete(submenuId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Submenu.FailOpenOnHover;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will return the Map with all the Submenu instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.Isubmenu>}
	 */
	export function GetAllSubmenus(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_submenusMap);
	}

	/**
	 * Function that gets the instance of submenu, by a given ID.
	 *
	 * @export
	 * @param {string} submenuId ID of the Submenu that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.ISubmenu}
	 */
	export function GetSubmenuById(submenuId: string): OSUIFramework.Patterns.Submenu.ISubmenu {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			OSUIFramework.GlobalEnum.PatternsNames.Submenu,
			submenuId,
			_submenusMap
		) as OSUIFramework.Patterns.Submenu.ISubmenu;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} submenuId ID of the Submenu that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.ISubmenu}
	 */
	export function Initialize(submenuId: string): OSUIFramework.Patterns.Submenu.ISubmenu {
		const submenu = GetSubmenuById(submenuId);

		submenu.build();

		return submenu;
	}

	/**
	 * Function that will run  on the pattern's OnRender.
	 *
	 * @export
	 * @param {string} submenuId
	 * @return {*}  {OSUIFramework.Patterns.Submenu.ISubmenu}
	 */
	export function UpdateOnRender(submenuId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const submenu = GetSubmenuById(submenuId);

			submenu.updateOnRender();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Submenu.FailUpdate;
		}

		return JSON.stringify(responseObj);
	}
}
