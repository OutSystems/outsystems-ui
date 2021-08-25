// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SearchAPI {
	const _searchsMap = new Map<string, OSUIFramework.Patterns.Search.ISearch>(); //search.uniqueId -> Search obj

	/**
	 * Function that will change the property of a given search.
	 *
	 * @export
	 * @param {string} searchId ID of the Search where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(searchId: string, propertyName: string, propertyValue: any): void {
		const search = GetSearchById(searchId);

		search.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Function that will close a given search.
	 *
	 * @export
	 * @param {string} searchId ID of the search that will be closed
	 */
	export function Close(searchId: string): void {
		const search = GetSearchById(searchId);

		search.close();
	}

	/**
	 * Function that will open a given search.
	 *
	 * @export
	 * @param {string} searchId ID of the search that will be closed
	 */
	export function Open(searchId: string): void {
		const search = GetSearchById(searchId);

		search.open();
	}

	/**
	 * Create the new search instance and add it to the searchsMap
	 *
	 * @export
	 * @param {string} searchId ID of the Search where the instance will be created.
	 * @param {string} configs configurations for the Search in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.ISearch}
	 */
	export function Create(searchId: string, configs: string): OSUIFramework.Patterns.Search.ISearch {
		if (_searchsMap.has(searchId)) {
			throw new Error(`There is already a search registered under id: ${searchId}`);
		}

		const _newSearch = new OSUIFramework.Patterns.Search.Search(searchId, JSON.parse(configs));

		_searchsMap.set(searchId, _newSearch);

		return _newSearch;
	}

	/**
	 * Function that will destroy the instance of the given search
	 *
	 * @export
	 * @param {string} searchId
	 */
	export function Destroy(searchId: string): void {
		const search = GetSearchById(searchId);

		search.dispose();

		_searchsMap.delete(searchId);
	}

	/**
	 * Function that will return the Map with all the Search instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.ISearch>}
	 */
	export function GetAllSearches(): Array<string> {
		return Array.from(_searchsMap.keys());
	}

	/**
	 * Function that gets the instance of search, by a given ID.
	 *
	 * @export
	 * @param {string} searchId ID of the Search that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.ISearch}
	 */
	export function GetSearchById(searchId: string): OSUIFramework.Patterns.Search.ISearch {
		let search: OSUIFramework.Patterns.Search.ISearch;

		//searchId is the UniqueId
		if (_searchsMap.has(searchId)) {
			search = _searchsMap.get(searchId);
		} else {
			//Search for searchId
			for (const p of _searchsMap.values()) {
				if (p.equalsToID(searchId)) {
					search = p;
					break;
				}
			}
		}

		if (search === undefined) {
			throw new Error(`Search id:${searchId} not found`);
		}

		return search;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} searchId ID of the Search that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.ISearch}
	 */
	export function Initialize(searchId: string): OSUIFramework.Patterns.Search.ISearch {
		const search = GetSearchById(searchId);

		search.build();

		return search;
	}

	/**
	 * Function that trigger pattern event.
	 *
	 * @export
	 * @param {string} searchId ID of the Search that will be initialized.
	 * @return {*}  callback
	 */
	export function RegisterCallback(searchId: string, callback: OSUIFramework.Callbacks.OSSearchCollapseEvent): void {
		const search = GetSearchById(searchId);
		search.registerCallback(callback);
	}
}
