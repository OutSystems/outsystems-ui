// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new TooltipConfig(configs));
		}

		public build(): void {
			this._widgetId = Helper.GetElementByUniqueId(this.uniqueId).closest(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				OutSystems.osuiAPI.Constants.dataBlockTag
			).id;

			this.finishBuild();
		}
	}
}
