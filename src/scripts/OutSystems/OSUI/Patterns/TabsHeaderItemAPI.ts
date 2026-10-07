// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsHeaderItemAPI {
	const _tabsHeaderItemMap = new Map<string, OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem>();

	/**
	 * Function that will change the property of a given Tabs pattern.
	 *
	 * @param tabsHeaderItemId ID of the Tabs Item where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(tabsHeaderItemId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsHeaderItem.FailChangeProperty,
			callback: () => {
				const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);

				tabsHeaderItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new TabsHeaderItem instance and add it to the tabsContentItem Map
	 *
	 * @param tabsHeaderItemId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the TabsHeaderItem instance
	 */
	export function Create(
		tabsHeaderItemId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem {
		if (_tabsHeaderItemMap.has(tabsHeaderItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.TabsHeaderItem} registered under id: ${tabsHeaderItemId}`
			);
		}

		const _newTabsHeaderItem = new OSFramework.OSUI.Patterns.TabsHeaderItem.TabsHeaderItem(
			tabsHeaderItemId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_tabsHeaderItemMap.set(tabsHeaderItemId, _newTabsHeaderItem);

		return _newTabsHeaderItem;
	}

	/**
	 * Funtion that will disable a specific TabHeaderItem by its Id
	 *
	 * @param tabsHeaderItemId The id of the TabsHeaderItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function DisableTabItem(tabsHeaderItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsHeaderItem.FailDisableTabHeader,
			callback: () => {
				const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);
				tabsHeaderItem.disable();
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given Tabs
	 *
	 * @param tabsHeaderItemId The id of the TabsHeaderItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(tabsHeaderItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsHeaderItem.FailDispose,
			callback: () => {
				const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);

				tabsHeaderItem.dispose();

				_tabsHeaderItemMap.delete(tabsHeaderItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Funtion that will enable a specific TabHeaderItem by its Id
	 *
	 * @param tabsHeaderItemId The id of the TabsHeaderItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function EnableTabItem(tabsHeaderItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsHeaderItem.FailEnableTabHeader,
			callback: () => {
				const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);
				tabsHeaderItem.enable();
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Tabs instances at the page
	 *
	 * @returns the ids of every TabsHeaderItem instance
	 */
	export function GetAllTabsHeaderItems(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_tabsHeaderItemMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @param tabsHeaderItemId ID of the TabsHeaderItem that will be looked for.
	 * @returns the TabsHeaderItem instance
	 */
	export function GetTabsHeaderItemById(
		tabsHeaderItemId: string
	): OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'TabsHeaderItem',
			tabsHeaderItemId,
			_tabsHeaderItemMap
		) as OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem;
	}

	/**
	 * Function that will update on DOM changes inside the TabsHeaderItem
	 *
	 * @param tabsHeaderItemId The id of the TabsHeaderItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function UpdateOnRender(tabsHeaderItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsHeaderItem.FailUpdate,
			callback: () => {
				const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);

				tabsHeaderItem.updateOnRender();
			},
		});

		return result;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param tabsHeaderItemId ID of the TabsHeaderItem pattern that will be initialized.
	 * @returns the TabsHeaderItem instance
	 */
	export function Initialize(tabsHeaderItemId: string): OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem {
		const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);

		tabsHeaderItem.build();

		return tabsHeaderItem;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @param tabsHeaderItemId The id of the TabsHeaderItem element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		tabsHeaderItemId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsHeaderItem.FailRegisterCallback,
			callback: () => {
				const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);

				tabsHeaderItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
