// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.OverflowMenuAPI {
	const _overflowMenuMap = new Map<string, OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu>();

	/**
	 * Function that will change the property of a given OverflowMenu pattern.
	 *
	 * @export
	 * @param {string} overflowMenuId
	 * @param {string} propertyName
	 * @param {*} propertyValue
	 * @return {*}  {string}
	 */
	export function ChangeProperty(overflowMenuId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.OverflowMenu.FailChangeProperty,
			callback: () => {
				const overflowMenu = GetOverflowMenuById(overflowMenuId);

				overflowMenu.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new OverflowMenu instance and add it to the OverflowMenu Map
	 *
	 * @export
	 * @param {string} overflowMenuId
	 * @param {string} configs
	 * @return {*}  {OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu}
	 */
	export function Create(
		overflowMenuId: string,
		configs: string
	): OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu {
		if (_overflowMenuMap.has(overflowMenuId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.OverflowMenu} registered under id: ${overflowMenuId}`
			);
		}

		const _overflowMenuItem = new OSFramework.OSUI.Patterns.OverflowMenu.OverflowMenu(
			overflowMenuId,
			JSON.parse(configs)
		);

		_overflowMenuMap.set(overflowMenuId, _overflowMenuItem);

		return _overflowMenuItem;
	}

	/**
	 * Function that will disable the given OverflowMenu
	 *
	 * @export
	 * @param {string} overflowMenuId
	 */
	export function Disable(overflowMenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.OverflowMenu.FailDisable,
			callback: () => {
				const _overflowMenu = GetOverflowMenuById(overflowMenuId);

				_overflowMenu.disable();
			},
		});

		return result;
	}

	/**
	 * Function that will dispose the instance of the given OverflowMenu
	 *
	 * @export
	 * @param {string} overflowMenuId
	 */
	export function Dispose(overflowMenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.OverflowMenu.FailDispose,
			callback: () => {
				const _overflowMenu = GetOverflowMenuById(overflowMenuId);

				_overflowMenu.dispose();

				_overflowMenuMap.delete(_overflowMenu.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will enable the given OverflowMenu
	 *
	 * @export
	 * @param {string} overflowMenuId
	 */
	export function Enable(overflowMenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.OverflowMenu.FailEnable,
			callback: () => {
				const _overflowMenu = GetOverflowMenuById(overflowMenuId);

				_overflowMenu.enable();
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the OverflowMenu instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllOverflowMenus(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_overflowMenuMap);
	}

	/**
	 * Function that gets the instance of OverflowMenu by a given Id.
	 *
	 * @export
	 * @param {string} overflowMenuId
	 * @return {*}  {OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu}
	 */
	export function GetOverflowMenuById(overflowMenuId: string): OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.OverflowMenu,
			overflowMenuId,
			_overflowMenuMap
		) as OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} overflowMenuId ID of the OverflowMenu that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu}
	 */
	export function Initialize(overflowMenuId: string): OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu {
		const _overflowMenu = GetOverflowMenuById(overflowMenuId);

		_overflowMenu.build();

		return _overflowMenu;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @export
	 * @param {string} overflowMenuId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		overflowMenuId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.Generic
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.OverflowMenu.FailRegisterCallback,
			callback: () => {
				const _overflowMenu = GetOverflowMenuById(overflowMenuId);

				_overflowMenu.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function to open this pattern
	 *
	 * @export
	 * @param {string} overflowMenuId
	 * @return {*}  {string}
	 */
	export function Open(overflowMenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.OverflowMenu.FailOpen,
			callback: () => {
				const _overflowMenuItem = GetOverflowMenuById(overflowMenuId);

				_overflowMenuItem.open(true);
			},
		});

		return result;
	}

	/**
	 * Function to close this pattern
	 *
	 * @export
	 * @param {string} overflowMenuId
	 * @return {*}  {string}
	 */
	export function Close(overflowMenuId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.OverflowMenu.FailClose,
			callback: () => {
				const _overflowMenuItem = GetOverflowMenuById(overflowMenuId);

				_overflowMenuItem.close();
			},
		});

		return result;
	}
}
