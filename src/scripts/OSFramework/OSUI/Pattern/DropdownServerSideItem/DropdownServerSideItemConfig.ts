// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.DropdownServerSideItem {
	/**
	 * Class that represents the custom configurations received by the DropdownServerSideItem.
	 */
	export class DropdownServerSideItemConfig extends AbstractConfiguration {
		/** Marks the item as selected when it is built. */
		public IsSelected: boolean;
		/** Identifier of the item reported to the parent dropdown when it is selected. */
		public ItemId: string;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns value
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
