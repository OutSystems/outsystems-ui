// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Dropdown.VirtualSelect.Tags {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIVirtualSelectTags extends AbstractVirtualSelect<VirtualSelectTagsConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VirtualSelectTagsConfig(configs));
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
			const optionsSelected = this.virtualselectConfigs.getSelectedOptions();

			return optionsSelected;
		}
	}
}
