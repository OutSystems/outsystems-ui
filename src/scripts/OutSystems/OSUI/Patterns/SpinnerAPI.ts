// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.SpinnerAPI {
	const _spinnersMap = new Map<string, OSFramework.OSUI.Patterns.Spinner.ISpinner>(); //spinner.uniqueId -> Spinner obj

	/**
	 * Function that will change the property of a given Spinner.
	 *
	 * @export
	 * @param {string} spinnerId ID of the Spinner where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {unknown} propertyValue Value that will be set to the property
	 * @return {*}  {string} Serialized API response
	 */
	export function ChangeProperty(spinnerId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Spinner.FailChangeProperty,
			callback: () => {
				const spinner = GetSpinnerById(spinnerId);

				spinner.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new Spinner instance and add it to the spinnersMap
	 *
	 * @export
	 * @param {string} spinnerId ID of the Spinner where the instance will be created.
	 * @param {string} configs configurations for the Spinner in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Spinner.ISpinner}
	 */
	export function Create(spinnerId: string, configs: string): OSFramework.OSUI.Patterns.Spinner.ISpinner {
		if (_spinnersMap.has(spinnerId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Spinner} registered under id: ${spinnerId}`
			);
		}

		const _newSpinner = new OSFramework.OSUI.Patterns.Spinner.Spinner(spinnerId, JSON.parse(configs));

		_spinnersMap.set(spinnerId, _newSpinner);

		return _newSpinner;
	}

	/**
	 * Function that will destroy the instance of the given Spinner
	 *
	 * @export
	 * @param {string} spinnerId ID of the Spinner that will be destroyed.
	 * @return {*}  {string} Serialized API response
	 */
	export function Dispose(spinnerId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Spinner.FailDispose,
			callback: () => {
				const spinner = GetSpinnerById(spinnerId);

				spinner.dispose();

				_spinnersMap.delete(spinner.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the ids of all the Spinner instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllSpinners(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_spinnersMap);
	}

	/**
	 * Function that gets the instance of Spinner, by a given ID.
	 *
	 * @export
	 * @param {string} spinnerId ID of the Spinner that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.Spinner.ISpinner}
	 */
	export function GetSpinnerById(spinnerId: string): OSFramework.OSUI.Patterns.Spinner.ISpinner {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.Spinner,
			spinnerId,
			_spinnersMap
		) as OSFramework.OSUI.Patterns.Spinner.ISpinner;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} spinnerId ID of the Spinner that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.Spinner.ISpinner}
	 */
	export function Initialize(spinnerId: string): OSFramework.OSUI.Patterns.Spinner.ISpinner {
		const spinner = GetSpinnerById(spinnerId);

		spinner.build();

		return spinner;
	}

	/**
	 * Function to register a callback (only 'Initialized' is supported)
	 *
	 * @export
	 * @param {string} spinnerId ID of the Spinner.
	 * @param {string} eventName Name of the event.
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback Platform callback.
	 * @return {*}  {string} Serialized API response
	 */
	export function RegisterCallback(
		spinnerId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Spinner.FailRegisterCallback,
			callback: () => {
				const spinner = GetSpinnerById(spinnerId);

				spinner.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
