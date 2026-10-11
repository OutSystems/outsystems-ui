// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Spinner {
	/**
	 * Class that represents the custom configurations received by the Spinner.
	 *
	 * @export
	 * @class SpinnerConfig
	 * @extends {AbstractConfiguration}
	 */
	export class SpinnerConfig extends AbstractConfiguration {
		public AnimationType: Enum.AnimationType;
		public Color: string;
		public Size: Enum.Size;

		constructor(config: JSON) {
			super(config);

			// AbstractConfiguration only validates the keys present in the received JSON, so validate
			// the Spinner keys again to give missing ones their defaults. Field initializers can't be
			// used for this: they run after super() and would overwrite the received values.
			this.AnimationType = this.validateDefault(
				Enum.Properties.AnimationType,
				this.AnimationType
			) as Enum.AnimationType;
			this.Color = this.validateDefault(Enum.Properties.Color, this.Color) as string;
			this.Size = this.validateDefault(Enum.Properties.Size, this.Size) as Enum.Size;
		}

		/**
		 * Validates the configuration values, applying defaults when a value is missing or invalid.
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof OSFramework.Patterns.Spinner.SpinnerConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.AnimationType:
					validatedValue = this.validateInRange(
						value,
						Enum.AnimationType.Default,
						Object.values(Enum.AnimationType)
					);
					break;
				case Enum.Properties.Color:
					validatedValue = typeof value === 'string' ? value.trim() : '';
					break;
				case Enum.Properties.Size:
					validatedValue = this.validateInRange(value, Enum.Size.Xsmall, Object.values(Enum.Size));
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
