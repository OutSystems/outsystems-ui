// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.SectionIndex {
	/**
	 * Class that represents the custom configurations received by the SectionIndex.
	 *
	 * @export
	 * @class SectionIndexConfig
	 * @extends {AbstractConfiguration}
	 */
	export class SectionIndexConfig extends AbstractConfiguration {
		public IsFixed: boolean;
		public SmoothScrolling: boolean;

		/**
		 * Override, Validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @memberof AbstractSectionIndexConfig
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
