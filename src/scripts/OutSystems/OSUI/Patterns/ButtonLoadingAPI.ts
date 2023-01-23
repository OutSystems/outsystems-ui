// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.ButtonLoadingAPI {
	const _buttonsLoadingMap = new Map<string, OSFramework.Patterns.ButtonLoading.IButtonLoading>(); //buttonLoading.uniqueId -> ButtonLoading obj

	/**
	 * Function that will change the property of a given ButtonLoading.
	 *
	 * @export
	 * @param {string} ButtonLoadingId ID of the ButtonLoading where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {unknown} propertyValue Value that will be set to the property
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
	 * @export
	 * @param {string} ButtonLoadingId ID of the ButtonLoading where the instance will be created.
	 * @param {string} configs configurations for the ButtonLoading in JSON format.
	 * @return {*}  {OSFramework.Patterns.IButtonLoading}
	 */
	export function Create(
		buttonLoadingId: string,
		configs: string
	): OSFramework.Patterns.ButtonLoading.IButtonLoading {
		if (_buttonsLoadingMap.has(buttonLoadingId)) {
			throw new Error(
				`There is already a ${OSFramework.GlobalEnum.PatternName.ButtonLoading} registered under id: ${buttonLoadingId}`
			);
		}

		const _newButtonLoading = new OSFramework.Patterns.ButtonLoading.ButtonLoading(
			buttonLoadingId,
			JSON.parse(configs)
		);

		_buttonsLoadingMap.set(buttonLoadingId, _newButtonLoading);

		return _newButtonLoading;
	}

	/**
	 * Function that will destroy the instance of the given ButtonLoading
	 *
	 * @export
	 * @param {string} ButtonLoadingId
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
	 * @export
	 * @return {*}  {Map<string, OSFramework.Patterns.ButtonLoading.IButtonLoading>}
	 */
	export function GetAllButtonsLoading(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_buttonsLoadingMap);
	}

	/**
	 * Function that gets the instance of ButtonLoading, by a given ID.
	 *
	 * @export
	 * @param {string} ButtonLoadingId ID of the ButtonLoading that will be looked for.
	 * @return {*}  {OSFramework.Patterns.ButtonLoading.IButtonLoading}
	 */
	export function GetButtonLoadingById(buttonLoadingId: string): OSFramework.Patterns.ButtonLoading.IButtonLoading {
		return OSFramework.Helper.MapOperation.FindInMap(
			OSFramework.GlobalEnum.PatternName.ButtonLoading,
			buttonLoadingId,
			_buttonsLoadingMap
		) as OSFramework.Patterns.ButtonLoading.IButtonLoading;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} ButtonLoadingId ID of the ButtonLoading that will be initialized.
	 * @return {*}  {OSFramework.Patterns.ButtonLoading.IButtonLoading}
	 */
	export function Initialize(buttonLoadingId: string): OSFramework.Patterns.ButtonLoading.IButtonLoading {
		const buttonLoading = GetButtonLoadingById(buttonLoadingId);

		buttonLoading.build();

		return buttonLoading;
	}
}
