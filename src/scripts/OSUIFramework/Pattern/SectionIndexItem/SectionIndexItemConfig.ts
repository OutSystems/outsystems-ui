// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndexItem {
	/**
	 * Class that represents the custom configurations received by the SectionIndexItem.
	 *
	 * @export
	 * @class SectionIndexItemConfig
	 * @extends {AbstractConfiguration}
	 */
	export class SectionIndexItemConfig extends AbstractConfiguration {
		public ScrollToWidgetId: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
