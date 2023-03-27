// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tooltip {
	/**
	 * Class that represents the custom configurations received by the Tooltip.
	 *
	 * @export
	 * @class TooltipConfig
	 * @extends {AbstractConfiguration}
	 */
	export class TooltipConfig extends AbstractConfiguration {
		public IsHover: boolean;
		public Position: GlobalEnum.Position;
		public StartVisible: boolean;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns {boolean} boolean
		 * @memberof  OSFramework.Patterns.Tooltip.TooltipConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartVisible;
			}
			return true;
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns {unknown} value
		 * @memberof  OSFramework.Patterns.Tooltip.TooltipConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.IsHover:
					validatedValue = this.validateBoolean(value as boolean, true);
					break;
				case Enum.Properties.StartVisible:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Position:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Position.Right,
						Object.values(GlobalEnum.Position)
					);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}
			return validatedValue;
		}
	}
}
