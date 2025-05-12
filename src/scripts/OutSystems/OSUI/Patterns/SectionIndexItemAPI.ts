// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SectionIndexItemAPI {
	const _sectionIndexItemMap = new Map<string, OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem>(); //SectionIndexItem.uniqueId -> SectionIndexItem obj

	/**
	 * Function that will change the property of a given SectionIndexItem Id.
	 *
	 * @export
	 * @param {string} sectionIndexItemId ID of the SectionIndexItem where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(sectionIndexItemId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.SectionIndexItem.FailChangeProperty,
			callback: () => {
				const _sectionIndexItem = GetSectionIndexItemById(sectionIndexItemId);

				_sectionIndexItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new SectionIndexItemItem instance and add it to the sectionIndexItemItemsMap
	 *
	 * @export
	 * @param {string} sectionIndexItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem}
	 */
	export function Create(
		sectionIndexItemId: string,
		configs: string
	): OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem {
		if (_sectionIndexItemMap.has(sectionIndexItemId)) {
			throw new Error(`There is already a SectionIndexItem registered under id: ${sectionIndexItemId}`);
		}

		const _sectionIndexItem = new OSFramework.OSUI.Patterns.SectionIndexItem.SectionIndexItem(
			sectionIndexItemId,
			JSON.parse(configs)
		);

		_sectionIndexItemMap.set(sectionIndexItemId, _sectionIndexItem);

		return _sectionIndexItem;
	}

	/**
	 * Function that will dispose the instance of the given SectionIndexItemItem Id
	 *
	 * @export
	 * @param {string} sectionIndexItemId
	 */
	export function Dispose(sectionIndexItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.SectionIndexItem.FailDispose,
			callback: () => {
				const _sectionIndexItemItem = GetSectionIndexItemById(sectionIndexItemId);

				_sectionIndexItemItem.dispose();

				_sectionIndexItemMap.delete(_sectionIndexItemItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the SectionIndexItem instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllSectionIndexItemItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_sectionIndexItemMap);
	}

	/**
	 * Function that gets the instance of SectionIndexItem, by a given ID.
	 *
	 * @export
	 * @param {string} sectionIndexItemId ID of the SectionIndexItem that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem;}
	 */
	export function GetSectionIndexItemById(
		sectionIndexItemId: string
	): OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'SectionIndexItem',
			sectionIndexItemId,
			_sectionIndexItemMap
		) as OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} sectionIndexItemId ID of the SectionIndexItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem}
	 */
	export function Initialize(
		sectionIndexItemId: string
	): OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem {
		const _sectionIndexItem = GetSectionIndexItemById(sectionIndexItemId);

		_sectionIndexItem.build();

		return _sectionIndexItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} sectionIndexItemId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 */
	export function RegisterCallback(
		sectionIndexItemId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.SectionIndexItem.FailRegisterCallback,
			callback: () => {
				const _sectionIndexItem = this.GetSectionIndexItemById(sectionIndexItemId);

				_sectionIndexItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
