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
	export function ChangeProperty(tabsId: string, propertyName: string, propertyValue: unknown): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const tabs = GetTabsById(tabsId);

			tabs.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tabs.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
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
				`There is already a ${OSUIFramework.GlobalEnum.PatternName.Tabs} registered under id: ${tabsId}`
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
	export function Dispose(tabsId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const tabs = GetTabsById(tabsId);

			tabs.dispose();

			_tabsMap.delete(tabs.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tabs.FailDispose;
		}

		return JSON.stringify(responseObj);
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
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} tabsId
	 * @param {*} callback
	 */
	export function RegisterCallback(tabsId: string, callback: OSUIFramework.Callbacks.OSGeneric): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const tabs = GetTabsById(tabsId);

			tabs.registerCallback(callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tabs.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will toggle the Swipe gestures on Tabs
	 *
	 * @export
	 * @param {string} tabsId
	 * @param {boolean} enableSwipe
	 */
	export function TabsToggleSwipe(tabsId: string, enableSwipe: boolean): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const tabs = GetTabsById(tabsId);

			tabs.toggleDragGestures(enableSwipe);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tabs.FailToggleSwipe;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will open a given tabs item.
	 *
	 * @export
	 * @param {string} tabsId
	 * @param {number} tabsNumber
	 */
	export function SetActiveTab(tabsId: string, tabsNumber: number): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const tabs = GetTabsById(tabsId);

			tabs.changeTab(tabsNumber, undefined, true, true);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Tabs.FailSetActive;
		}

		return JSON.stringify(responseObj);
	}
}
