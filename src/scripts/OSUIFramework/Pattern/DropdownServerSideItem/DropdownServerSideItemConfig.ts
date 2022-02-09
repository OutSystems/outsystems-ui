// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.DropdownServerSideItem {
	/**
	 * Class that represents the custom configurations received by the DropdownServerSideItem.
	 *
	 * @export
	 * @class DropdownServerSideItemConfig
	 * @extends {AbstractConfiguration}
	 */
	export class DropdownServerSideItemConfig extends AbstractConfiguration {
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
		 * @memberof AbstractDropdownServerSideItemConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			const validatedValue = undefined;

			console.log('DO THINGS HERE!');
			// switch (key) {
			// 	case Enum.Properties.PROP_NAME1:
			// 		// TODO (by CreateNewPattern): Replace with expected property
			// 		// validatedValue = this.validateBoolean(value as boolean, false);
			// 		break;
			// }

			return validatedValue;
		}
	}
}
