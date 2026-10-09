// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SectionIndex {
	/**
	 * Class that represents the custom configurations received by the SectionIndex.
	 */
	export class SectionIndexConfig extends AbstractConfiguration {
		/** Keeps the index fixed while the page scrolls. */
		public IsFixed: boolean;
		/** Animates the scroll to the target section. */
		public SmoothScrolling: boolean;

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns value
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.IsFixed:
				case Enum.Properties.SmoothScrolling:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
