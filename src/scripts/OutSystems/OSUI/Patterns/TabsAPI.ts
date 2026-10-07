// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsAPI {
	const _tabsMap = new Map<string, OSFramework.OSUI.Patterns.Tabs.ITabs>();

	/**
	 * Function that will change the property of a given Tabs pattern.
	 *
	 * @param tabsId ID of the Tabs where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(tabsId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tabs.FailChangeProperty,
			callback: () => {
				const tabs = GetTabsById(tabsId);

				tabs.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new Tabs instance and add it to the _tabsMap
	 *
	 * @param tabsId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the Tabs instance
	 */
	export function Create(tabsId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Tabs.ITabs {
		if (_tabsMap.has(tabsId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Tabs} registered under id: ${tabsId}`
			);
		}

		const _newTabs = new OSFramework.OSUI.Patterns.Tabs.Tabs(tabsId, OSFramework.OSUI.Helper.ParseConfigs(configs));

		_tabsMap.set(tabsId, _newTabs);

		return _newTabs;
	}

	/**
	 * Function that will dispose the instance of the given Tabs
	 *
	 * @param tabsId The id of the Tabs element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(tabsId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tabs.FailDispose,
			callback: () => {
				const tabs = GetTabsById(tabsId);

				tabs.dispose();

				_tabsMap.delete(tabs.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Tabs instances at the page
	 *
	 * @returns the ids of every Tabs instance
	 */
	export function GetAllTabs(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_tabsMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @param tabsId ID of the Tabs that will be looked for.
	 * @returns the Tabs instance
	 */
	export function GetTabsById(tabsId: string): OSFramework.OSUI.Patterns.Tabs.ITabs {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Tabs',
			tabsId,
			_tabsMap
		) as OSFramework.OSUI.Patterns.Tabs.ITabs;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param tabsId ID of the Tabs pattern that will be initialized.
	 * @returns the Tabs instance
	 */
	export function Initialize(tabsId: string): OSFramework.OSUI.Patterns.Tabs.ITabs {
		const tabs = GetTabsById(tabsId);

		tabs.build();

		return tabs;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @param tabsId The id of the Tabs element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		tabsId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tabs.FailRegisterCallback,
			callback: () => {
				const tabs = GetTabsById(tabsId);

				tabs.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function that will toggle the Swipe gestures on Tabs
	 *
	 * @param tabsId The id of the Tabs element
	 * @param enableSwipe Whether swiping between tabs is enabled
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function TabsToggleSwipe(tabsId: string, enableSwipe: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tabs.FailToggleSwipe,
			callback: () => {
				const tabs = GetTabsById(tabsId);

				tabs.toggleDragGestures(enableSwipe);
			},
		});

		return result;
	}

	/**
	 * Function that will open a given tabs item.
	 *
	 * @param tabsId The id of the Tabs element
	 * @param tabsNumber The number of tabs
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function SetActiveTab(tabsId: string, tabsNumber: number): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Tabs.FailSetActive,
			callback: () => {
				const tabs = GetTabsById(tabsId);

				tabs.changeTab(tabsNumber, undefined, true);
			},
		});

		return result;
	}
}
