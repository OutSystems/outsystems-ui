/// <reference path="../AbstractConfiguration.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Submenu {
	export class SubmenuConfig extends AbstractConfiguration {
		/** PUBLIC PROPERTIES **/
		public OpenOnHover = false;

		constructor(config: JSON) {
			super(config);
		}

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
