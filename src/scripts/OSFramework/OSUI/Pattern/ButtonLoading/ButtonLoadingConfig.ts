// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/ButtonLoading/ButtonLoadingConfig.ts
namespace OSFramework.Patterns.ButtonLoading {
========
namespace OSFramework.OSUI.Patterns.ButtonLoading {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/ButtonLoading/ButtonLoadingConfig.ts
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
