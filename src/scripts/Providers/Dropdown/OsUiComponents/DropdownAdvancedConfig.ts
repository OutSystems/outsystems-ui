/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.OsUiComponents {
	/**
	 * Class that represents the custom configurations received by the Dropdown.
	 *
	 * @export
	 * @class OSUIDropdownAdvancedConfig
	 * @extends {DropdownConfig}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownAdvancedConfig extends OSUIFramework.Patterns.Dropdown.AbstractDropdownConfig {
		/**
		 * Set all the DropdownAdvanced properties
		 *
		 * @return {*}  {DropdownAdvancedOpts}
		 * @memberof DropdownAdvancedSearchConfig
		 */
		public getProviderConfig(): DropdownAdvancedOpts {
			const providerOptions = {
				// TODO (by CreateNewPattern): add all the provider props that must mus assigned to create the provider instance
			};

			//Clean undefined properties
			Object.keys(providerOptions).forEach(
				(key) => providerOptions[key] === undefined && delete providerOptions[key]
			);

			return providerOptions as DropdownAdvancedOpts;
		}

		/**
		 * Override, validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof OSUIDropdownAdvancedConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			const validatedValue = undefined;

			console.log('DO THINGS HERE!');
			// switch (key) {
			// 	case Enum.Properties.PROP_NAME1:
			// 		// TODO (by CreateNewPattern): Replace with expected property
			// 		break;
			// 	default:
			// 		validatedValue = super.validateDefault(key, value);
			// 		break;
			// }

			return validatedValue;
		}
	}
}
