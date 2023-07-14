// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Accordion {
	/**
	 * Class that represents the custom configurations received by Accordion.
	 *
	 * @export
	 * @class AccordionConfig
	 * @extends {AbstractConfiguration}
	 */
	export class AccordionConfig extends AbstractConfiguration {
		public MultipleItems: boolean;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method used to validate default value before apply it's change!
		 *
		 * @param key property name
		 * @param value value to be set
		 * @returns {*}
		 * @memberof OSFramework.Patterns.Accordion.AccordionConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.MultipleItems:
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
