// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.WizardItemAPI {
	const _wizardItemMap = new Map<string, OSFramework.OSUI.Patterns.WizardItem.IWizardItem>(); //wizardItem.uniqueId -> WizardItem obj

	/**
	 * Function that will change the property of a given Wizard Item pattern.
	 *
	 * @param wizardItemId ID of the Wizard Item where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(wizardItemId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.WizardItem.FailChangeProperty,
			callback: () => {
				const wizardItem = GetWizardItemById(wizardItemId);

				wizardItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new Wizard Item instance and add it to the wizardItem Map
	 *
	 * @param wizardItemId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the WizardItem instance
	 */
	export function Create(
		wizardItemId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.WizardItem.IWizardItem {
		if (_wizardItemMap.has(wizardItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.WizardItem} registered under id: ${wizardItemId}`
			);
		}

		const _newWizardItem = new OSFramework.OSUI.Patterns.WizardItem.WizardItem(
			wizardItemId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_wizardItemMap.set(wizardItemId, _newWizardItem);

		return _newWizardItem;
	}

	/**
	 * Function that will dispose the instance of the given Wizard Item
	 *
	 * @param wizardItemId The id of the WizardItem element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(wizardItemId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.WizardItem.FailDispose,
			callback: () => {
				const wizardItem = GetWizardItemById(wizardItemId);

				wizardItem.dispose();

				_wizardItemMap.delete(wizardItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Wizard Item instances at the page
	 *
	 * @returns the ids of every WizardItem instance
	 */
	export function GetAllWizardItems(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_wizardItemMap);
	}

	/**
	 * Function that gets the instance of a Wizard Item by a given ID.
	 *
	 * @param wizardItemId ID of the WizardItem that will be looked for.
	 * @returns the WizardItem instance
	 */
	export function GetWizardItemById(wizardItemId: string): OSFramework.OSUI.Patterns.WizardItem.IWizardItem {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'WizardItem',
			wizardItemId,
			_wizardItemMap
		) as OSFramework.OSUI.Patterns.WizardItem.IWizardItem;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param wizardItemId ID of the Wizard Item pattern that will be initialized.
	 * @returns the WizardItem instance
	 */
	export function Initialize(wizardItemId: string): OSFramework.OSUI.Patterns.WizardItem.IWizardItem {
		const wizardItem = GetWizardItemById(wizardItemId);

		wizardItem.build();

		return wizardItem;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @param wizardItemId The id of the WizardItem element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		wizardItemId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.WizardItem.FailRegisterCallback,
			callback: () => {
				const wizardItem = GetWizardItemById(wizardItemId);

				wizardItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
