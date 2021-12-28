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

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param propertyName the name of the property that will be changed
		 * @param propertyValue the new value that should be assigned to the given property name
		 * @memberof VirtualSelect.Search
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			console.log('changeProperty()', propertyName, propertyValue);
		}
	}
}
