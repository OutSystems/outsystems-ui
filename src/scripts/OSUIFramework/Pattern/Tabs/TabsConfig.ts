// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	export class TabsConfig extends AbstractConfiguration {
		public ActiveTab: number;
		public DisableAnimation: boolean;
		public Height: string;
		public IsJustified: boolean;
		public TabsOrientation: GlobalTypes.Orientation;
		public TabsVerticalPosition: GlobalTypes.Direction;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
