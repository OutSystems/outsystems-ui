// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DropdownServerSideItemAPI {
	const _dropdownServerSideItemItemsMap = new Map<
		string,
		OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem
	>(); //DropdownServerSideItem.uniqueId -> DropdownServerSideItem obj

	/**
	 * Function that will change the property of a given DropdownServerSideItem Id.
	 *
	 * @param dropdownServerSideItemId ID of the DropdownServerSideItem where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(
		dropdownServerSideItemId: string,
		propertyName: string,
		propertyValue: unknown
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DropdownServerSideItem.FailChangeProperty,
			callback: () => {
				const _dropdownServerSideItemItem = GetDropdownServerSideItemItemById(dropdownServerSideItemId);

				_dropdownServerSideItemItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new DropdownServerSideItemItem instance and add it to the dropdownServerSideItemItemsMap
	 *
	 * @param dropdownServerSideItemId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the DropdownServerSideItem instance
	 */
	export function Create(
		dropdownServerSideItemId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem {
		if (_dropdownServerSideItemItemsMap.has(dropdownServerSideItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.DropdownServerSideItem} registered under id: ${dropdownServerSideItemId}`
			);
		}

		const _dropdownServerSideItemItem = new OSFramework.OSUI.Patterns.DropdownServerSideItem.DropdownServerSideItem(
			dropdownServerSideItemId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_dropdownServerSideItemItemsMap.set(dropdownServerSideItemId, _dropdownServerSideItemItem);

		return _dropdownServerSideItemItem;
	}

	/**
	 * Function that will dispose the instance of the given DropdownServerSideItemItem Id
	 *
	 * @param dropdownServerSideItemId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(dropdownServerSideItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DropdownServerSideItem.FailDispose,
			callback: () => {
				const _dropdownServerSideItemItem = GetDropdownServerSideItemItemById(dropdownServerSideItemId);

				_dropdownServerSideItemItem.dispose();

				_dropdownServerSideItemItemsMap.delete(_dropdownServerSideItemItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the DropdownServerSideItem instances at the page
	 *
	 * @returns Array<string>
	 */
	export function GetAllDropdownServerSideItemItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_dropdownServerSideItemItemsMap);
	}

	/**
	 * Function that gets the instance of DropdownServerSideItem, by a given ID.
	 *
	 * @param dropdownServerSideItemId ID of the DropdownServerSideItem that will be looked for.
	 * @returns the DropdownServerSideItem instance
	 */
	export function GetDropdownServerSideItemItemById(
		dropdownServerSideItemId: string
	): OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'DropdownServerSideItem',
			dropdownServerSideItemId,
			_dropdownServerSideItemItemsMap
		) as OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param dropdownServerSideItemId ID of the DropdownServerSideItemItem that will be initialized.
	 * @returns the DropdownServerSideItem instance
	 */
	export function Initialize(
		dropdownServerSideItemId: string
	): OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem {
		const _dropdownServerSideItemItem = GetDropdownServerSideItemItemById(dropdownServerSideItemId);

		_dropdownServerSideItemItem.build();

		return _dropdownServerSideItemItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param dropdownServerSideItemId
	 * @param eventName
	 * @param callback
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		dropdownServerSideItemId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.DropdownServerSideItem.FailRegisterCallback,
			callback: () => {
				const _dropdownServerSideItemItem = this.GetDropdownServerSideItemItemById(dropdownServerSideItemId);

				_dropdownServerSideItemItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
