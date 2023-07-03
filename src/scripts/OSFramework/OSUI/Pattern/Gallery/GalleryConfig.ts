// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Gallery/GalleryConfig.ts
namespace OSFramework.Patterns.Gallery {
========
namespace OSFramework.OSUI.Patterns.Gallery {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Gallery/GalleryConfig.ts
	/**
	 * Defines the interface for OutSystemsUI Gallery Pattern
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
