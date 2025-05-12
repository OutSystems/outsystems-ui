// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.FlipContentAPI {
	const _flipContentMap = new Map<string, OSFramework.OSUI.Patterns.FlipContent.IFlipContent>(); //flipContent.uniqueId -> FlipContent obj

	/**
	 * Function that will change the property of a flip content pattern.
	 *
	 * @export
	 * @param {string} flipID ID of the Flip Content where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(flipId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.FlipContent.FailChangeProperty,
			callback: () => {
				const flipContent = GetFlipContentById(flipId);

				flipContent.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new flip content instance and add it to flipMap
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content where the instance will be created.
	 * @param {string} configs configurations for the Flip Content in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.FlipContent.IFlipContent}
	 */
	export function Create(flipId: string, configs: string): OSFramework.OSUI.Patterns.FlipContent.IFlipContent {
		if (_flipContentMap.has(flipId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.FlipContent} registered under id: ${flipId}`
			);
		}

		const _newFlip = new OSFramework.OSUI.Patterns.FlipContent.FlipContent(flipId, JSON.parse(configs));

		_flipContentMap.set(flipId, _newFlip);

		return _newFlip;
	}

	/**
	 * Function that will destroy the instance of the given Flip Content
	 *
	 * @export
	 * @param {string} flipId
	 */
	export function Dispose(flipId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.FlipContent.FailDispose,
			callback: () => {
				const flipContent = GetFlipContentById(flipId);

				flipContent.dispose();

				_flipContentMap.delete(flipContent.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Flip Content instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.OSUI.Patterns.FlipContent.IFlipContent>}
	 */
	export function GetAllFlipContent(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_flipContentMap);
	}

	/**
	 * Function that gets the instance of flip content, by a given ID.
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.FlipContent.IFlipContent}
	 */
	export function GetFlipContentById(flipId: string): OSFramework.OSUI.Patterns.FlipContent.IFlipContent {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'FlipContent',
			flipId,
			_flipContentMap
		) as OSFramework.OSUI.Patterns.FlipContent.IFlipContent;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.FlipContent.IFlipContent}
	 */
	export function Initialize(flipId: string): OSFramework.OSUI.Patterns.FlipContent.IFlipContent {
		const flipContent = GetFlipContentById(flipId);

		flipContent.build();

		return flipContent;
	}

	/**
	 * * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} flipId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		flipId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.FlipContent.FailRegisterCallback,
			callback: () => {
				const flipContent = GetFlipContentById(flipId);

				flipContent.registerCallback(eventName, callback);
			},
		});

		return result;
	}
	/**
	 * Function that will show the back part of the content.
	 *
	 * @export
	 * @param {string} flipId
	 */
	export function ShowBackContent(flipId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.FlipContent.FailShowBack,
			callback: () => {
				const flipContent = GetFlipContentById(flipId);

				flipContent.showBackContent();
			},
		});

		return result;
	}

	/**
	 * Function that will show the front part of the content.
	 *
	 * @export
	 * @param {string} flipId
	 */
	export function ShowFrontContent(flipId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.FlipContent.FailShowFront,
			callback: () => {
				const flipContent = GetFlipContentById(flipId);

				flipContent.showFrontContent();
			},
		});

		return result;
	}

	/**
	 * Function that will flip the content.
	 *
	 * @export
	 * @param {string} flipId
	 */
	export function ToggleFlipContent(flipId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.FlipContent.FailToggle,
			callback: () => {
				const flipContent = GetFlipContentById(flipId);

				flipContent.toggleFlipContent();
			},
		});

		return result;
	}
}
