// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tabs {
	export class TabsConfig extends AbstractConfiguration {
		public ActiveItem: number;
		public Height: string;
		public IsJustified: boolean;
		public Orientation: GlobalTypes.Orientation;
		public Position: GlobalTypes.Direction;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
