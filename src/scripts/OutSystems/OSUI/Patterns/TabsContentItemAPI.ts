// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsContentItemAPI {
	const _tabsMap = new Map<string, string>();
	const _tabsContentItemMap = new Map<string, OSFramework.Patterns.TabsContentItem.ITabsContentItem>();
	/**
	 * Gets the Tabd pattern the Item belongs to
	 *
	 * @return {*}  {Map<string, OSFramework.Patterns.TabsContentItem.ITabsContentItem>}
	 */
	export function GetTabsByItem(tabsContentItemId: string): OSFramework.Patterns.Tabs.ITabs {
		let tabs: OSFramework.Patterns.Tabs.ITabs;

		if (_tabsMap.has(tabsContentItemId)) {
			tabs = TabsAPI.GetTabsById(_tabsMap.get(tabsContentItemId));
		} else {
			// Try to find its reference on DOM
			const elem = OSFramework.Helper.Dom.GetElementByUniqueId(tabsContentItemId);
			const tabsElem = elem.closest(
				OSFramework.Constants.Dot + OSFramework.Patterns.Tabs.Enum.CssClasses.TabsWrapper
			);

			if (!tabsElem) {
				throw Error(
					`This ${OSFramework.GlobalEnum.PatternName.TabsContentItem} does not belong to any ${OSFramework.GlobalEnum.PatternName.Tabs} pattern.`
				);
			}
			const uniqueId = tabsElem.getAttribute('name');
			tabs = TabsAPI.GetTabsById(uniqueId);
		}

		return tabs;
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
	export function ChangeProperty(tabsContentItemId: string, propertyName: string, propertyValue: any): string {
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
	 * @return {*}  {OSFramework.Patterns.Tabs.ITabs}
	 */
	export function Create(
		tabsContentItemId: string,
		configs: string
	): OSFramework.Patterns.TabsContentItem.ITabsContentItem {
		if (_tabsContentItemMap.has(tabsContentItemId)) {
			throw new Error(
				`There is already a ${OSFramework.GlobalEnum.PatternName.TabsContentItem} registered under id: ${tabsContentItemId}`
			);
		}
		const tabs = GetTabsByItem(tabsContentItemId);

		const _newTabsContentItem = new OSFramework.Patterns.TabsContentItem.TabsContentItem(
			tabsContentItemId,
			JSON.parse(configs)
		);

		_tabsContentItemMap.set(tabsContentItemId, _newTabsContentItem);
		_newTabsContentItem.build();

		if (tabs !== undefined) {
			_tabsMap.set(tabsContentItemId, tabs.uniqueId);
		}

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
	 * @return {*}  {Map<string, OSFramework.Patterns.Tabs.ITabs>}
	 */
	export function GetAllTabsContentItems(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_tabsContentItemMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @export
	 * @param {string} tabsId ID of the Tabs that will be looked for.
	 * @return {*}  {OSFramework.Patterns.Tabs.ITabs}
	 */
	export function GetTabsContentItemById(
		tabsContentItemId: string
	): OSFramework.Patterns.TabsContentItem.ITabsContentItem {
		return OSFramework.Helper.MapOperation.FindInMap(
			'TabsContentItem',
			tabsContentItemId,
			_tabsContentItemMap
		) as OSFramework.Patterns.TabsContentItem.ITabsContentItem;
	}
}
