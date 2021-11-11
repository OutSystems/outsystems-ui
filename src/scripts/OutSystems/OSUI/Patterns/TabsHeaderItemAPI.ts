// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsHeaderItemAPI {
	const _tabsMap = new Map<string, string>();
	const _tabsContentItemMap = new Map<string, OSUIFramework.Patterns.TabsContentItem.ITabsContentItem>();
	/**
	 * Gets the Tabd pattern the Item belongs to
	 *
	 * @return {*}  {Map<string, OSUIFramework.Patterns.TabsContentItem.ITabsContentItem>}
	 */
	export function GetTabsByItem(tabsContentItemId: string): OSUIFramework.Patterns.Tabs.ITabs {
		return;
	}

	/**
	 * Function that will change the property of a given Tabs pattern.
	 *
	 * @export
	 * @param {string} tabsContentItemId ID of the Tabs Item where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(tabsContentItemId: string, propertyName: string, propertyValue: any): void {
		return;
	}

	/**
	 * Create the new TabsContentItem instance and add it to the tabsContentItem Map
	 *
	 * @export
	 * @param {string} tabsContentItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Tabs.ITabs}
	 */
	export function Create(
		tabsContentItemId: string,
		configs: string
	): OSUIFramework.Patterns.TabsContentItem.ITabsContentItem {
		return;
	}

	/**
	 * Function that will dispose the instance of the given Tabs
	 *
	 * @export
	 * @param {string} tabsContentItemId
	 */
	export function Dispose(tabsContentItemId: string): void {
		return;
	}

	/**
	 * Function that will return the Map with all the Tabs instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.Tabs.ITabs>}
	 */
	export function GetAllTabsContentItems(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_tabsContentItemMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @export
	 * @param {string} tabsId ID of the Tabs that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.Tabs.ITabs}
	 */
	export function GetTabsContentItemById(
		tabsContentItemId: string
	): OSUIFramework.Patterns.TabsContentItem.ITabsContentItem {
		return;
	}

	export function Initialize(tabsContentItemId: string): OSUIFramework.Patterns.TabsContentItem.ITabsContentItem {
		return;
	}
}
