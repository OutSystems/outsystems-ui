/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.Dropdown.VirtualSelect.Tags {
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
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Tags.VirtualSelectTagsConfig
		 */
		protected getSelectedValues(): string[] {
			const selectedKeyvalues = [];

			// Has selected values
			if (this.StartingSelection.length > 0) {
				// Get the selected key value
				for (const option of this.StartingSelection) {
					if (option.value !== OSFramework.OSUI.Constants.EmptyString) {
						selectedKeyvalues.push(option.value);
					}
				}
			}

			return selectedKeyvalues;
		}

		/**
		 * Set the configs for the Dropdown Tags mode
		 *
		 * @return {*}  {VirtualSelectOpts}
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Tags.VirtualSelectTagsConfig
		 */
		public getProviderConfig(): VirtualSelectOpts {
			const virtualSelectTagsOpts = {
				multiple: true,
				showValueAsTags: true,
			};

			return this.mergeConfigs(super.getProviderConfig(), virtualSelectTagsOpts, this.providerExtendedOptions);
		}
	}
}
