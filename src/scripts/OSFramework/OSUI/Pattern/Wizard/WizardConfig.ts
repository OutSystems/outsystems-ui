// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Wizard {
	/**
	 * Class that represents the custom configurations received by Wizard.
	 *
	 * @export
	 * @class WizardConfig
	 * @extends {AbstractConfiguration}
	 */
	export class WizardConfig extends AbstractConfiguration {
		public IsVertical: boolean;
		public StepBehavior: Enum.StepBehavior;

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be set
		 * @returns {*}
		 * @memberof OSFramework.Patterns.Wizard.WizardConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.IsVertical:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.StepBehavior:
					validatedValue = this.validateInRange(
						value,
						Enum.StepBehavior.Interactive,
						Enum.StepBehavior.ProgressOnly
					);
					break;
			}

			return validatedValue ?? super.validateDefault(key, value);
		}
	}
}
