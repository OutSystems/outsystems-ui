// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.FlipContent {
	/**
	 * Class that represents the custom configurations received by the FlipContent.
	 *
	 * @export
	 * @class FlipContentConfig
	 * @extends {AbstractConfiguration}
	 */
	export class FlipContentConfig extends AbstractConfiguration {
		public FlipSelf: boolean;
		public IsFlipped: boolean;

		constructor(config: JSON) {
			super(config);
		}
	}
}
