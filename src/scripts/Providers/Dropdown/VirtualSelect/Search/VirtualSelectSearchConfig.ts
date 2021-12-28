/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.VirtualSelect.Search {
	/**
	 * Class that represents the custom configurations received by the Dropdown Search mode.
	 *
	 * @export
	 * @class VirtualSelectSearchConfig
	 * @extends {AbstractVirtualSelectConfig}
	 */
	export class VirtualSelectSearchConfig extends AbstractVirtualSelectConfig {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		public getProviderConfig(): VirtualSelectOpts {
			// eslint-disable-next-line prefer-const
			let virtualSelectSearchOpts = {
				showValueAsTags: false,
				search: true,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			// eslint-disable-next-line prefer-const
			let vsOptions = {
				...super.getCommonProviderConfigs(),
				...virtualSelectSearchOpts,
			};

			//Cleaning undefined properties
			Object.keys(vsOptions).forEach((key) => vsOptions[key] === undefined && delete vsOptions[key]);

			return vsOptions;
		}
	}
}
