// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Tooltip extends AbstractPattern {
		/** Tag used to find Tooltip */
		private _tooltipTag = '[data-block="Content.Tooltip"]';

		constructor(uniqueId: string, configs: any) {
			super(uniqueId);
		}

		public build(): void {
			this._widgetId = Helper.GetElementByUniqueId(this.uniqueId).closest(this._tooltipTag).id;

			this.finishBuild();
		}
	}
}
// Continue on the configs attribute!
