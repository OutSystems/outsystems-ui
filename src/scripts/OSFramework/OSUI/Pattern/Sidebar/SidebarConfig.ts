// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Sidebar {
	/**
	 * Class that represents the custom configurations received by the Sidebar.
	 *
	 * @export
	 * @class SidebarConfig
	 * @extends {AbstractConfiguration}
	 */
	export class SidebarConfig extends AbstractConfiguration {
		public Direction: GlobalEnum.Direction;
		public HasOverlay: boolean;
		public StartsOpen: boolean;
		public Width: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
