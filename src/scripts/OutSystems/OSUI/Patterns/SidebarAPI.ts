namespace OutSystems.OSUI.Patterns.SidebarAPI {
	const _sidebarMap = new Map<string, OSUIFramework.Patterns.Sidebar.ISidebar>();

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function ChangeProperty(sidebarId: string, propertyName: string, propertyValue: any): void {
		const sidebar = GetSidebarById(sidebarId);
		sidebar.changeProperty(propertyName, propertyValue);
	}

	export function Create(sidebarId: string, configs: string): OSUIFramework.Patterns.Sidebar.ISidebar {
		if (_sidebarMap.has(sidebarId)) {
			throw new Error(`There is already a sidebar registered under id: ${sidebarId}`);
		}

		const _newSidebar = new OSUIFramework.Patterns.Sidebar.Sidebar(sidebarId, JSON.parse(configs));
		_sidebarMap.set(sidebarId, _newSidebar);
		return _newSidebar;
	}

	export function Destroy(sidebarId: string): void {
		const sidebar = GetSidebarById(sidebarId);

		sidebar.dispose();

		_sidebarMap.delete(sidebarId);
	}

	export function GetAllSidebarMap(): Map<string, OSUIFramework.Patterns.Sidebar.ISidebar> {
		return _sidebarMap;
	}

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
			throw new Error(`Rating id:${sidebarId} not found`);
		}

		return sidebar;
	}

	export function Initialize(sidebarId: string): OSUIFramework.Patterns.Sidebar.ISidebar {
		const sidebar = GetSidebarById(sidebarId);

		sidebar.build();

		return sidebar;
	}

	export function RegisterCallback(sidebarId: string, callback: OSUIFramework.Callbacks.OSSidebarToggleEvent): void {
		const sidebar = GetSidebarById(sidebarId);

		sidebar.registerCallback(callback);
	}
}
