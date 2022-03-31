/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.Dropdown.OSUIComponents {
	/**
	 * Class that represents the custom configurations received by the Dropdown.
	 *
	 * @export
	 * @class OSUIDropdownServerSideConfig
	 * @extends {OSUIFramework.Patterns.AbstractConfiguration}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownServerSideConfig extends OSUIFramework.Patterns.AbstractConfiguration {
		// Store the MaxHeight for the balloon
		private _balloonMaxHeight = Enum.PropertiesValues.MaxHeight;
		// Properties
		public AllowMultipleSelection: boolean;
		public IsDisabled: boolean;

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
				case Enum.Properties.IsDisabled:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}

		/**
		 * Getter that allows to obtain the MaxHeight that ballon should have.
		 *
		 * @readonly
		 * @type {number}
		 * @memberof OSUIDropdownServerSideConfig
		 */
		public get balloonMaxHeight(): number {
			return this._balloonMaxHeight;
		}
	}
}
