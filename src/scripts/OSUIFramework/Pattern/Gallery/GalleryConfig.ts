// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Gallery {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export class GalleryConfig extends AbstractConfiguration {
		public GutterSize: string;
		public ItemsInDesktop: number;
		public ItemsInPhone: number;
		public ItemsInTablet: number;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
