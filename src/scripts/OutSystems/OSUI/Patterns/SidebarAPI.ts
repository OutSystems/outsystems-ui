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
	export function ChangeProperty(sidebarId: string, propertyName: string, propertyValue: unknown): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const sidebar = GetSidebarById(sidebarId);

			sidebar.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Sidebar.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that Closes the sidebar.
	 *
	 * @export
	 * @param {string} sidebarId
	 */
	export function Close(sidebarId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const sidebar = GetSidebarById(sidebarId);

			sidebar.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Sidebar.FailClose;
		}

		return JSON.stringify(responseObj);
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
				`There is already a ${OSUIFramework.GlobalEnum.PatternName.Sidebar} registered under id: ${sidebarId}`
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
	export function Dispose(sidebarId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const sidebar = GetSidebarById(sidebarId);

			sidebar.dispose();

			_sidebarMap.delete(sidebarId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Sidebar.FailDispose;
		}

		return JSON.stringify(responseObj);
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
			OSUIFramework.GlobalEnum.PatternName.Sidebar,
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
	export function RegisterCallback(
		sidebarId: string,
		callback: OSUIFramework.Callbacks.OSSidebarToggleEvent
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const sidebar = GetSidebarById(sidebarId);

			sidebar.registerCallback(callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Sidebar.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that opens the sidebar.
	 *
	 * @export
	 * @param {string} sidebarId
	 */
	export function Open(sidebarId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const sidebar = GetSidebarById(sidebarId);

			sidebar.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Sidebar.FailOpen;
		}

		return JSON.stringify(responseObj);
	}
}
