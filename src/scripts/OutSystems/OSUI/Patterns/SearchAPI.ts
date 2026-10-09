// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SearchAPI {
	const _searchMap = new Map<string, OSFramework.OSUI.Patterns.Search.ISearch>();
	/**
	 * Function that will change the property of a given Search.
	 *
	 * @param searchId The id of the Search element
	 * @param propertyName The name of the property to change
	 * @param propertyValue The new value of the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(searchId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Search.FailChangeProperty,
			callback: () => {
				const search = GetSearchById(searchId);

				search.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new Search instance and add it to the SearchesMap
	 *
	 * @param searchId The id of the Search element
	 * @param configs The configuration options as a JSON string or object
	 * @returns the Search instance
	 */
	export function Create(searchId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Search.ISearch {
		if (_searchMap.has(searchId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Search} registered under id: ${searchId}`
			);
		}

		const _newSearch = new OSFramework.OSUI.Patterns.Search.Search(
			searchId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);
		_searchMap.set(searchId, _newSearch);
		return _newSearch;
	}

	/**
	 * Function that will destroy the instance of the given Search
	 *
	 * @param searchId The id of the Search element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(searchId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Search.FailDispose,
			callback: () => {
				const search = GetSearchById(searchId);

				search.dispose();

				_searchMap.delete(searchId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Search instances at the page
	 *
	 * @returns the ids of every Search instance
	 */
	export function GetAllSearches(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_searchMap);
	}

	/**
	 * Function that gets the instance of Search, by a given ID.
	 *
	 * @param searchId The id of the Search element
	 * @returns the Search instance
	 */
	export function GetSearchById(searchId: string): OSFramework.OSUI.Patterns.Search.ISearch {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Search',
			searchId,
			_searchMap
		) as OSFramework.OSUI.Patterns.Search.ISearch;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param searchId The id of the Search element
	 * @returns the Search instance
	 */
	export function Initialize(searchId: string): OSFramework.OSUI.Patterns.Search.ISearch {
		const search = GetSearchById(searchId);

		search.build();

		return search;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param searchId The id of the Search element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		searchId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Search.FailRegisterCallback,
			callback: () => {
				const _SearchItem = this.GetSearchById(searchId);

				_SearchItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
