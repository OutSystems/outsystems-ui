// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.BottomSheet {
	/**
	 * Class that represents the custom configurations received by the BottomSheet.
	 *
	 * @export
	 * @class BottomSheetConfig
	 * @extends {AbstractConfiguration}
	 */
	export class BottomSheetConfig extends AbstractConfiguration {
		public Shape: GlobalEnum.ShapeTypes;
		public ShowHandler: boolean;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Override, Validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof AbstractBottomSheetConfig
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
				case Enum.Properties.ShowHandler:
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
