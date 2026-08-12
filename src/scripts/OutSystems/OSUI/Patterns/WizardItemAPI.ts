// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.WizardItemAPI {
	const _wizardItemMap = new Map<string, OSFramework.OSUI.Patterns.WizardItem.IWizardItem>(); //wizardItem.uniqueId -> WizardItem obj

	/**
	 * Function that will change the property of a given Wizard Item pattern.
	 *
	 * @export
	 * @param {string} wizardItemId ID of the Wizard Item where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} wizardItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.WizardItem.IWizardItem}
	 */
	export function Create(wizardItemId: string, configs: string): OSFramework.OSUI.Patterns.WizardItem.IWizardItem {
		if (_wizardItemMap.has(wizardItemId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.WizardItem} registered under id: ${wizardItemId}`
			);
		}

		const _newWizardItem = new OSFramework.OSUI.Patterns.WizardItem.WizardItem(wizardItemId, JSON.parse(configs));

		_wizardItemMap.set(wizardItemId, _newWizardItem);

		return _newWizardItem;
	}

	/**
	 * Function that will dispose the instance of the given Wizard Item
	 *
	 * @export
	 * @param {string} wizardItemId
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
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllWizardItems(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_wizardItemMap);
	}

	/**
	 * Function that gets the instance of a Wizard Item by a given ID.
	 *
	 * @export
	 * @param {string} wizardItemId ID of the WizardItem that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.WizardItem.IWizardItem}
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
	 * @export
	 * @param {string} wizardItemId ID of the Wizard Item pattern that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.WizardItem.IWizardItem}
	 */
	export function Initialize(wizardItemId: string): OSFramework.OSUI.Patterns.WizardItem.IWizardItem {
		const wizardItem = GetWizardItemById(wizardItemId);

		wizardItem.build();

		return wizardItem;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @export
	 * @param {string} wizardItemId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		wizardItemId: string,
		eventName: string,
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
