// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs {
	/**
	 * Class that represents the custom configurations received by Tabs.
	 *
	 * @export
	 * @class TabsConfig
	 * @extends {AbstractConfiguration}
	 */
	export class TabsConfig extends AbstractConfiguration {
		public ContentAutoHeight: boolean;
		public Height: string;
		public JustifyHeaders: boolean;
		public StartingTab: number;
		public TabsOrientation: GlobalEnum.Orientation;
		public TabsVerticalPosition: GlobalEnum.Direction;
	}
}
