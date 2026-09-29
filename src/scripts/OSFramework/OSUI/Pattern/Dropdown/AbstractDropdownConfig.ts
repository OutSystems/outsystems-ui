// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Dropdown {
	export abstract class AbstractDropdownConfig extends Patterns.AbstractProviderConfiguration {
		// Renders the dropdown disabled.
		public IsDisabled: boolean;
		// Opens the options list as a centred popup instead of an anchored dropbox (below PopupDropboxBreakpoint).
		public ShowDropboxAsPopup: boolean;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns {unknown} value
		 * @memberof  OSFramework.Patterns.Dropdown.AbstractDropdownConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.IsDisabled:
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
