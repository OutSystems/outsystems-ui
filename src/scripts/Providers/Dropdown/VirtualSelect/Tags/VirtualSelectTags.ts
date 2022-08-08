// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.VirtualSelect.Tags {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIVirtualSelectTags extends AbstractVirtualSelect<VirtualSelectTagsConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VirtualSelectTagsConfig(configs));
		}

		/**
		 * Get the selected values options that will be used to pass into platform as a JSON string
		 *
		 * @protected
		 * @return {*}  {string}
		 * @memberof OSUIVirtualSelectTags
		 */
		protected getSelectedOptionsStructure(): string {
			// Store the options selected
			const optionsSelected = this._virtualselectMethods.getSelectedOptions();

			return optionsSelected.length > 0 ? JSON.stringify(optionsSelected) : '';
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof OSUIVirtualSelectTags
		 */
		protected prepareConfigs(triggerEvent = false): void {
			// Get the library configurations
			this._virtualselectOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance(triggerEvent);
		}
	}
}
