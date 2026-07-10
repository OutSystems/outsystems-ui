// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.WizardItem {
	/**
	 * Class that represents the custom configurations received by WizardItem.
	 *
	 * @export
	 * @class WizardItemConfig
	 * @extends {AbstractConfiguration}
	 */
	export class WizardItemConfig extends AbstractConfiguration {
		/**
		 * ReverseLabelPosition property value
		 */
		public ReverseLabelPosition: boolean;

		/**
		 * Status property value
		 */
		public Status: Enum.Status;

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be set
		 * @returns {*}
		 * @memberof OSFramework.Patterns.WizardItem.WizardItemConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.ReverseLabelPosition:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Status:
					validatedValue = this.validateInRange(
						value,
						Enum.Status.Active,
						Enum.Status.Next,
						Enum.Status.Past
					);
					break;
			}

			return validatedValue ?? super.validateDefault(key, value);
		}
	}
}
