// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SidebarAPI {
	const _sidebarMap = new Map<string, OSFramework.Patterns.Sidebar.ISidebar>();
	/**
	 * Function that will change the property of a given Sidebar.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {string} propertyName
	 * @param {*} propertyValue
	 */
	export function ChangeProperty(sidebarId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Sidebar.FailChangeProperty,
			callback: () => {
				const sidebar = GetSidebarById(sidebarId);

				sidebar.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Function that Closes the sidebar.
	 *
	 * @export
	 * @param {string} sidebarId
	 */
	export function Close(sidebarId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Sidebar.FailClose,
			callback: () => {
				const sidebar = GetSidebarById(sidebarId);

				sidebar.close();
			},
		});

		return result;
	}

	/**
	 * Create the new Sidebar instance and add it to the sidebarsMap
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {string} configs
	 * @return {*}  {OSFramework.Patterns.Sidebar.ISidebar}
	 */
	export function Create(sidebarId: string, configs: string): OSFramework.Patterns.Sidebar.ISidebar {
		if (_sidebarMap.has(sidebarId)) {
			throw new Error(
				`There is already a ${OSFramework.GlobalEnum.PatternName.Sidebar} registered under id: ${sidebarId}`
			);
		}

		const _newSidebar = new OSFramework.Patterns.Sidebar.Sidebar(sidebarId, JSON.parse(configs));
		_sidebarMap.set(sidebarId, _newSidebar);
		return _newSidebar;
	}

	/**
	 * Function that will destroy the instance of the given Sidebar
	 *
	 * @export
	 * @param {string} sidebarId
	 */
	export function Dispose(sidebarId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Sidebar.FailDispose,
			callback: () => {
				const sidebar = GetSidebarById(sidebarId);

				sidebar.dispose();

				_sidebarMap.delete(sidebarId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Sidebar instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllSidebars(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_sidebarMap);
	}

	/**
	 * Function that gets the instance of Sidebar, by a given ID.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @return {*}  {OSFramework.Patterns.Sidebar.ISidebar}
	 */
	export function GetSidebarById(sidebarId: string): OSFramework.Patterns.Sidebar.ISidebar {
		return OSFramework.Helper.MapOperation.FindInMap(
			OSFramework.GlobalEnum.PatternName.Sidebar,
			sidebarId,
			_sidebarMap
		) as OSFramework.Patterns.Sidebar.ISidebar;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @return {*}  {OSFramework.Patterns.Sidebar.ISidebar}
	 */
	export function Initialize(sidebarId: string): OSFramework.Patterns.Sidebar.ISidebar {
		const sidebar = GetSidebarById(sidebarId);

		sidebar.build();

		return sidebar;
	}

	/**
	 * Function that opens the sidebar.
	 *
	 * @export
	 * @param {string} sidebarId
	 */
	export function Open(sidebarId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Sidebar.FailOpen,
			callback: () => {
				const sidebar = GetSidebarById(sidebarId);

				sidebar.open();
			},
		});

		return result;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {OSFramework.Patterns.Sidebar.Callbacks.OSOnToggleEvent} callback
	 */
	export function RegisterCallback(
		sidebarId: string,
		callback: OSFramework.Patterns.Sidebar.Callbacks.OSOnToggleEvent
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Sidebar.FailRegisterCallback,
			callback: () => {
				const sidebar = GetSidebarById(sidebarId);

				sidebar.registerCallback(callback);
			},
		});

		return result;
	}

	/**
	 * Function that toggle swipes on sidebar.
	 *
	 * @export
	 * @param {string} sidebarId
	 */
	export function ToggleGestures(sidebarId: string, enableSwipe: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Sidebar.FailToggleSwipe,
			callback: () => {
				const sidebar = GetSidebarById(sidebarId);

				sidebar.toggleGestures(enableSwipe);
			},
		});

		return result;
	}
}
