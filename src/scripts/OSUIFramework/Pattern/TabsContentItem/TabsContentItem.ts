// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.TabsContentItem {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class TabsContentItem extends AbstractPattern<TabsContentItemConfig> implements ITabsContentItem {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TabsContentItemConfig(configs));
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
