// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.ProgressAPI {
	const _progressItemsMap = new Map<string, OSFramework.OSUI.Patterns.Progress.IProgress>(); //Progress.uniqueId -> Progress obj

	/**
	 * Function that will change the property of a given Progress Id.
	 *
	 * @export
	 * @param {string} progressId ID of the Progress where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	export function ChangeProperty(progressId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Progress.FailChangeProperty,
			callback: () => {
				const _progressItem = GetProgressItemById(progressId);

				_progressItem.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new ProgressItem instance and add it to the progressItemsMap
	 *
	 * @export
	 * @param {string} progressId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.OSUI.Patterns.Progress.IProgress}
	 */
	export function Create(
		progressId: string,
		type: string,
		configs: string
	): OSFramework.OSUI.Patterns.Progress.IProgress {
		if (_progressItemsMap.has(progressId)) {
			throw new Error(`There is already an ProgressItem registered under id: ${progressId}`);
		}

		const _progressItem = OSFramework.OSUI.Patterns.Progress.Factory.NewProgress(progressId, type, configs);

		_progressItemsMap.set(progressId, _progressItem);

		return _progressItem;
	}

	/**
	 * Function that will dispose the instance of the given ProgressItem Id
	 *
	 * @export
	 * @param {string} progressId
	 */
	export function Dispose(progressId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Progress.FailDispose,
			callback: () => {
				const _progressItem = GetProgressItemById(progressId);

				_progressItem.dispose();

				_progressItemsMap.delete(_progressItem.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Progress instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllProgressItemsMap(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_progressItemsMap);
	}

	/**
	 * Function that gets the instance of Progress, by a given ID.
	 *
	 * @export
	 * @param {string} progressId ID of the Progress that will be looked for.
	 * @return {*}  {OSFramework.OSUI.Patterns.Progress.IProgress;}
	 */
	export function GetProgressItemById(progressId: string): OSFramework.OSUI.Patterns.Progress.IProgress {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Progress',
			progressId,
			_progressItemsMap
		) as OSFramework.OSUI.Patterns.Progress.IProgress;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} progressId ID of the ProgressItem that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.Progress.IProgress}
	 */
	export function Initialize(progressId: string): OSFramework.OSUI.Patterns.Progress.IProgress {
		const _progressItem = GetProgressItemById(progressId);

		_progressItem.build();

		return _progressItem;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} dropdownId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		dropdownId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Progress.FailRegisterCallback,
			callback: () => {
				const _progressItem = this.GetProgressItemById(dropdownId);

				_progressItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function to reset the Progress Bar/Circle
	 *
	 * @export
	 * @param {string} progressId
	 */
	export function ResetProgressValue(progressId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Progress.FailProgressReset,
			callback: () => {
				const _progressItem = GetProgressItemById(progressId);
				_progressItem.resetProgressValue();
			},
		});

		return result;
	}

	/**
	 * Function that sets the value of the progress circle or the progress bar
	 * @export
	 * @param {string} widgetId of the progress circle or progress bar that will have its value set
	 * @param {number} progress value of the circle
	 */
	export function SetProgressValue(progressId: string, progress: number): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Progress.FailProgressValue,
			callback: () => {
				const _progressItem = GetProgressItemById(progressId);

				_progressItem.setProgressValue(progress);
			},
		});

		return result;
	}

	/**
	 * Funciton that sets a Progress Gradient
	 *
	 * @export
	 * @param {string} progressId
	 * @param {string} gradientType
	 * @param {string} colors
	 * @return {*}  {string}
	 */
	export function ProgressApplyGradient(progressId: string, gradientType: string, colors: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Progress.FailtProgressGradient,
			callback: () => {
				const _progressItem = GetProgressItemById(progressId);
				_progressItem.progressApplyGradient(gradientType, JSON.parse(colors));
			},
		});

		return result;
	}
}
