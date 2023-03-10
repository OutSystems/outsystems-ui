// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SidebarAPI {
	const _sidebarMap = new Map<string, OSFramework.OSUI.Patterns.Sidebar.ISidebar>();
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
	 * Function that will toggle the click on outside to close the sidebar.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {boolean} closeOnOutSIdeClick
	 * @return {*}  {string}
	 */
	export function ClickOutsideToClose(sidebarId: string, closeOnOutSIdeClick: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Sidebar.FailClickOutsideToClose,
			callback: () => {
				const sidebar = GetSidebarById(sidebarId);

				sidebar.clickOutsideToClose(closeOnOutSIdeClick);
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
	 * @return {*}  {OSFramework.OSUI.Patterns.Sidebar.ISidebar}
	 */
	export function Create(sidebarId: string, configs: string): OSFramework.OSUI.Patterns.Sidebar.ISidebar {
		if (_sidebarMap.has(sidebarId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Sidebar} registered under id: ${sidebarId}`
			);
		}

		const _newSidebar = OutSystems.OSUI.Patterns.PatternFactoryAPI.CreateInstance(
			OSFramework.OSUI.GlobalEnum.PatternName.Sidebar,
			sidebarId,
			JSON.parse(configs)
		) as OSFramework.OSUI.Patterns.Sidebar.ISidebar;

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
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_sidebarMap);
	}

	/**
	 * Function that gets the instance of Sidebar, by a given ID.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @return {*}  {OSFramework.OSUI.Patterns.Sidebar.ISidebar}
	 */
	export function GetSidebarById(sidebarId: string): OSFramework.OSUI.Patterns.Sidebar.ISidebar {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.Sidebar,
			sidebarId,
			_sidebarMap
		) as OSFramework.OSUI.Patterns.Sidebar.ISidebar;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} sidebarId
	 * @return {*}  {OSFramework.OSUI.Patterns.Sidebar.ISidebar}
	 */
	export function Initialize(sidebarId: string): OSFramework.OSUI.Patterns.Sidebar.ISidebar {
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
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} sidebarId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		sidebarId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Sidebar.FailRegisterCallback,
			callback: () => {
				const _sidebarItem = this.GetSidebarById(sidebarId);

				_sidebarItem.registerCallback(eventName, callback);
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
