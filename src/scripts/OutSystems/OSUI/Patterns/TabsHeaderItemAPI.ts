// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsHeaderItemAPI {
	const _tabsHeaderItemMap = new Map<string, OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem>();

	/**
	 * Function that will change the property of a given Tabs pattern.
	 *
	 * @export
	 * @param {string} tabsHeaderItemId ID of the Tabs Item where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} tabsHeaderItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Tabs.ITabs}
	 */
	export function Create(
		tabsHeaderItemId: string,
		configs: string
	): OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem {
		if (_tabsHeaderItemMap.has(tabsHeaderItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.TabsHeaderItem} registered under id: ${tabsHeaderItemId}`
			);
		}

		const _newTabsHeaderItem = new OSFramework.OSUI.Patterns.TabsHeaderItem.TabsHeaderItem(
			tabsHeaderItemId,
			JSON.parse(configs)
		);

		_tabsHeaderItemMap.set(tabsHeaderItemId, _newTabsHeaderItem);

		return _newTabsHeaderItem;
	}

	/**
	 * Funtion that will disable a specific TabHeaderItem by its Id
	 *
	 * @export
	 * @param {string} tabsHeaderItemId
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} tabsHeaderItemId
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
	 * @export
	 * @param {string} tabsHeaderItemId
	 * @return {*}  {string}
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
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.Tabs.ITabs>}
	 */
	export function GetAllTabsHeaderItems(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_tabsHeaderItemMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @export
	 * @param {string} tabsHeaderItemId ID of the TabsHeaderItem that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.Tabs.ITabs}
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
	 * @export
	 * @param {string} tabsHeaderItemId
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} tabsHeaderItemId ID of the TabsHeaderItem pattern that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem}
	 */
	export function Initialize(tabsHeaderItemId: string): OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem {
		const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);

		tabsHeaderItem.build();

		return tabsHeaderItem;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} tabsHeaderItemId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		tabsHeaderItemId: string,
		eventName: string,
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
