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
		public AllowMultipleSelection: boolean;
		public SearchPrompt: string;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method used to get the key values of the given selected values
		 *
		 * @protected
		 * @return {*}  {string[]}
		 * @memberof VirtualSelectSearchConfig
		 */
		protected _getSelectedValues(): string[] {
			const selectedKeyvalues = [];

			// Has selected values?
			if (this.SelectedOptions.length > 0) {
				// Check if it's multiple options
				if (this.AllowMultipleSelection) {
					// Get the selected key value
					for (const option of this.SelectedOptions) {
						selectedKeyvalues.push(option.value);
					}
				} else {
					// It's Single option, set only the first given value
					selectedKeyvalues.push(this.SelectedOptions[0].value);
				}
			}

			return selectedKeyvalues;
		}

		/**
		 * Set the configs for the Dropdown Search mode
		 *
		 * @return {*}  {VirtualSelectOpts}
		 * @memberof VirtualSelectSearchConfig
		 */
		public getProviderConfig(): VirtualSelectOpts {
			const virtualSelectSearchOpts = {
				multiple: this.AllowMultipleSelection,
				noSearchResultsText: this.NoResultsText,
				search: true,
				searchPlaceholderText: this.SearchPrompt,
				showValueAsTags: false,
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

		/**
		 * Override, validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof VirtualSelectSearchConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.AllowMultipleSelection:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.SearchPrompt:
					validatedValue = this.validateString(value as string, undefined);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
