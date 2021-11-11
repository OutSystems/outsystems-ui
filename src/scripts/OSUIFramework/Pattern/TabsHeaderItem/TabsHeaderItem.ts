// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsHeaderItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TabsHeaderItem extends AbstractPattern<TabsHeaderItemConfig> implements ITabsHeaderItem {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TabsHeaderItemConfig(configs));
		}

		public build(): void {
			super.build();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
		}
	}
}
