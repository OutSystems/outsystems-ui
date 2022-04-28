// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.DropdownServerSideItemAPI {
	const _dropdownServerSideItemItemsMap = new Map<
		string,
		OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem
	>(); //DropdownServerSideItem.uniqueId -> DropdownServerSideItem obj

	/**
	 * Function that will change the property of a given DropdownServerSideItem Id.
	 *
	 * @export
	 * @param {string} dropdownServerSideItemId ID of the DropdownServerSideItem where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(dropdownServerSideItemId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownServerSideItemItem = GetDropdownServerSideItemItemById(dropdownServerSideItemId);

			_dropdownServerSideItemItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DropdownServerSideItem.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new DropdownServerSideItemItem instance and add it to the dropdownServerSideItemItemsMap
	 *
	 * @export
	 * @param {string} dropdownServerSideItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem}
	 */
	export function Create(
		dropdownServerSideItemId: string,
		configs: string
	): OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem {
		if (_dropdownServerSideItemItemsMap.has(dropdownServerSideItemId)) {
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.DropdownServerSideItem} registered under id: ${dropdownServerSideItemId}`
			);
		}

		const _dropdownServerSideItemItem = new OSUIFramework.Patterns.DropdownServerSideItem.DropdownServerSideItem(
			dropdownServerSideItemId,
			JSON.parse(configs)
		);

		_dropdownServerSideItemItemsMap.set(dropdownServerSideItemId, _dropdownServerSideItemItem);

		return _dropdownServerSideItemItem;
	}

	/**
	 * Function that will dispose the instance of the given DropdownServerSideItemItem Id
	 *
	 * @export
	 * @param {string} dropdownServerSideItemId
	 */
	export function Dispose(dropdownServerSideItemId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownServerSideItemItem = GetDropdownServerSideItemItemById(dropdownServerSideItemId);

			_dropdownServerSideItemItem.dispose();

			_dropdownServerSideItemItemsMap.delete(_dropdownServerSideItemItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DropdownServerSideItem.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the DropdownServerSideItem instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllDropdownServerSideItemItemsMap(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_dropdownServerSideItemItemsMap);
	}

	/**
	 * Function that gets the instance of DropdownServerSideItem, by a given ID.
	 *
	 * @export
	 * @param {string} dropdownServerSideItemId ID of the DropdownServerSideItem that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem;}
	 */
	export function GetDropdownServerSideItemItemById(
		dropdownServerSideItemId: string
	): OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'DropdownServerSideItem',
			dropdownServerSideItemId,
			_dropdownServerSideItemItemsMap
		) as OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} dropdownServerSideItemId ID of the DropdownServerSideItemItem that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem}
	 */
	export function Initialize(
		dropdownServerSideItemId: string
	): OSUIFramework.Patterns.DropdownServerSideItem.IDropdownServerSideItem {
		const _dropdownServerSideItemItem = GetDropdownServerSideItemItemById(dropdownServerSideItemId);

		_dropdownServerSideItemItem.build();

		return _dropdownServerSideItemItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} dropdownServerSideItemId
	 * @param {string} eventName
	 * @param {OSUIFramework.Callbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		dropdownServerSideItemId: string,
		eventName: string,
		callback: OSUIFramework.Callbacks.OSGeneric
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _dropdownServerSideItemItem = this.GetDropdownServerSideItemItemById(dropdownServerSideItemId);

			_dropdownServerSideItemItem.registerCallback(eventName, callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.DropdownServerSideItem.FailDispose;
		}

		return JSON.stringify(responseObj);
	}
}
