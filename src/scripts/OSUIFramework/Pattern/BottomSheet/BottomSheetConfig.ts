// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.BottomSheet {
	/**
	 * Class that represents the custom configurations received by the BottomSheet.
	 *
	 * @export
	 * @class BottomSheetConfig
	 * @extends {AbstractConfiguration}
	 */
	export class BottomSheetConfig extends AbstractConfiguration {
		// TODO (by CreateNewPattern): add all properties received as config (JSON from platform)

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
