// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.ButtonLoading {
	/**
	 * Class that represents the custom configurations received by the ButtonLoading.
	 *
	 * @export
	 * @class ButtonLoadingConfig
	 * @extends {AbstractConfiguration}
	 */
	export class ButtonLoadingConfig extends AbstractConfiguration {
		public IsLoading: boolean;
		public ShowLoadingAndLabel: boolean;

		constructor(config: JSON) {
			super(config);
		}
	}
}
