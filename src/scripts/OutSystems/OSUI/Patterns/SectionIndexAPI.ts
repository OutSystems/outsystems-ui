// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SectionIndexAPI {
	const _sectionIndexItemsMap = new Map<string, OSUIFramework.Patterns.SectionIndex.ISectionIndex>(); //SectionIndex.uniqueId -> SectionIndex obj

	/**
	 * Function that will change the property of a given SectionIndex Id.
	 *
	 * @export
	 * @param {string} sectionIndexId ID of the SectionIndex where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(sectionIndexId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _sectionIndexItem = GetSectionIndexById(sectionIndexId);

			_sectionIndexItem.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.SectionIndex.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new SectionIndexItem instance and add it to the sectionIndexItemsMap
	 *
	 * @export
	 * @param {string} sectionIndexId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.SectionIndex.ISectionIndex}
	 */
	export function Create(sectionIndexId: string, configs: string): OSUIFramework.Patterns.SectionIndex.ISectionIndex {
		if (_sectionIndexItemsMap.has(sectionIndexId)) {
			throw new Error(`There is already an SectionIndex registered under id: ${sectionIndexId}`);
		}

		const _sectionIndexItem = new OSUIFramework.Patterns.SectionIndex.SectionIndex(
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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const _sectionIndexItem = GetSectionIndexById(sectionIndexId);

			_sectionIndexItem.dispose();

			_sectionIndexItemsMap.delete(_sectionIndexItem.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.SectionIndex.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the SectionIndex instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllSectionIndexItemsMap(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_sectionIndexItemsMap);
	}

	/**
	 * Function that gets the instance of SectionIndex, by a given ID.
	 *
	 * @export
	 * @param {string} sectionIndexId ID of the SectionIndex that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.SectionIndex.ISectionIndex;}
	 */
	export function GetSectionIndexById(sectionIndexId: string): OSUIFramework.Patterns.SectionIndex.ISectionIndex {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			OSUIFramework.GlobalEnum.PatternsNames.SectionIndex,
			sectionIndexId,
			_sectionIndexItemsMap
		) as OSUIFramework.Patterns.SectionIndex.ISectionIndex;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} sectionIndexId ID of the SectionIndexItem that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.SectionIndex.ISectionIndex}
	 */
	export function Initialize(sectionIndexId: string): OSUIFramework.Patterns.SectionIndex.ISectionIndex {
		const _sectionIndexItem = GetSectionIndexById(sectionIndexId);

		_sectionIndexItem.build();

		return _sectionIndexItem;
	}
}
