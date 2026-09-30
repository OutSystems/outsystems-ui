// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.OverflowMenuAPI {
	const _overflowMenuMap = new Map<string, OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu>();

	/**
	 * Function that will change the property of a given OverflowMenu pattern.
	 *
	 * @param overflowMenuId
	 * @param propertyName
	 * @param propertyValue
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param overflowMenuId
	 * @param configs
	 * @returns the OverflowMenu instance
	 */
	export function Create(
		overflowMenuId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu {
		if (_overflowMenuMap.has(overflowMenuId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.OverflowMenu} registered under id: ${overflowMenuId}`
			);
		}

		const _overflowMenuItem = new OSFramework.OSUI.Patterns.OverflowMenu.OverflowMenu(
			overflowMenuId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_overflowMenuMap.set(overflowMenuId, _overflowMenuItem);

		return _overflowMenuItem;
	}

	/**
	 * Function that will disable the given OverflowMenu
	 *
	 * @param overflowMenuId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param overflowMenuId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param overflowMenuId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @returns the ids of every OverflowMenu instance
	 */
	export function GetAllOverflowMenus(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_overflowMenuMap);
	}

	/**
	 * Function that gets the instance of OverflowMenu by a given Id.
	 *
	 * @param overflowMenuId
	 * @returns the OverflowMenu instance
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
	 * @param overflowMenuId ID of the OverflowMenu that will be initialized.
	 * @returns the OverflowMenu instance
	 */
	export function Initialize(overflowMenuId: string): OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu {
		const _overflowMenu = GetOverflowMenuById(overflowMenuId);

		_overflowMenu.build();

		return _overflowMenu;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @param overflowMenuId
	 * @param eventName
	 * @param callback
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		overflowMenuId: string,
		eventName: EventName,
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
	 * @param overflowMenuId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param overflowMenuId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
