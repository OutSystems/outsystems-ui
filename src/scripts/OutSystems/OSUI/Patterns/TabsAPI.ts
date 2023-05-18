// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.TabsAPI {
	const _tabsMap = new Map<string, OSFramework.OSUI.Patterns.Tabs.ITabs>();

	/**
	 * Function that will change the property of a given Tabs pattern.
	 *
	 * @export
	 * @param {string} tabsId ID of the Tabs where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} tabsId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Tabs.ITabs}
	 */
	export function Create(tabsId: string, configs: string): OSFramework.OSUI.Patterns.Tabs.ITabs {
		if (_tabsMap.has(tabsId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Tabs} registered under id: ${tabsId}`
			);
		}

		const _newTabs = new OSFramework.OSUI.Patterns.Tabs.Tabs(tabsId, JSON.parse(configs));

		_tabsMap.set(tabsId, _newTabs);

		return _newTabs;
	}

	/**
	 * Function that will dispose the instance of the given Tabs
	 *
	 * @export
	 * @param {string} tabsId
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
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.Tabs.ITabs>}
	 */
	export function GetAllTabs(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_tabsMap);
	}

	/**
	 * Function that gets the instance of Tabs by a given ID.
	 *
	 * @export
	 * @param {string} tabsId ID of the Tabs that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.Tabs.ITabs}
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
	 * @export
	 * @param {string} tabsId ID of the Tabs pattern that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.Tabs.ITabs}
	 */
	export function Initialize(tabsId: string): OSFramework.OSUI.Patterns.Tabs.ITabs {
		const tabs = GetTabsById(tabsId);

		tabs.build();

		return tabs;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} tabsId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		tabsId: string,
		eventName: string,
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
	 * @export
	 * @param {string} tabsId
	 * @param {boolean} enableSwipe
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
	 * @export
	 * @param {string} tabsId
	 * @param {number} tabsNumber
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
