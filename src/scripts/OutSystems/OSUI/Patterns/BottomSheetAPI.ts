// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.BottomSheetAPI {
	const _bottomSheetItemsMap = new Map<string, OSUIFramework.Patterns.BottomSheet.IBottomSheet>(); //BottomSheet.uniqueId -> BottomSheet obj

	/**
	 * Function that will change the property of a given BottomSheet Id.
	 *
	 * @export
	 * @param {string} bottomSheetId ID of the BottomSheet where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(bottomSheetId: string, propertyName: string, propertyValue: any): void {
		const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

		_bottomSheetItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new BottomSheetItem instance and add it to the bottomSheetItemsMap
	 *
	 * @export
	 * @param {string} bottomSheetId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.BottomSheet.IBottomSheet}
	 */
	export function Create(bottomSheetId: string, configs: string): OSUIFramework.Patterns.BottomSheet.IBottomSheet {
		if (_bottomSheetItemsMap.has(bottomSheetId)) {
			throw new Error('There is already an BottomSheet registered under id: ' + bottomSheetId);
		}

		const _bottomSheetItem = new OSUIFramework.Patterns.BottomSheet.BottomSheet(bottomSheetId, JSON.parse(configs));

		_bottomSheetItemsMap.set(bottomSheetId, _bottomSheetItem);

		return _bottomSheetItem;
	}

	/**
	 * Function that will dispose the instance of the given BottomSheetItem Id
	 *
	 * @export
	 * @param {string} bottomSheetId
	 */
	export function Dispose(bottomSheetId: string): void {
		const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

		_bottomSheetItem.dispose();

		_bottomSheetItemsMap.delete(_bottomSheetItem.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the BottomSheet instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllBottomSheetItemsMap(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_bottomSheetItemsMap);
	}

	/**
	 * Function that gets the instance of BottomSheet, by a given ID.
	 *
	 * @export
	 * @param {string} bottomSheetId ID of the BottomSheet that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.BottomSheet.IBottomSheet;}
	 */
	export function GetBottomSheetItemById(bottomSheetId: string): OSUIFramework.Patterns.BottomSheet.IBottomSheet {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'BottomSheet',
			bottomSheetId,
			_bottomSheetItemsMap
		) as OSUIFramework.Patterns.BottomSheet.IBottomSheet;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} bottomSheetId ID of the BottomSheetItem that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.BottomSheet.IBottomSheet}
	 */
	export function Initialize(bottomSheetId: string): OSUIFramework.Patterns.BottomSheet.IBottomSheet {
		const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

		_bottomSheetItem.build();

		return _bottomSheetItem;
	}

	export function Open(bottomSheetId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

			_bottomSheetItem.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.BottomSheet.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	export function Close(bottomSheetId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

			_bottomSheetItem.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.BottomSheet.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @export
	 * @param {string} bottomSheetId
	 * @param {*} callback
	 */
	export function RegisterCallback(bottomSheetId: string, callback: OSUIFramework.Callbacks.Generic): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const bottomSheet = GetBottomSheetItemById(bottomSheetId);

			bottomSheet.registerCallback(callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.BottomSheet.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}
}
