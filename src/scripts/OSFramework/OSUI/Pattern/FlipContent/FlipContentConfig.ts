// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.FlipContent {
	/**
	 * Class that represents the custom configurations received by the FlipContent.
	 *
	 * @export
	 * @class FlipContentConfig
	 * @extends {AbstractConfiguration}
	 */
	export class FlipContentConfig extends AbstractConfiguration {
		public FlipSelf: boolean;
		public IsFlipped: boolean;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns {boolean} boolean
		 * @memberof  OSFramework.Patterns.FlipContent.FlipContentConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.IsFlipped;
			}
			return true;
		}
	}
}
