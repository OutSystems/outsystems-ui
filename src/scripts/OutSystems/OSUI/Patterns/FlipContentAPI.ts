// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.FlipContentAPI {
	const _flipContentMap = new Map<string, OSFramework.OSUI.Patterns.FlipContent.IFlipContent>(); //flipContent.uniqueId -> FlipContent obj

	/**
	 * Function that will change the property of a flip content pattern.
	 *
	 * @param flipId ID of the Flip Content where the property will be changed.
	 * @param propertyName Property name that will be updated
	 * @param propertyValue Value that will be set to the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param flipId ID of the Flip Content where the instance will be created.
	 * @param configs configurations for the Flip Content in JSON format.
	 * @returns the FlipContent instance
	 */
	export function Create(
		flipId: string,
		configs: string | Configs
	): OSFramework.OSUI.Patterns.FlipContent.IFlipContent {
		if (_flipContentMap.has(flipId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.FlipContent} registered under id: ${flipId}`
			);
		}

		const _newFlip = new OSFramework.OSUI.Patterns.FlipContent.FlipContent(
			flipId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);

		_flipContentMap.set(flipId, _newFlip);

		return _newFlip;
	}

	/**
	 * Function that will destroy the instance of the given Flip Content
	 *
	 * @param flipId The id of the FlipContent element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @returns the ids of every FlipContent instance
	 */
	export function GetAllFlipContent(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_flipContentMap);
	}

	/**
	 * Function that gets the instance of flip content, by a given ID.
	 *
	 * @param flipId ID of the Flip Content that will be looked for.
	 * @returns the FlipContent instance
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
	 * @param flipId ID of the Flip Content that will be initialized.
	 * @returns the FlipContent instance
	 */
	export function Initialize(flipId: string): OSFramework.OSUI.Patterns.FlipContent.IFlipContent {
		const flipContent = GetFlipContentById(flipId);

		flipContent.build();

		return flipContent;
	}

	/**
	 * * Function that will register a pattern callback.
	 *
	 * @param flipId The id of the FlipContent element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function RegisterCallback(
		flipId: string,
		eventName: EventName,
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
	 * @param flipId The id of the FlipContent element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param flipId The id of the FlipContent element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
	 * @param flipId The id of the FlipContent element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
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
