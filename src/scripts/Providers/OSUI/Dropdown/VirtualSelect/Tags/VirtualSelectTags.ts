/// <reference path="../AbstractVirtualSelect.ts" />
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Dropdown.VirtualSelect.Tags {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIVirtualSelectTags extends AbstractVirtualSelect<VirtualSelectTagsConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VirtualSelectTagsConfig(configs));

			// Set the AriaLabel text value for the hidden text input wrapper
			this._hiddenInputWrapperAriaLabelVal = Dropdown.VirtualSelect.Enum.PropertiesValues.AriaLabelMultipleValue;
		}

		/**
		 * Get the selected values options that will be used to pass into platform as a JSON string
		 *
		 * @protected
		 * @return {*}  {DropDownOption[]}
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Tags.OSUIVirtualSelectTags
		 */
		protected getSelectedOptionsStructure(): DropDownOption[] {
			// Store the options selected
			const optionsSelected = this._virtualselectConfigs.getSelectedOptions();

			return optionsSelected;
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Tags.OSUIVirtualSelectTags
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this._virtualselectOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance();
		}
	}
}
