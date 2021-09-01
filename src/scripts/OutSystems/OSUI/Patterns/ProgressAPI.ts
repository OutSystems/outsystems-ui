// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.ProgressAPI {
	const _progressItemsMap = new Map<string, OSUIFramework.Patterns.Progress.IProgress>(); //Progress.uniqueId -> Progress obj

	/**
	 * Function that will change the property of a given Progress Id.
	 *
	 * @export
	 * @param {string} progressId ID of the Progress where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(progressId: string, propertyName: string, propertyValue: any): void {
		const _progressItem = GetProgressItemById(progressId);

		_progressItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new ProgressItem instance and add it to the progressItemsMap
	 *
	 * @export
	 * @param {string} progressId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IProgress}
	 */
	export function Create(progressId: string, configs: string): OSUIFramework.Patterns.Progress.IProgress {
		if (_progressItemsMap.has(progressId)) {
			throw new Error(`There is already an ProgressItem registered under id: ${progressId}`);
		}

		const _configs = JSON.parse(configs);
		let _progressItem = null;

		// Check ProgressType before create the instance
		switch (_configs.ProgressType) {
			case Enum.Progress.Circle:
				_progressItem = new OSUIFramework.Patterns.Progress.Circle.Circle(progressId, JSON.parse(configs));

				_progressItemsMap.set(progressId, _progressItem);

				break;

			case Enum.Progress.Bar:
				_progressItem = new OSUIFramework.Patterns.Progress.Bar.Bar(progressId, JSON.parse(configs));

				_progressItemsMap.set(progressId, _progressItem);

				break;
		}

		return _progressItem;
	}

	/**
	 * Function that will dispose the instance of the given ProgressItem Id
	 *
	 * @export
	 * @param {string} progressId
	 */
	export function Dispose(progressId: string): void {
		const _progressItem = GetProgressItemById(progressId);

		_progressItem.dispose();

		_progressItemsMap.delete(_progressItem.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the Progress instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAllProgressItemsMap(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_progressItemsMap);
	}

	/**
	 * Function that gets the instance of Progress, by a given ID.
	 *
	 * @export
	 * @param {string} progressId ID of the Progress that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IProgress;}
	 */
	export function GetProgressItemById(progressId: string): OSUIFramework.Patterns.Progress.IProgress {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'Progress',
			progressId,
			_progressItemsMap
		) as OSUIFramework.Patterns.Progress.IProgress;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} progressId ID of the ProgressItem that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IProgress}
	 */
	export function Initialize(progressId: string): OSUIFramework.Patterns.Progress.IProgress {
		const _progressItem = GetProgressItemById(progressId);

		_progressItem.build();

		return _progressItem;
	}
}
