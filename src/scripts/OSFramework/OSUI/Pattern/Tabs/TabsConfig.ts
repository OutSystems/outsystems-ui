// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Tabs {
	/**
	 * Class that represents the custom configurations received by Tabs.
	 *
	 * @export
	 * @class TabsConfig
	 * @extends {AbstractConfiguration}
	 */
	export class TabsConfig extends AbstractConfiguration {
		public ContentAutoHeight: boolean;
		public Height: string;
		public JustifyHeaders: boolean;
		public StartingTab: number;
		public TabsOrientation: GlobalEnum.Orientation;
		public TabsVerticalPosition: GlobalEnum.Direction;

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns {boolean} boolean
		 * @memberof  OSFramework.Patterns.Tabs.TabsConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartingTab;
			}
			return true;
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns {unknown} value
		 * @memberof  OSFramework.Patterns.Tabs.TabsConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.TabsOrientation:
					validatedValue = this.validateInRange(
						value,
						GlobalEnum.Orientation.Horizontal,
						GlobalEnum.Orientation.Vertical
					);
					break;
				case Enum.Properties.TabsVerticalPosition:
					validatedValue = this.validateInRange(value, GlobalEnum.Direction.Left, GlobalEnum.Direction.Right);
					break;
				case Enum.Properties.ContentAutoHeight:
				case Enum.Properties.JustifyHeaders:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Height:
					validatedValue = this.validateString(value as string, GlobalEnum.CssProperties.Auto);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
