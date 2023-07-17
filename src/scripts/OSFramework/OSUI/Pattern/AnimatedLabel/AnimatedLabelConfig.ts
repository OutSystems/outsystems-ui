// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.AnimatedLabel {
	/**
	 * Class that represents the custom configurations received by the AnimatedLabel.
	 *
	 * @export
	 * @class AnimatedLabelConfig
	 * @extends {AbstractConfiguration}
	 */
	export class AnimatedLabelConfig extends AbstractConfiguration {
		public isActive: boolean;

		constructor(config: JSON) {
			// code here
			super(config);
		}
	}
}
