/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.Virtual_Select.Search {
	/**
	 * Class that represents the custom configurations received by the Dropdown Search mode.
	 *
	 * @export
	 * @class VirtualSelectSearchConfig
	 * @extends {AbstractVirtualSelectConfig}
	 */
	export class VirtualSelectSearchConfig extends AbstractVirtualSelectConfig {
		public getProviderConfig(): VirtualSelectOpts {
			const virtualSelectSearchOpts = {
				showValueAsTags: false,
				search: true,
			};

			// Merge both option objects => if objects have a property with the same name, then the right-most object property overwrites the previous one
			// eslint-disable-next-line prefer-const
			let vsOptions = {
				...super.getProviderConfig(),
				...virtualSelectSearchOpts,
			};

			//Cleaning undefined properties
			Object.keys(vsOptions).forEach((key) => vsOptions[key] === undefined && delete vsOptions[key]);

			return vsOptions;
		}
	}
}
