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
	export function ChangeProperty(submenuId: string, propertyName: string, propertyValue: any): void {
		const submenu = GetSubmenuById(submenuId);

		submenu.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Function that will close a given submenu.
	 *
	 * @export
	 * @param {string} submenuId ID of the submenu that will be closed
	 */
	export function Close(submenuId: string): void {
		const submenu = GetSubmenuById(submenuId);

		submenu.close();
	}

	/**
	 * Function that will open a given submenu.
	 *
	 * @export
	 * @param {string} submenuId ID of the submenu that will be closed
	 */
	export function Open(submenuId: string): void {
		const submenu = GetSubmenuById(submenuId);

		submenu.open();
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
			throw new Error(`There is already a submenu registered under id: ${submenuId}`);
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
	export function Destroy(submenuId: string): void {
		const submenu = GetSubmenuById(submenuId);

		submenu.dispose();

		_submenusMap.delete(submenuId);
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
			'Submenu',
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
}
