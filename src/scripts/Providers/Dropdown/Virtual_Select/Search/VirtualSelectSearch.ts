// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.Virtual_Select.Search {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIVirtualSelectSearch extends AbstractVirtualSelect<VirtualSelectSearchConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VirtualSelectSearchConfig(configs));
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof VirtualSelect.Search
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this._virtualselectOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			super.createProviderInstance();
		}
	}
}
