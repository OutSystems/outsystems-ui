// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SubmenuAPI {
	const _submenusMap = new Map<string, OSFramework.Patterns.Submenu.ISubmenu>(); //Submenu.uniqueId -> Submenu obj

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
	 * Function that will close a given submenu.
	 *
	 * @export
	 * @param {string} submenuId ID of the submenu that will be closed
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
	 * @export
	 * @param {string} submenuId ID of the submenu that will be closed
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
	 * Function that will set the hover trigger to a given submenu.
	 *
	 * @export
	 * @param {string} submenuId
	 */
	export function SubmenuOpenOnHover(submenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Submenu.FailOpenOnHover,
			callback: () => {
				const submenu = GetSubmenuById(submenuId);

				submenu.changeProperty(OSFramework.Patterns.Submenu.Enum.Properties.OpenOnHover, true);
			},
		});

		return result;
	}

	/**
	 * Create the new submenu instance and add it to the submenusMap
	 *
	 * @export
	 * @param {string} submenuId ID of the Submenu where the instance will be created.
	 * @param {string} configs configurations for the Submenu in JSON format.
	 * @return {*}  {OSFramework.Patterns.ISubmenu}
	 */
	export function Create(submenuId: string, configs: string): OSFramework.Patterns.Submenu.ISubmenu {
		if (_submenusMap.has(submenuId)) {
			throw new Error(
				`There is already a ${OSFramework.GlobalEnum.PatternName.Submenu} registered under id: ${submenuId}`
			);
		}

		const _newSubmenu = new OSFramework.Patterns.Submenu.Submenu(submenuId, JSON.parse(configs));

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
	 * @export
	 * @return {*}  {Map<string, OSFramework.Patterns.Isubmenu>}
	 */
	export function GetAllSubmenus(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_submenusMap);
	}

	/**
	 * Function that gets the instance of submenu, by a given ID.
	 *
	 * @export
	 * @param {string} submenuId ID of the Submenu that will be looked for.
	 * @return {*}  {OSFramework.Patterns.ISubmenu}
	 */
	export function GetSubmenuById(submenuId: string): OSFramework.Patterns.Submenu.ISubmenu {
		return OSFramework.Helper.MapOperation.FindInMap(
			OSFramework.GlobalEnum.PatternName.Submenu,
			submenuId,
			_submenusMap
		) as OSFramework.Patterns.Submenu.ISubmenu;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} submenuId ID of the Submenu that will be initialized.
	 * @return {*}  {OSFramework.Patterns.ISubmenu}
	 */
	export function Initialize(submenuId: string): OSFramework.Patterns.Submenu.ISubmenu {
		const submenu = GetSubmenuById(submenuId);

		submenu.build();

		return submenu;
	}

	/**
	 * Function that will run  on the pattern's OnRender.
	 *
	 * @export
	 * @param {string} submenuId
	 * @return {*}  {OSFramework.Patterns.Submenu.ISubmenu}
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
