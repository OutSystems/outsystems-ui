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
		public IsSelected: boolean;
		public ItemId: string;

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
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.IsSelected:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;

				case Enum.Properties.ItemId:
					validatedValue = this.validateString(value as string, undefined);
					break;

				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
