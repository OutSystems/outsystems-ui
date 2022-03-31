/// <reference path="../Abstract<%= providerNamePC %>Config.ts" />

/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.<%= patternNamePC %>.<%= providerNamePC %>.<%= modeNamePC %> {
	/**
	 * Class that represents the custom configurations received by the <%= patternNamePC %> <%= modeNamePC %> mode.
	 *
	 * @export
	 * @class <%= providerNamePC %><%= modeNamePC %>Config
	 * @extends {Abstract<%= providerNamePC %>Config}
	 */
	export class <%= providerNamePC %><%= modeNamePC %>Config extends Abstract<%= providerNamePC %>Config {
		
		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Set the configs for the <%= providerNamePC %> Range
		 *
		 * @return {*}  {<%= providerNamePC %>Options}
		 * @memberof Abstract<%= providerNamePC %>Config
		 */
		public getProviderConfig(): <%= providerNamePC %>Options {
			const flatpickr<%= modeNamePC %>Opts = {
				// TODO (by CreateNewPattern): add all the provider props that must mus assigned to create the provider instance
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			// eslint-disable-next-line prefer-const
			let providerOptions = {
				...super.getProviderConfig(),
				...flatpickr<%= modeNamePC %>Opts,
			};

			// Cleanning undefined properties
			Object.keys(providerOptions).forEach((key) => providerOptions[key] === undefined && delete providerOptions[key]);

			return providerOptions;
		}

		/**
		 * Override, validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof Abstract<%= providerNamePC %>Config
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
