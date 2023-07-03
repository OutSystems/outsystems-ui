/// <reference path="../AbstractConfiguration.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Submenu/SubmenuConfig.ts
namespace OSFramework.Patterns.Submenu {
========
namespace OSFramework.OSUI.Patterns.Submenu {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Submenu/SubmenuConfig.ts
	export class SubmenuConfig extends AbstractConfiguration {
		/** PUBLIC PROPERTIES **/
		public OpenOnHover = false;

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns {unknown} value
		 * @memberof  OSFramework.Patterns.Submenu.SubmenuConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.OpenOnHover:
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
