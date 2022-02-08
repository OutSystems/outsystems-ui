// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Gallery {
	/**
	 * Defines the interface for OutSystemsUI Gallery Pattern
	 *
	 * @export
	 * @class GalleryConfig
	 * @extends {AbstractConfiguration}
	 */
	export class GalleryConfig extends AbstractConfiguration {
		public GutterSize: string;
		public ItemsInDesktop: number;
		public ItemsInPhone: number;
		public ItemsInTablet: number;

		constructor(config: JSON) {
			super(config);
		}
	}
}
