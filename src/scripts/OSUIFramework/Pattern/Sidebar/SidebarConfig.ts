// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	export class SidebarConfig extends AbstractConfiguration {
		public Direction: string;
		public HasOverlay: boolean;
		public IsOpen: boolean;
		public Width: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
