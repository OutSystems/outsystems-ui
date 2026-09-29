// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.ButtonLoading {
	/**
	 * Class that represents the custom configurations received by the ButtonLoading.
	 *
	 * @export
	 * @class ButtonLoadingConfig
	 * @extends {AbstractConfiguration}
	 */
	export class ButtonLoadingConfig extends AbstractConfiguration {
		// Shows the loading spinner and blocks interaction while true.
		public IsLoading: boolean;
		// Keeps the button label visible next to the spinner; otherwise only the spinner shows while loading.
		public ShowLoadingAndLabel: boolean;

		constructor(config: JSON) {
			super(config);
		}
	}
}
