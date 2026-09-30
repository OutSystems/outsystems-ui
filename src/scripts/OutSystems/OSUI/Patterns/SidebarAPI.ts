// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SidebarAPI {
	const _sidebarMap = new Map<string, OSFramework.OSUI.Patterns.Sidebar.ISidebar>();
	/**
	 * Function that will change the property of a given Sidebar.
	 *
	 * @param sidebarId
	 * @param propertyName
	 * @param propertyValue
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param sidebarId
	 * @param closeOnOutSIdeClick
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param sidebarId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param sidebarId
	 * @param configs
	 * @returns the Sidebar instance
	 */
	export function Create(sidebarId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Sidebar.ISidebar {
		if (_sidebarMap.has(sidebarId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Sidebar} registered under id: ${sidebarId}`
			);
		}

		const _newSidebar = new OSFramework.OSUI.Patterns.Sidebar.Sidebar(
			sidebarId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);
		_sidebarMap.set(sidebarId, _newSidebar);
		return _newSidebar;
	}

	/**
	 * Function that will destroy the instance of the given Sidebar
	 *
	 * @param sidebarId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @returns the ids of every Sidebar instance
	 */
	export function GetAllSidebars(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_sidebarMap);
	}

	/**
	 * Function that gets the instance of Sidebar, by a given ID.
	 *
	 * @param sidebarId
	 * @returns the Sidebar instance
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
	 * @param sidebarId
	 * @returns the Sidebar instance
	 */
	export function Initialize(sidebarId: string): OSFramework.OSUI.Patterns.Sidebar.ISidebar {
		const sidebar = GetSidebarById(sidebarId);

		sidebar.build();

		return sidebar;
	}

	/**
	 * Function that opens the sidebar.
	 *
	 * @param sidebarId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param sidebarId
	 * @param eventName
	 * @param callback
	 * @returns Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		sidebarId: string,
		eventName: EventName,
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
	 * @param sidebarId ID of the Sidebar pattern.
	 * @param enableSwipe True to open/close the sidebar with swipe gestures.
	 * @returns Response object as a JSON string
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
