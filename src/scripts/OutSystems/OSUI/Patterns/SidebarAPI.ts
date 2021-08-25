// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SidebarAPI {
	const _sidebarMap = new Map<string, OSUIFramework.Patterns.Sidebar.ISidebar>();

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function ChangeProperty(sidebarId: string, propertyName: string, propertyValue: any): void {
		const sidebar = GetSidebarById(sidebarId);
		sidebar.changeProperty(propertyName, propertyValue);
	}
	/**
	 *
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {string} configs
	 * @return {*}  {OSUIFramework.Patterns.Sidebar.ISidebar}
	 */
	export function Create(sidebarId: string, configs: string): OSUIFramework.Patterns.Sidebar.ISidebar {
		if (_sidebarMap.has(sidebarId)) {
			throw new Error(`There is already a sidebar registered under id: ${sidebarId}`);
		}

		const _newSidebar = new OSUIFramework.Patterns.Sidebar.Sidebar(sidebarId, JSON.parse(configs));
		_sidebarMap.set(sidebarId, _newSidebar);
		return _newSidebar;
	}
	/**
	 *
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
	 *
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllSidebars(): Array<string> {
		return Array.from(_sidebarMap.keys());
	}
	/**
	 *
	 *
	 * @export
	 * @param {string} sidebarId
	 * @return {*}  {OSUIFramework.Patterns.Sidebar.ISidebar}
	 */
	export function GetSidebarById(sidebarId: string): OSUIFramework.Patterns.Sidebar.ISidebar {
		let sidebar: OSUIFramework.Patterns.Sidebar.ISidebar;

		//sidebarId is the UniqueId
		if (_sidebarMap.has(sidebarId)) {
			sidebar = _sidebarMap.get(sidebarId);
		} else {
			//Search for sidebarId
			for (const p of _sidebarMap.values()) {
				if (p.equalsToID(sidebarId)) {
					sidebar = p;
					break;
				}
			}
		}

		if (sidebar === undefined) {
			throw new Error(`Sidebar id:${sidebarId} not found`);
		}

		return sidebar;
	}
	/**
	 *
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
	 *
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
