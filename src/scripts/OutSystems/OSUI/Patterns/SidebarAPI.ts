// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SidebarAPI {
	const _sidebarMap = new Map<string, OSUIFramework.Patterns.Sidebar.ISidebar>();
	/**
	 * Function that will change the property of a given Sidebar.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {string} propertyName
	 * @param {*} propertyValue
	 */
	export function ChangeProperty(sidebarId: string, propertyName: string, propertyValue: any): void {
		const sidebar = GetSidebarById(sidebarId);
		sidebar.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new Sidebar instance and add it to the sidebarsMap
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {string} configs
	 * @return {*}  {OSUIFramework.Patterns.Sidebar.ISidebar}
	 */
	export function Create(sidebarId: string, configs: string): OSUIFramework.Patterns.Sidebar.ISidebar {
		if (_sidebarMap.has(sidebarId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.Sidebar} registered under id: ${sidebarId}`
			);
		}

		const _newSidebar = new OSUIFramework.Patterns.Sidebar.Sidebar(sidebarId, JSON.parse(configs));
		_sidebarMap.set(sidebarId, _newSidebar);
		return _newSidebar;
	}

	/**
	 * Function that will destroy the instance of the given Sidebar
	 *
	 * @export
	 * @param {string} sidebarId
	 */
	export function Destroy(sidebarId: string): void {
		const sidebar = GetSidebarById(sidebarId);

		sidebar.dispose();

		_sidebarMap.delete(sidebarId);
	}

	/**
	 * Fucntion that will return the Map with all the Sidebar instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllSidebars(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_sidebarMap);
	}

	/**
	 * Function that gets the instance of Sidebar, by a given ID.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @return {*}  {OSUIFramework.Patterns.Sidebar.ISidebar}
	 */
	export function GetSidebarById(sidebarId: string): OSUIFramework.Patterns.Sidebar.ISidebar {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'Sidebar',
			sidebarId,
			_sidebarMap
		) as OSUIFramework.Patterns.Sidebar.ISidebar;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @return {*}  {OSUIFramework.Patterns.Sidebar.ISidebar}
	 */
	export function Initialize(sidebarId: string): OSUIFramework.Patterns.Sidebar.ISidebar {
		const sidebar = GetSidebarById(sidebarId);

		sidebar.build();

		return sidebar;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {OSUIFramework.Callbacks.OSSidebarToggleEvent} callback
	 */
	export function RegisterCallback(sidebarId: string, callback: OSUIFramework.Callbacks.OSSidebarToggleEvent): void {
		const sidebar = GetSidebarById(sidebarId);

		sidebar.registerCallback(callback);
	}
}
