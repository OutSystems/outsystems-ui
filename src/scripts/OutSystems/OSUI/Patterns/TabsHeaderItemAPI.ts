// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsHeaderItemAPI {
	const _tabsMap = new Map<string, string>();
	const _tabsHeaderItemMap = new Map<string, OSUIFramework.Patterns.TabsHeaderItem.ITabsHeaderItem>();
	/**
	 * Gets the Tabd pattern the Item belongs to
	 *
	 * @return {*}  {Map<string, OSUIFramework.Patterns.TabsHeaderItem.ITabsHeaderItem>}
	 */
	export function GetTabsByItem(tabsHeaderItemId: string): OSUIFramework.Patterns.Tabs.ITabs {
		let tabs: OSUIFramework.Patterns.Tabs.ITabs;

		if (_tabsMap.has(tabsHeaderItemId)) {
			tabs = TabsAPI.GetTabsById(_tabsMap.get(tabsHeaderItemId));
		} else {
			// Try to find its reference on DOM
			const elem = OSUIFramework.Helper.Dom.GetElementByUniqueId(tabsHeaderItemId);
			const tabsElem = elem.closest(
				OSUIFramework.Constants.Dot + OSUIFramework.Patterns.Tabs.Enum.CssClasses.TabsWrapper
			);

			if (!tabsElem) {
				throw Error(
					`This ${OSUIFramework.GlobalEnum.PatternName.TabsHeaderItem} does not belong to any ${OSUIFramework.GlobalEnum.PatternName.Tabs} pattern.`
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
	 * @param {string} tabsHeaderItemId ID of the Tabs Item where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(tabsHeaderItemId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);

			tabsHeaderItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TabsHeaderItem.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new TabsHeaderItem instance and add it to the tabsContentItem Map
	 *
	 * @export
	 * @param {string} tabsHeaderItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Tabs.ITabs}
	 */
	export function Create(
		tabsHeaderItemId: string,
		configs: string
	): OSUIFramework.Patterns.TabsHeaderItem.ITabsHeaderItem {
		if (_tabsHeaderItemMap.has(tabsHeaderItemId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternName.TabsHeaderItem} registered under id: ${tabsHeaderItemId}`
			);
		}
		const tabs = GetTabsByItem(tabsHeaderItemId);

		const _newTabsHeaderItem = new OSUIFramework.Patterns.TabsHeaderItem.TabsHeaderItem(
			tabsHeaderItemId,
			JSON.parse(configs)
		);

		_tabsHeaderItemMap.set(tabsHeaderItemId, _newTabsHeaderItem);
		_newTabsHeaderItem.build();

		if (tabs !== undefined) {
			_tabsMap.set(tabsHeaderItemId, tabs.uniqueId);
		}

		return _newTabsHeaderItem;
	}

	/**
	 * Function that will dispose the instance of the given Tabs
	 *
	 * @export
	 * @param {string} tabsHeaderItemId
	 */
	export function Dispose(tabsHeaderItemId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const tabsHeaderItem = GetTabsHeaderItemById(tabsHeaderItemId);

			tabsHeaderItem.dispose();

			_tabsHeaderItemMap.delete(tabsHeaderItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.TabsHeaderItem.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will return the Map with all the Tabs instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.Tabs.ITabs>}
	 */
	export function GetAllTabsHeaderItems(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_tabsHeaderItemMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @export
	 * @param {string} tabsId ID of the Tabs that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.Tabs.ITabs}
	 */
	export function GetTabsHeaderItemById(
		tabsHeaderItemId: string
	): OSUIFramework.Patterns.TabsHeaderItem.ITabsHeaderItem {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'TabsHeaderItem',
			tabsHeaderItemId,
			_tabsHeaderItemMap
		) as OSUIFramework.Patterns.TabsHeaderItem.ITabsHeaderItem;
	}
}
