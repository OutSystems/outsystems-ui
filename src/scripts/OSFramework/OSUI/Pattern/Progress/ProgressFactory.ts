// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress.Factory {
	/**
	 * Create the new Progress instance object according given type
	 *
	 * @param progressId ID of the Pattern that a new instance will be created.
	 * @param type
	 * @param configs Configurations for the Pattern in JSON format.
	 */
	export function NewProgress(
		progressId: string,
		type: string,
		configs: string | Record<string, unknown>
	): Patterns.Progress.IProgress {
		let _progressItem = null;

		switch (type) {
			case ProgressEnum.ProgressTypes.Circle:
				_progressItem = new Patterns.Progress.Circle.Circle(
					progressId,
					OSFramework.OSUI.Helper.ParseConfigs(configs)
				);

				break;

			case ProgressEnum.ProgressTypes.Bar:
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				_progressItem = new Patterns.Progress.Bar.Bar(
					progressId,
					OSFramework.OSUI.Helper.ParseConfigs(configs)
				);

				break;

			default:
				throw new Error(`There is any Progress of ${type} type`);
		}

		return _progressItem;
	}
}
