// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SearchAPI {
	const _searchsMap = new Map<string, OSFramework.Patterns.Search.ISearch>(); //search.uniqueId -> Search obj

	/**
	 * Function that will change the property of a given search.
	 *
	 * @export
	 * @param {string} searchId ID of the Search where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(searchId: string, propertyName: string, propertyValue: unknown): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const search = GetSearchById(searchId);

			search.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Search.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will close a given search.
	 *
	 * @export
	 * @param {string} searchId ID of the search that will be closed
	 */
	export function Close(searchId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const search = GetSearchById(searchId);

			search.close();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Search.FailClose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new search instance and add it to the searchsMap
	 *
	 * @export
	 * @param {string} searchId ID of the Search where the instance will be created.
	 * @param {string} configs configurations for the Search in JSON format.
	 * @return {*}  {OSFramework.Patterns.ISearch}
	 */
	export function Create(searchId: string, configs: string): OSFramework.Patterns.Search.ISearch {
		if (_searchsMap.has(searchId)) {
			throw new Error(
				`There is already a ${OSFramework.GlobalEnum.PatternName.Search} registered under id: ${searchId}`
			);
		}

		const _newSearch = new OSFramework.Patterns.Search.Search(searchId, JSON.parse(configs));

		_searchsMap.set(searchId, _newSearch);

		return _newSearch;
	}

	/**
	 * Function that will destroy the instance of the given search
	 *
	 * @export
	 * @param {string} searchId
	 */
	export function Dispose(searchId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const search = GetSearchById(searchId);

			search.dispose();

			_searchsMap.delete(searchId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Search.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will return the Map with all the Search instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.Patterns.ISearch>}
	 */
	export function GetAllSearches(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_searchsMap);
	}

	/**
	 * Function that gets the instance of search, by a given ID.
	 *
	 * @export
	 * @param {string} searchId ID of the Search that will be looked for.
	 * @return {*}  {OSFramework.Patterns.ISearch}
	 */
	export function GetSearchById(searchId: string): OSFramework.Patterns.Search.ISearch {
		return OSFramework.Helper.MapOperation.FindInMap(
			OSFramework.GlobalEnum.PatternName.Search,
			searchId,
			_searchsMap
		) as OSFramework.Patterns.Search.ISearch;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} searchId ID of the Search that will be initialized.
	 * @return {*}  {OSFramework.Patterns.ISearch}
	 */
	export function Initialize(searchId: string): OSFramework.Patterns.Search.ISearch {
		const search = GetSearchById(searchId);

		search.build();

		return search;
	}

	/**
	 * Function that will open a given search.
	 *
	 * @export
	 * @param {string} searchId ID of the search that will be closed
	 */
	export function Open(searchId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const search = GetSearchById(searchId);

			search.open();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Search.FailOpen;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that trigger pattern event.
	 *
	 * @export
	 * @param {string} searchId ID of the Search that will be initialized.
	 * @return {*}  callback
	 */
	export function RegisterCallback(
		searchId: string,
		callback: OSFramework.CallbacksOLD.OSSearchCollapseEvent
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const search = GetSearchById(searchId);

			search.registerCallback(callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.Search.FailOpen;
		}

		return JSON.stringify(responseObj);
	}
}
