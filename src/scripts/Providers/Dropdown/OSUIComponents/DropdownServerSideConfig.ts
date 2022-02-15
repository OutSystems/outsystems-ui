/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.OSUIComponents {
	/**
	 * Class that represents the custom configurations received by the Dropdown.
	 *
	 * @export
	 * @class OSUIDropdownServerSideConfig
	 * @extends {OSUIFramework.Patterns.Dropdown.AbstractDropdownConfig}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownServerSideConfig extends OSUIFramework.Patterns.Dropdown.AbstractDropdownConfig {
		public AllowMultipleSelection: boolean;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * This method has no implementation on this context.
		 *
		 * @memberof DropdownAdvancedSearchConfig
		 */
		public getProviderConfig(): void {
			throw new Error(
				`${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.code}:	${OSUIFramework.ErrorCodes.Dropdown.HasNoImplementation.message}`
			);
		}

		/**
		 * Override, validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof OSUIDropdownServerSideConfig
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
