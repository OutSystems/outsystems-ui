/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.OSUI.Dropdown.VirtualSelect.Search {
	/**
	 * Class that represents the custom configurations received by the Dropdown Search mode.
	 *
	 * @export
	 * @class VirtualSelectSearchConfig
	 * @extends {AbstractVirtualSelectConfig}
	 */
	export class VirtualSelectSearchConfig extends AbstractVirtualSelectConfig {
		public AllowMultipleSelection: boolean;

		/**
		 * Method used to get the key values of the given selected values
		 *
		 * @protected
		 * @return {*}  {string[]}
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Search.VirtualSelectSearchConfig
		 */
		protected getSelectedValues(): string[] {
			const selectedKeyvalues = [];
			// Has selected values?
			if (this.StartingSelection?.length > 0) {
				// Check if it's multiple options
				if (this.AllowMultipleSelection) {
					// Get the selected key value
					for (const option of this.StartingSelection) {
						if (option.value !== OSFramework.OSUI.Constants.EmptyString) {
							selectedKeyvalues.push(option.value);
						}
					}
				} else {
					// It's Single option, set only the first given value
					if (this.StartingSelection[0].value !== OSFramework.OSUI.Constants.EmptyString) {
						selectedKeyvalues.push(this.StartingSelection[0].value);
					}
				}
			}

			return selectedKeyvalues;
		}

		/**
		 * Set the configs for the Dropdown Search mode
		 *
		 * @return {*}  {VirtualSelectOpts}
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Search.VirtualSelectSearchConfig
		 */
		public getProviderConfig(): VirtualSelectOpts {
			const virtualSelectSearchOpts = {
				multiple: this.AllowMultipleSelection,
			};

			return this.mergeConfigs(super.getProviderConfig(), virtualSelectSearchOpts, this.providerExtendedOptions);
		}

		/**
		 * Override, validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.Search.VirtualSelectSearchConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.AllowMultipleSelection:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
