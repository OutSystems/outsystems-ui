/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.<%= patternNamePC %>.<%= providerNamePC %> {
	/**
	 * Class that represents the custom configurations received by the <%= patternNamePC %>.
	 *
	 * @export
	 * @class OSUI<%= providerNamePC %>Config
	 * @extends {<%= patternNamePC %>Config}
	 */
	export class OSUI<%= providerNamePC %>Config extends OSFramework.Patterns.<%= patternNamePC %>.Abstract<%= patternNamePC %>Config {

		/**
		 * Set all the <%= providerNamePC %> properties
		 *
		 * @return {*}  {<%= providerNamePC %>Opts}
		 * @memberof <%= providerNamePC %>SearchConfig
		 */
		public getProviderConfig(): <%= providerNamePC %>Opts {
			const providerOptions = {
				// TODO (by CreateNewPattern): add all the provider props that must mus assigned to create the provider instance
			};

			//Clean undefined properties
			Object.keys(providerOptions).forEach((key) => providerOptions[key] === undefined && delete providerOptions[key]);

			return providerOptions as <%= providerNamePC %>Opts;
		}

		/**
		 * Override, validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof OSUI<%= providerNamePC %>Config
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.PROP_NAME1:
					// TODO (by CreateNewPattern): Replace with expected property
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
