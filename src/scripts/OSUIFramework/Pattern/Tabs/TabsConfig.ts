// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	export class TabsConfig extends AbstractConfiguration {
		public Height: string;
		public JustifyHeaders: boolean;
		public StartingTab: number;
		public TabsOrientation: GlobalEnum.Orientation;
		public TabsVerticalPosition: GlobalEnum.Direction;

		constructor(config: JSON) {
			super(config);
		}
	}
}
