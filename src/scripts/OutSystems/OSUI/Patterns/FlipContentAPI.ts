// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.FlipContentAPI {
	const _flipContentMap = new Map<string, OSFramework.Patterns.FlipContent.IFlipContent>(); //flipContent.uniqueId -> FlipContent obj

	/**
	 * Function that will change the property of a flip content pattern.
	 *
	 * @export
	 * @param {string} flipID ID of the Flip Content where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(flipId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const flipContent = GetFlipContentById(flipId);

			flipContent.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FlipContent.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new flip content instance and add it to flipMap
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content where the instance will be created.
	 * @param {string} configs configurations for the Flip Content in JSON format.
	 * @return {*}  {OSFramework.Patterns.FlipContent.IFlipContent}
	 */
	export function Create(flipId: string, configs: string): OSFramework.Patterns.FlipContent.IFlipContent {
		if (_flipContentMap.has(flipId)) {
			throw new Error(
				`There is already a ${OSFramework.GlobalEnum.PatternName.FlipContent} registered under id: ${flipId}`
			);
		}

		const _newFlip = new OSFramework.Patterns.FlipContent.FlipContent(flipId, JSON.parse(configs));

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
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const flipContent = GetFlipContentById(flipId);

			flipContent.dispose();

			_flipContentMap.delete(flipContent.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FlipContent.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will return the Map with all the Flip Content instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.Patterns.FlipContent.IFlipContent>}
	 */
	export function GetAllFlipContent(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_flipContentMap);
	}

	/**
	 * Function that gets the instance of flip content, by a given ID.
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content that will be looked for.
	 * @return {*}  {OSFramework.Patterns.FlipContent.IFlipContent}
	 */
	export function GetFlipContentById(flipId: string): OSFramework.Patterns.FlipContent.IFlipContent {
		return OSFramework.Helper.MapOperation.FindInMap(
			'FlipContent',
			flipId,
			_flipContentMap
		) as OSFramework.Patterns.FlipContent.IFlipContent;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} flipId ID of the Flip Content that will be initialized.
	 * @return {*}  {OSFramework.Patterns.FlipContent.IFlipContent}
	 */
	export function Initialize(flipId: string): OSFramework.Patterns.FlipContent.IFlipContent {
		const flipContent = GetFlipContentById(flipId);

		flipContent.build();

		return flipContent;
	}

	/**
	 * Function that will register a pattern callback.
	 *
	 * @export
	 * @param {string} flipId
	 * @param {OSFramework.CallbacksOLD.OSFlipContentFlipEvent} callback
	 */
	export function RegisterCallback(
		flipId: string,
		callback: OSFramework.CallbacksOLD.OSFlipContentFlipEvent
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const flipContent = GetFlipContentById(flipId);

			flipContent.registerCallback(callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FlipContent.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}
	/**
	 * Function that will show the back part of the content.
	 *
	 * @export
	 * @param {string} flipId
	 */
	export function ShowBackContent(flipId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const flipContent = GetFlipContentById(flipId);

			flipContent.showBackContent();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FlipContent.FailShowBack;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will show the front part of the content.
	 *
	 * @export
	 * @param {string} flipId
	 */
	export function ShowFrontContent(flipId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const flipContent = GetFlipContentById(flipId);

			flipContent.showFrontContent();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FlipContent.FailShowFront;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Function that will flip the content.
	 *
	 * @export
	 * @param {string} flipId
	 */
	export function ToggleFlipContent(flipId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const flipContent = GetFlipContentById(flipId);

			flipContent.toggleFlipContent();
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FlipContent.FailToggle;
		}

		return JSON.stringify(responseObj);
	}
}
