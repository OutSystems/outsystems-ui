// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.ButtonLoadingAPI {
	const _buttonsLoadingMap = new Map<string, OSFramework.OSUI.Patterns.ButtonLoading.IButtonLoading>(); //buttonLoading.uniqueId -> ButtonLoading obj

	/**
	 * Function that will change the property of a given ButtonLoading.
	 *
	 * @param buttonLoadingId ID of the ButtonLoading where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(buttonLoadingId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.ButtonLoading.FailChangeProperty,
			callback: () => {
				const buttonLoading = GetButtonLoadingById(buttonLoadingId);

				buttonLoading.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new ButtonLoading instance and add it to the buttonsLoadingMap
	 *
	 * @param buttonLoadingId ID of the ButtonLoading where the instance will be created.
	 * @param configs configurations for the ButtonLoading in JSON format.
	 * @returns the ButtonLoading instance
	 */
	export function Create(
		buttonLoadingId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.ButtonLoading.IButtonLoading {
		if (_buttonsLoadingMap.has(buttonLoadingId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.ButtonLoading} registered under id: ${buttonLoadingId}`
			);
		}

		const _newButtonLoading = new OSFramework.OSUI.Patterns.ButtonLoading.ButtonLoading(
			buttonLoadingId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_buttonsLoadingMap.set(buttonLoadingId, _newButtonLoading);

		return _newButtonLoading;
	}

	/**
	 * Function that will destroy the instance of the given ButtonLoading
	 *
	 * @param buttonLoadingId ID of the ButtonLoading that will be destroyed.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(buttonLoadingId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.ButtonLoading.FailDispose,
			callback: () => {
				const buttonLoading = GetButtonLoadingById(buttonLoadingId);

				buttonLoading.dispose();

				_buttonsLoadingMap.delete(buttonLoading.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the ButtonLoading instances at the page
	 *
	 * @returns the ids of every ButtonLoading instance
	 */
	export function GetAllButtonsLoading(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_buttonsLoadingMap);
	}

	/**
	 * Function that gets the instance of ButtonLoading, by a given ID.
	 *
	 * @param buttonLoadingId ID of the ButtonLoading that will be looked for.
	 * @returns the ButtonLoading instance
	 */
	export function GetButtonLoadingById(
		buttonLoadingId: string
	): OSFramework.OSUI.Patterns.ButtonLoading.IButtonLoading {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.ButtonLoading,
			buttonLoadingId,
			_buttonsLoadingMap
		) as OSFramework.OSUI.Patterns.ButtonLoading.IButtonLoading;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param buttonLoadingId ID of the ButtonLoading that will be initialized.
	 * @returns the ButtonLoading instance
	 */
	export function Initialize(buttonLoadingId: string): OSFramework.OSUI.Patterns.ButtonLoading.IButtonLoading {
		const buttonLoading = GetButtonLoadingById(buttonLoadingId);

		buttonLoading.build();

		return buttonLoading;
	}

	/**
	 * Sets whether the disabled attribute on the button element should be managed when IsLoading is true.
	 *
	 * @param buttonLoadingId ID of the ButtonLoading instance.
	 * @param isDisabled When true, the button is disabled while loading.
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ForceIsLoadingDisabledState(buttonLoadingId: string, isDisabled: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.ButtonLoading.FailForceDisabledStateOnIsLoading,
			callback: () => {
				const buttonLoading = GetButtonLoadingById(buttonLoadingId);

				buttonLoading.disabledStateOnIsLoading(isDisabled);
			},
		});

		return result;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param dropdownId The id of the Dropdown element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		dropdownId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.ButtonLoading.FailRegisterCallback,
			callback: () => {
				const buttonLoading = this.GetButtonLoadingById(dropdownId);

				buttonLoading.registerCallback(eventName, callback);
			},
		});

		return result;
	}
}
