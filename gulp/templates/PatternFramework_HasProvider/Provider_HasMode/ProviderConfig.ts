/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.<%= patternNamePC %>.<%= providerNamePC %> {
	/**
	 * Class that represents the custom configurations received by the <%= patternNamePC %>.
	 *
	 * @export
	 * @class Abstract<%= providerNamePC %>Config
	 * @extends {Abstract<%= patternNamePC %>Config}
	 */
	export abstract class Abstract<%= providerNamePC %>Config extends OSFramework.Patterns.<%= patternNamePC %>.Abstract<%= patternNamePC %>Config {

		// Method used to set all the common <%= providerNamePC %> properties across the different instances mode types
		public getProviderConfig(): <%= providerNamePC %>Opts {
			const providerOptions = {
				// TODO (by CreateNewPattern): add all the provider props that must mus assigned to create the provider instance
			};

			return providerOptions as <%= providerNamePC %>Opts;
		}
	}
}
