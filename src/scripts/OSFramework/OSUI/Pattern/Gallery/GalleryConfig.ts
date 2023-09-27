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
		public ItemsGap: string;
		public RowItemsDesktop: number;
		public RowItemsPhone: number;
		public RowItemsTablet: number;

		constructor(config: JSON) {
			super(config);
		}
	}
}
