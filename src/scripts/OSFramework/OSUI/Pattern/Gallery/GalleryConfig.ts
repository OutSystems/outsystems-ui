// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Gallery {
	/**
	 * Class that represents the custom configurations received by the Gallery.
	 *
	 * @export
	 * @class GalleryConfig
	 * @extends {AbstractConfiguration}
	 */
	export class GalleryConfig extends AbstractConfiguration {
		// Gap between items as a framework space name (none, xs, s, base, m, l, xl, xxl), mapped to --space-*.
		public ItemsGap: string;
		// Number of items per row on desktop.
		public RowItemsDesktop: number;
		// Number of items per row on phones.
		public RowItemsPhone: number;
		// Number of items per row on tablets.
		public RowItemsTablet: number;

		constructor(config: JSON) {
			super(config);
		}
	}
}
