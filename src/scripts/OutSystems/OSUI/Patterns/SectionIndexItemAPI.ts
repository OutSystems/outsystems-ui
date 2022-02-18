// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SectionIndexItemAPI {
	const _sectionIndexMap = new Map<string, string>(); //sectionIndexItem.uniqueId -> SectionIndex.uniqueId
	const _sectionIndexItemItemsMap = new Map<string, OSUIFramework.Patterns.SectionIndexItem.ISectionIndexItem>(); //SectionIndexItem.uniqueId -> SectionIndexItem obj

	/**
	 * Function that will change the property of a given SectionIndexItem Id.
	 *
	 * @export
	 * @param {string} sectionIndexItemId ID of the SectionIndexItem where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(sectionIndexItemId: string, propertyName: string, propertyValue: any): void {
		const _sectionIndexItemItem = GetSectionIndexItemItemById(sectionIndexItemId);

		_sectionIndexItemItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new SectionIndexItemItem instance and add it to the sectionIndexItemItemsMap
	 *
	 * @export
	 * @param {string} sectionIndexItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.SectionIndexItem.ISectionIndexItem}
	 */
	export function Create(
		sectionIndexItemId: string,
		configs: string
	): OSUIFramework.Patterns.SectionIndexItem.ISectionIndexItem {
		if (_sectionIndexItemItemsMap.has(sectionIndexItemId)) {
			/* TODO (by CreateNewPattern): 
				The line below is created by the CreateNewPattern mechanism, that is not able to replace values
				as expected, that said, check other patterns to understand how to replace it!
			*/
			throw new Error('There is already an SectionIndexItem registered under id: ' + sectionIndexItemId);
		}

		const sectionIndex = GetSectionIndexByItem(sectionIndexItemId);

		const _sectionIndexItemItem = new OSUIFramework.Patterns.SectionIndexItem.SectionIndexItem(
			sectionIndexItemId,
			JSON.parse(configs),
			sectionIndex
		);

		_sectionIndexItemItemsMap.set(sectionIndexItemId, _sectionIndexItemItem);
		_sectionIndexItemItem.build();

		if (sectionIndex !== undefined) {
			_sectionIndexMap.set(sectionIndexItemId, sectionIndex.uniqueId);
			sectionIndex.addSectionIndexItem(_sectionIndexItemItem.uniqueId, _sectionIndexItemItem);
		}

		return _sectionIndexItemItem;
	}

	/**
	 * Function that will dispose the instance of the given SectionIndexItemItem Id
	 *
	 * @export
	 * @param {string} sectionIndexItemId
	 */
	export function Dispose(sectionIndexItemId: string): void {
		const _sectionIndexItemItem = GetSectionIndexItemItemById(sectionIndexItemId);

		_sectionIndexItemItem.dispose();

		_sectionIndexItemItemsMap.delete(_sectionIndexItemItem.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the SectionIndexItem instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllSectionIndexItemItemsMap(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_sectionIndexItemItemsMap);
	}

	/**
	 * Gets the Accordion pattern the Item belongs to
	 *
	 * @return {*}  {Map<string, OSUIFramework.Patterns.SectionIndex.ISectionIndex>}
	 */
	export function GetSectionIndexByItem(
		sectionIndexItemId: string
	): OSUIFramework.Patterns.SectionIndex.ISectionIndex {
		let sectionIndex: OSUIFramework.Patterns.SectionIndex.ISectionIndex;

		if (_sectionIndexMap.has(sectionIndexItemId)) {
			sectionIndex = SectionIndexAPI.GetSectionIndexById(_sectionIndexMap.get(sectionIndexItemId));
		} else {
			// Try to find the sectionIndex reference on DOM
			const elem = OSUIFramework.Helper.Dom.GetElementByUniqueId(sectionIndexItemId);
			const sectionIndexElem = elem.closest(
				OSUIFramework.Constants.Dot + OSUIFramework.Patterns.SectionIndex.Enum.CssClass.Pattern
			);
			if (sectionIndexElem) {
				const uniqueId = sectionIndexElem.getAttribute('name');
				sectionIndex = SectionIndexAPI.GetSectionIndexById(uniqueId);
			}
			// Else, it's a 'free' sectionIndex item, no sectionIndex as parent
		}

		return sectionIndex;
	}

	/**
	 * Function that gets the instance of SectionIndexItem, by a given ID.
	 *
	 * @export
	 * @param {string} sectionIndexItemId ID of the SectionIndexItem that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.SectionIndexItem.ISectionIndexItem;}
	 */
	export function GetSectionIndexItemItemById(
		sectionIndexItemId: string
	): OSUIFramework.Patterns.SectionIndexItem.ISectionIndexItem {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'SectionIndexItem',
			sectionIndexItemId,
			_sectionIndexItemItemsMap
		) as OSUIFramework.Patterns.SectionIndexItem.ISectionIndexItem;
	}
}
