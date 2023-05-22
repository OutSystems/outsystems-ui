// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	/**
	 * Class that represents the custom configurations received by the OverflowMenu.
	 *
	 * @export
	 * @class OverflowMenuConfig
	 * @extends {AbstractConfiguration}
	 */
	export class OverflowMenuConfig extends AbstractConfiguration {
		public BalloonWidgetId: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
