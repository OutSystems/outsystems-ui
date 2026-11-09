// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsContentItemAPI {
	const _tabsContentItemMap = new Map<string, OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem>();

	/**
	 * Function that will change the property of a given Tabs pattern.
	 *
	 * @param tabsContentItemId ID of the Tabs Item where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(tabsContentItemId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsContentItem.FailChangeProperty,
			callback: () => {
				const tabsContentItem = GetTabsContentItemById(tabsContentItemId);

				tabsContentItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new TabsContentItem instance and add it to the tabsContentItem Map
	 *
	 * @param tabsContentItemId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the TabsContentItem instance
	 */
	export function Create(
		tabsContentItemId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem {
		if (_tabsContentItemMap.has(tabsContentItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.TabsContentItem} registered under id: ${tabsContentItemId}`
			);
		}

		const _newTabsContentItem = new OSFramework.OSUI.Patterns.TabsContentItem.TabsContentItem(
			tabsContentItemId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_tabsContentItemMap.set(tabsContentItemId, _newTabsContentItem);

		return _newTabsContentItem;
	}

	/**
	 * Function that will dispose the instance of the given Tabs
	 *
	 * @param tabsContentItemId The id of the TabsContentItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(tabsContentItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsContentItem.FailDispose,
			callback: () => {
				const tabsContentItem = GetTabsContentItemById(tabsContentItemId);

				tabsContentItem.dispose();

				_tabsContentItemMap.delete(tabsContentItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Tabs instances at the page
	 *
	 * @returns the ids of every TabsContentItem instance
	 */
	export function GetAllTabsContentItems(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_tabsContentItemMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @param tabsContentItemId ID of the Tabs that will be looked for.
	 * @returns the TabsContentItem instance
	 */
	export function GetTabsContentItemById(
		tabsContentItemId: string
	): OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'TabsContentItem',
			tabsContentItemId,
			_tabsContentItemMap
		) as OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param tabsContentItemId ID of the TabsContentItem pattern that will be initialized.
	 * @returns the TabsContentItem instance
	 */
	export function Initialize(tabsContentItemId: string): OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem {
		const tabsContentItem = GetTabsContentItemById(tabsContentItemId);

		tabsContentItem.build();

		return tabsContentItem;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @param tabsContentItemId The id of the TabsContentItem element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		tabsContentItemId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.TabsContentItem.FailRegisterCallback,
			callback: () => {
				const tabsContentItem = GetTabsContentItemById(tabsContentItemId);

				tabsContentItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
