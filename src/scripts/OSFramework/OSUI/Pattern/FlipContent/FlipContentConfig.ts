// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.FlipContent {
	/**
	 * Class that represents the custom configurations received by the FlipContent.
	 */
	export class FlipContentConfig extends AbstractConfiguration {
		/** Flips the content when it is clicked; otherwise flipping happens only through the API. */
		public FlipSelf: boolean;
		/** Starts with the back face visible. */
		public IsFlipped: boolean;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns boolean
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.IsFlipped;
			}
			return true;
		}
	}
}
