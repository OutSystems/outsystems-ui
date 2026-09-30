/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Patterns.WizardAPI {
	const _wizardMap = new Map<string, OSFramework.OSUI.Patterns.Wizard.IWizard>(); //Wizard.uniqueId -> Wizard obj

	/**
	 * Function that will change the property of a given Wizard pattern.
	 *
	 * @param wizardId ID of the Wizard where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(wizardId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Wizard.FailChangeProperty,
			callback: () => {
				const wizard = GetWizardById(wizardId);
				wizard.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new Wizard instance and add it to the wizardMap
	 *
	 * @param wizardId ID of the Pattern that a new instance will be created.
	 * @param configs Configurations for the Pattern in JSON format.
	 * @returns the Wizard instance
	 */
	export function Create(wizardId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Wizard.IWizard {
		if (_wizardMap.has(wizardId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Wizard} registered under id: ${wizardId}`
			);
		}

		const _newWizard = new OSFramework.OSUI.Patterns.Wizard.Wizard(
			wizardId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_wizardMap.set(wizardId, _newWizard);

		return _newWizard;
	}

	/**
	 * Function that will dispose the instance of the given Wizard
	 *
	 * @param wizardId
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(wizardId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Wizard.FailDispose,
			callback: () => {
				const wizard = GetWizardById(wizardId);

				wizard.dispose();

				_wizardMap.delete(wizard.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Wizard instances at the page
	 *
	 * @returns the ids of every Wizard instance
	 */
	export function GetAllWizards(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_wizardMap);
	}

	/**
	 * Function that gets the instance of a Wizard by a given ID.
	 *
	 * @param wizardId ID of the Wizard that will be looked for.
	 * @returns the Wizard instance
	 */
	export function GetWizardById(wizardId: string): OSFramework.OSUI.Patterns.Wizard.IWizard {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Wizard',
			wizardId,
			_wizardMap
		) as OSFramework.OSUI.Patterns.Wizard.IWizard;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param wizardId ID of the Wizard pattern that will be initialized.
	 * @returns the Wizard instance
	 */
	export function Initialize(wizardId: string): OSFramework.OSUI.Patterns.Wizard.IWizard {
		const wizard = GetWizardById(wizardId);

		wizard.build();

		return wizard;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param wizardId
	 * @param eventName
	 * @param callback
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		wizardId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Wizard.FailRegisterCallback,
			callback: () => {
				const wizard = GetWizardById(wizardId);

				wizard.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
