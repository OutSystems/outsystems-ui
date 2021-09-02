// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Progress.Factory {
	
    /**
	 * Create the new Progress instance object according given type
	 *
	 * @export
	 * @param {string} progressId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.IProgress}
	 */
    export function NewProgress(
		progressId: string,
		type: string,
		configs: string
	):OSUIFramework.Patterns.Progress.IProgress {
        let _progressItem = null;

		// Check ProgressType before create the instance
		switch (type) {
			case ProgressEnum.ProgressTypes.Circle:
				_progressItem = new OSUIFramework.Patterns.Progress.Circle.Circle(progressId, JSON.parse(configs));

				break;

			case ProgressEnum.ProgressTypes.Bar:
				_progressItem = new OSUIFramework.Patterns.Progress.Bar.Bar(progressId, JSON.parse(configs));

				break;

            default:
                throw new Error(`There is any Progress of ${type} type`);
                break;
		}

		return _progressItem;
    }