// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Dropdown.VirtualSelect.Search {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIVirtualSelectSearch extends AbstractVirtualSelect<VirtualSelectSearchConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VirtualSelectSearchConfig(configs));
		}

		/**
		 * Get the selected values options that will be used to pass into platform as a JSON string
		 *
		 * @protected
		 * @return {*}  {DropDownOption[]}
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Search.OSUIVirtualSelectSearch
		 */
		protected getSelectedOptionsStructure(): DropDownOption[] {
			// Store the options selected
			let optionsSelected = [];

			// Check if it's multiple type
			if (this.configs.AllowMultipleSelection) {
				optionsSelected = this.virtualselectConfigs.getSelectedOptions(); // It returns an array of selected options
			} else {
				// It's single option type
				// Check if there are any selected option
				if (this.virtualselectConfigs.getSelectedOptions()) {
					optionsSelected.push(this.virtualselectConfigs.getSelectedOptions()); // It returns an single object of selected option
				}
			}

			return optionsSelected;
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Search.OSUIVirtualSelectSearch
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this.virtualselectOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance();
		}

		/**
		 * Update property value from a given property name at OnParametersChange
		 *
		 * @param {string} propertyName the name of the property that will be changed
		 * @param {unknown} propertyValue the new value that should be assigned to the given property name
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Search.OSUIVirtualSelectSearch
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.AllowMultipleSelection:
						this.redraw();
						break;
				}
			}
		}
	}
}
