/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.Virtual_Select.Tags {
	/**
	 * Class that represents the custom configurations received by the Dropdown Tags mode.
	 *
	 * @export
	 * @class VirtualSelectTagsConfig
	 * @extends {AbstractVirtualSelectConfig}
	 */
	export class VirtualSelectTagsConfig extends AbstractVirtualSelectConfig {
		/**
		 * Method used to get the key values of the given selected values
		 *
		 * @protected
		 * @return {*}  {string[]}
		 * @memberof VirtualSelectTagsConfig
		 */
		protected _getSelectedValues(): string[] {
			const selectedKeyvalues = [];

			// Has selected values
			if (this.SelectedOptions.length > 0) {
				// Get the selected key value
				for (const option of this.SelectedOptions) {
					selectedKeyvalues.push(option.value);
				}
			}

			return selectedKeyvalues;
		}

		/**
		 * Set the configs for the Dropdown Tags mode
		 *
		 * @return {*}  {VirtualSelectOpts}
		 * @memberof VirtualSelectTagsConfig
		 */
		public getProviderConfig(): VirtualSelectOpts {
			const virtualSelectSearchOpts = {
				multiple: true,
				showValueAsTags: true,
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
