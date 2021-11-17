// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsAPI {
	const _tabsMap = new Map<string, OSUIFramework.Patterns.Tabs.ITabs>();

	/**
	 * Function that will change the property of a given Tabs pattern.
	 *
	 * @export
	 * @param {string} tabsId ID of the Tabs where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(tabsId: string, propertyName: string, propertyValue: any): void {
		const tabs = GetTabsById(tabsId);

		tabs.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new Tabs instance and add it to the _tabsMap
	 *
	 * @export
	 * @param {string} tabsId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Tabs.ITabs}
	 */
	export function Create(tabsId: string, configs: string): OSUIFramework.Patterns.Tabs.ITabs {
		if (_tabsMap.has(tabsId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.Tabs} registered under id: ${tabsId}`
			);
		}

		const _newTabs = new OSUIFramework.Patterns.Tabs.Tabs(tabsId, JSON.parse(configs));

		_tabsMap.set(tabsId, _newTabs);

		return _newTabs;
	}

	/**
	 * Function that will dispose the instance of the given Tabs
	 *
	 * @export
	 * @param {string} tabsId
	 */
	export function Dispose(tabsId: string): void {
		const tabs = GetTabsById(tabsId);

		tabs.dispose();

		_tabsMap.delete(tabs.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the Tabs instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.Tabs.ITabs>}
	 */
	export function GetAllTabs(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_tabsMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @export
	 * @param {string} tabsId ID of the Tabs that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.Tabs.ITabs}
	 */
	export function GetTabsById(tabsId: string): OSUIFramework.Patterns.Tabs.ITabs {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'Tabs',
			tabsId,
			_tabsMap
		) as OSUIFramework.Patterns.Tabs.ITabs;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} tabsId ID of the Tabs pattern that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.Tabs.ITabs}
	 */
	export function Initialize(tabsId: string): OSUIFramework.Patterns.Tabs.ITabs {
		const tabs = GetTabsById(tabsId);

		tabs.build();

		return tabs;
	}

	/**
	 *
	 *
	 * @export
	 * @param {string} tabsId
	 * @param {*} callback
	 */
	export function RegisterCallback(tabsId: string, callback: OSUIFramework.Callbacks.OSGeneric): void {
		const tabs = GetTabsById(tabsId);

		tabs.registerCallback(callback);
	}

	/**
	 * Function that will update on DOM changes inside the Tabs
	 *
	 * @export
	 * @param {string} tabsId
	 * @return {*}  {OSUIFramework.Patterns.Tabs.ITabs}
	 */
	export function UpdateOnRender(tabsId: string): OSUIFramework.Patterns.Tabs.ITabs {
		const tabs = GetTabsById(tabsId);

		tabs.updateOnRender();

		return tabs;
	}
}
