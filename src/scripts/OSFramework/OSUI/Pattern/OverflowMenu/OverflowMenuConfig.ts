// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	/**
	 * Class that represents the custom configurations received by the OverflowMenu.
	 *
	 * @export
	 * @class OverflowMenuConfig
	 * @extends {AbstractConfiguration}
	 */
	export class OverflowMenuConfig extends AbstractConfiguration {
		public Position: GlobalEnum.FloatingPosition;
		public Shape: GlobalEnum.ShapeTypes;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Override, Validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof OverflowMenuConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.Shape:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.ShapeTypes.SoftRounded,
						GlobalEnum.ShapeTypes.Sharp,
						GlobalEnum.ShapeTypes.Rounded
					);
					break;
				case Enum.Properties.Position:
					validatedValue = this.validateString(value as string, GlobalEnum.FloatingPosition.Auto);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
