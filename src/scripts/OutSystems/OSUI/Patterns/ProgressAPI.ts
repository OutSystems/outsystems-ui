// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.ProgressAPI {
	const _progressItemsMap = new Map<string, OSFramework.Patterns.Progress.IProgress>(); //Progress.uniqueId -> Progress obj

	/**
	 * Function that will change the property of a given Progress Id.
	 *
	 * @export
	 * @param {string} progressId ID of the Progress where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(progressId: string, propertyName: string, propertyValue: any): string {
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
	 * @return {*}  {OSFramework.Patterns.Progress.IProgress}
	 */
	export function Create(progressId: string, type: string, configs: string): OSFramework.Patterns.Progress.IProgress {
		if (_progressItemsMap.has(progressId)) {
			throw new Error(`There is already an ProgressItem registered under id: ${progressId}`);
		}

		const _progressItem = OSFramework.Patterns.Progress.Factory.NewProgress(progressId, type, configs);

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
		return OSFramework.Helper.MapOperation.ExportKeys(_progressItemsMap);
	}

	/**
	 * Function that gets the instance of Progress, by a given ID.
	 *
	 * @export
	 * @param {string} progressId ID of the Progress that will be looked for.
	 * @return {*}  {OSFramework.Patterns.Progress.IProgress;}
	 */
	export function GetProgressItemById(progressId: string): OSFramework.Patterns.Progress.IProgress {
		return OSFramework.Helper.MapOperation.FindInMap(
			'Progress',
			progressId,
			_progressItemsMap
		) as OSFramework.Patterns.Progress.IProgress;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} progressId ID of the ProgressItem that will be initialized.
	 * @return {*}  {OSFramework.Patterns.Progress.IProgress}
	 */
	export function Initialize(progressId: string): OSFramework.Patterns.Progress.IProgress {
		const _progressItem = GetProgressItemById(progressId);

		_progressItem.build();

		return _progressItem;
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
}
