// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.BottomSheetAPI {
	const _bottomSheetItemsMap = new Map<string, OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet>(); //BottomSheet.uniqueId -> BottomSheet obj

	/**
	 * Function that will change the property of a given BottomSheet Id.
	 *
	 * @export
	 * @param {string} bottomSheetId ID of the BottomSheet where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(bottomSheetId: string, propertyName: string, propertyValue: any): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.BottomSheet.FailChangeProperty,
			callback: () => {
				const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

				_bottomSheetItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new BottomSheetItem instance and add it to the bottomSheetItemsMap
	 *
	 * @export
	 * @param {string} bottomSheetId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet}
	 */
	export function Create(bottomSheetId: string, configs: string): OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet {
		if (_bottomSheetItemsMap.has(bottomSheetId)) {
			throw new Error('There is already an BottomSheet registered under id: ' + bottomSheetId);
		}

		const _bottomSheetItem = new OSFramework.OSUI.Patterns.BottomSheet.BottomSheet(
			bottomSheetId,
			JSON.parse(configs)
		);

		_bottomSheetItemsMap.set(bottomSheetId, _bottomSheetItem);

		return _bottomSheetItem;
	}

	/**
	 * Function that will dispose the instance of the given BottomSheetItem Id
	 *
	 * @export
	 * @param {string} bottomSheetId
	 */
	export function Dispose(bottomSheetId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.BottomSheet.FailDispose,
			callback: () => {
				const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

				_bottomSheetItem.dispose();

				_bottomSheetItemsMap.delete(_bottomSheetItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the BottomSheet instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllBottomSheetItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_bottomSheetItemsMap);
	}

	/**
	 * Function that gets the instance of BottomSheet, by a given ID.
	 *
	 * @export
	 * @param {string} bottomSheetId ID of the BottomSheet that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet;}
	 */
	export function GetBottomSheetItemById(bottomSheetId: string): OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'BottomSheet',
			bottomSheetId,
			_bottomSheetItemsMap
		) as OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} bottomSheetId ID of the BottomSheetItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet}
	 */
	export function Initialize(bottomSheetId: string): OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet {
		const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

		_bottomSheetItem.build();

		return _bottomSheetItem;
	}

	/**
	 * Function to open this pattern
	 *
	 * @export
	 * @param {string} bottomSheetId
	 * @return {*}  {string}
	 */
	export function Open(bottomSheetId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.BottomSheet.FailOpen,
			callback: () => {
				const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

				_bottomSheetItem.open();
			},
		});

		return result;
	}

	/**
	 * Function to close this pattern
	 *
	 * @export
	 * @param {string} bottomSheetId
	 * @return {*}  {string}
	 */
	export function Close(bottomSheetId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.BottomSheet.FailClose,
			callback: () => {
				const _bottomSheetItem = GetBottomSheetItemById(bottomSheetId);

				_bottomSheetItem.close();
			},
		});

		return result;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @export
	 * @param {string} bottomSheetId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		bottomSheetId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.BottomSheet.FailRegisterCallback,
			callback: () => {
				const bottomSheet = GetBottomSheetItemById(bottomSheetId);

				bottomSheet.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
