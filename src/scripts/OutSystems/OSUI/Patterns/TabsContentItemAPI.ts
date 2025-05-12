// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsContentItemAPI {
	const _tabsContentItemMap = new Map<string, OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem>();

	/**
	 * Function that will change the property of a given Tabs pattern.
	 *
	 * @export
	 * @param {string} tabsContentItemId ID of the Tabs Item where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} tabsContentItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Tabs.ITabs}
	 */
	export function Create(
		tabsContentItemId: string,
		configs: string
	): OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem {
		if (_tabsContentItemMap.has(tabsContentItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.TabsContentItem} registered under id: ${tabsContentItemId}`
			);
		}

		const _newTabsContentItem = new OSFramework.OSUI.Patterns.TabsContentItem.TabsContentItem(
			tabsContentItemId,
			JSON.parse(configs)
		);

		_tabsContentItemMap.set(tabsContentItemId, _newTabsContentItem);

		return _newTabsContentItem;
	}

	/**
	 * Function that will dispose the instance of the given Tabs
	 *
	 * @export
	 * @param {string} tabsContentItemId
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
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.Tabs.ITabs>}
	 */
	export function GetAllTabsContentItems(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_tabsContentItemMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @export
	 * @param {string} tabsContentItemId ID of the Tabs that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.Tabs.ITabs}
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
	 * @export
	 * @param {string} tabsContentItemId ID of the TabsContentItem pattern that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem}
	 */
	export function Initialize(tabsContentItemId: string): OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem {
		const tabsContentItem = GetTabsContentItemById(tabsContentItemId);

		tabsContentItem.build();

		return tabsContentItem;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} tabsContentItemId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		tabsContentItemId: string,
		eventName: string,
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
