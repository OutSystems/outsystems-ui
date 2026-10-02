// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SectionIndexAPI {
	const _sectionIndexItemsMap = new Map<string, OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex>(); //SectionIndex.uniqueId -> SectionIndex obj

	/**
	 * Function that will change the property of a given SectionIndex Id.
	 *
	 * @param sectionIndexId ID of the SectionIndex where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param sectionIndexId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the SectionIndex instance
	 */
	export function Create(
		sectionIndexId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex {
		if (_sectionIndexItemsMap.has(sectionIndexId)) {
			throw new Error(`There is already an SectionIndex registered under id: ${sectionIndexId}`);
		}

		const _sectionIndexItem = new OSFramework.OSUI.Patterns.SectionIndex.SectionIndex(
			sectionIndexId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_sectionIndexItemsMap.set(sectionIndexId, _sectionIndexItem);

		return _sectionIndexItem;
	}

	/**
	 * Function that will dispose the instance of the given SectionIndexItem Id
	 *
	 * @param sectionIndexId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @returns Array<string>
	 */
	export function GetAllSectionIndexItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_sectionIndexItemsMap);
	}

	/**
	 * Function that gets the instance of SectionIndex, by a given ID.
	 *
	 * @param sectionIndexId ID of the SectionIndex that will be looked for.
	 * @returns the SectionIndex instance
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
	 * @param sectionIndexId ID of the SectionIndexItem that will be initialized.
	 * @returns the SectionIndex instance
	 */
	export function Initialize(sectionIndexId: string): OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex {
		const _sectionIndexItem = GetSectionIndexById(sectionIndexId);

		_sectionIndexItem.build();

		return _sectionIndexItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param sectionIndexId
	 * @param eventName
	 * @param callback
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		sectionIndexId: string,
		eventName: EventName,
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
