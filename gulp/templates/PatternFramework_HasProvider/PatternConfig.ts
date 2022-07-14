// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.<%= patternNamePC %> {
	/**
	 * Class that represents the custom configurations received by the <%= patternNamePC %>.
	 *
	 * @export
	 * @class <%= patternNamePC %>Config
	 * @extends {AbstractProviderConfiguration}
	 */
	export abstract class Abstract<%= patternNamePC %>Config extends Patterns.AbstractProviderConfiguration {
		// TODO (by CreateNewPattern): add all properties received as config (JSON from platform)

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Override, Validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof Abstract<%= patternNamePC %>Config
		 */
		 public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.PROP_NAME1:
					// TODO (by CreateNewPattern): Replace with expected property
					// validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.PROP_NAME2:
					// TODO (by CreateNewPattern): Replace with expected property
					// validatedValue = this.validateString(value as string, undefined);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
