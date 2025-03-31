// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SectionIndexAPI {
	const _sectionIndexItemsMap = new Map<string, OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex>(); //SectionIndex.uniqueId -> SectionIndex obj

	/**
	 * Function that will change the property of a given SectionIndex Id.
	 *
	 * @export
	 * @param {string} sectionIndexId ID of the SectionIndex where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(sectionIndexId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.SectionIndex.FailChangeProperty,
			callback: () => {
				const _sectionIndexItem = GetSectionIndexById(sectionIndexId);

				_sectionIndexItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new SectionIndexItem instance and add it to the sectionIndexItemsMap
	 *
	 * @export
	 * @param {string} sectionIndexId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex}
	 */
	export function Create(
		sectionIndexId: string,
		configs: string
	): OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex {
		if (_sectionIndexItemsMap.has(sectionIndexId)) {
			throw new Error(`There is already an SectionIndex registered under id: ${sectionIndexId}`);
		}

		const _sectionIndexItem = new OSFramework.OSUI.Patterns.SectionIndex.SectionIndex(
			sectionIndexId,
			JSON.parse(configs)
		);

		_sectionIndexItemsMap.set(sectionIndexId, _sectionIndexItem);

		return _sectionIndexItem;
	}

	/**
	 * Function that will dispose the instance of the given SectionIndexItem Id
	 *
	 * @export
	 * @param {string} sectionIndexId
	 */
	export function Dispose(sectionIndexId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.SectionIndex.FailDispose,
			callback: () => {
				const _sectionIndexItem = GetSectionIndexById(sectionIndexId);

				_sectionIndexItem.dispose();

				_sectionIndexItemsMap.delete(_sectionIndexItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the SectionIndex instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllSectionIndexItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_sectionIndexItemsMap);
	}

	/**
	 * Function that gets the instance of SectionIndex, by a given ID.
	 *
	 * @export
	 * @param {string} sectionIndexId ID of the SectionIndex that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex;}
	 */
	export function GetSectionIndexById(sectionIndexId: string): OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.SectionIndex,
			sectionIndexId,
			_sectionIndexItemsMap
		) as OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} sectionIndexId ID of the SectionIndexItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex}
	 */
	export function Initialize(sectionIndexId: string): OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex {
		const _sectionIndexItem = GetSectionIndexById(sectionIndexId);

		_sectionIndexItem.build();

		return _sectionIndexItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} sectionIndexId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		sectionIndexId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.SectionIndex.FailRegisterCallback,
			callback: () => {
				const _sectionIndexItem = GetSectionIndexById(sectionIndexId);

				_sectionIndexItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
